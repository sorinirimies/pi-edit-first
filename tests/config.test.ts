import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { mkdtempSync, writeFileSync, rmSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import editFirst, { resolveAgentDir } from "../extensions/edit-first.ts";

const lines = (n: number) => Array.from({ length: n }, (_, i) => `line ${i + 1}`).join("\n");

describe("pi-edit-first config + edge cases", () => {
	let work: string; // project dir
	let agent: string; // agent config dir
	let handlers: Record<string, Function>;
	let command: any;
	let notes: string[];
	const saved: Record<string, string | undefined> = {};

	const ctx = (hasUI = true) => ({
		cwd: work,
		hasUI,
		ui: { notify: (m: string) => notes.push(m) },
	});
	const write = (path: string, content = "x") => handlers.tool_call({ toolName: "write", input: { path, content } }, ctx());

	const boot = async () => {
		handlers = {};
		editFirst({ on: (e: string, f: Function) => (handlers[e] = f), registerCommand: (_: string, c: any) => (command = c) } as any);
		await handlers.session_start();
	};

	beforeEach(() => {
		for (const k of ["PI_CODING_AGENT_DIR", "XDG_CONFIG_HOME", "HOME"]) saved[k] = process.env[k];
		work = mkdtempSync(join(tmpdir(), "pi-ef-work-"));
		agent = mkdtempSync(join(tmpdir(), "pi-ef-agent-"));
		process.env.PI_CODING_AGENT_DIR = agent;
		notes = [];
	});

	afterEach(() => {
		for (const [k, v] of Object.entries(saved)) {
			if (v === undefined) delete process.env[k];
			else process.env[k] = v;
		}
		rmSync(work, { recursive: true, force: true });
		rmSync(agent, { recursive: true, force: true });
	});

	it("reads maxWriteLines from the config file", async () => {
		writeFileSync(join(agent, "edit-first.json"), JSON.stringify({ maxWriteLines: 5 }));
		writeFileSync(join(work, "a.txt"), lines(6));
		writeFileSync(join(work, "b.txt"), lines(5));
		await boot();
		expect((await write("a.txt"))?.block).toBe(true);
		expect(await write("b.txt")).toBeUndefined();
	});

	it("falls back to the default (40) for invalid values or bad JSON", async () => {
		writeFileSync(join(work, "mid.txt"), lines(30));
		writeFileSync(join(work, "big.txt"), lines(41));
		for (const bad of [JSON.stringify({ maxWriteLines: -3 }), JSON.stringify({ maxWriteLines: "ten" }), "not json{{"]) {
			writeFileSync(join(agent, "edit-first.json"), bad);
			await boot();
			expect(await write("mid.txt")).toBeUndefined();
			expect((await write("big.txt"))?.block).toBe(true);
		}
	});

	it("ignore patterns exempt files (glob on path or basename, non-strings dropped)", async () => {
		writeFileSync(join(agent, "edit-first.json"), JSON.stringify({ ignore: ["CHANGELOG.md", "*.lock", 42, "docs/*.md"] }));
		mkdirSync(join(work, "docs"));
		for (const f of ["CHANGELOG.md", "yarn.lock", "docs/guide.md", "other.md"]) writeFileSync(join(work, f), lines(100));
		await boot();
		expect(await write("CHANGELOG.md")).toBeUndefined();
		expect(await write("yarn.lock")).toBeUndefined();
		expect(await write("docs/guide.md")).toBeUndefined();
		expect((await write("other.md"))?.block).toBe(true);
	});

	it("escapes regex metacharacters in ignore patterns", async () => {
		writeFileSync(join(agent, "edit-first.json"), JSON.stringify({ ignore: ["a.b"] }));
		writeFileSync(join(work, "a.b"), lines(100));
		writeFileSync(join(work, "aXb"), lines(100));
		await boot();
		expect(await write("a.b")).toBeUndefined();
		expect((await write("aXb"))?.block).toBe(true); // "." is literal, not "any char"
	});

	it("scaffold=false disables the manifest rule", async () => {
		writeFileSync(join(agent, "edit-first.json"), JSON.stringify({ scaffold: false }));
		await boot();
		expect(await write("Cargo.toml")).toBeUndefined();
	});

	it("blocks hand-written settings.gradle.kts, settings.gradle and package.json in a bare directory", async () => {
		await boot();
		for (const f of ["settings.gradle.kts", "settings.gradle", "package.json"]) {
			const r = await write(f);
			expect(r?.block).toBe(true);
		}
		expect((await write("settings.gradle.kts"))?.reason).toContain("android create");
		expect((await write("package.json"))?.reason).toContain("npm init");
	});

	it("allows a manifest when a project already exists, and in subdirectories", async () => {
		writeFileSync(join(work, "settings.gradle"), "x");
		mkdirSync(join(work, "sub"));
		await boot();
		expect(await write("settings.gradle.kts")).toBeUndefined(); // groovy settings already there
		expect(await write("sub/Cargo.toml")).toBeUndefined(); // not the project root
	});

	it("handles absolute paths", async () => {
		writeFileSync(join(work, "big.txt"), lines(100));
		await boot();
		expect((await write(join(work, "big.txt")))?.block).toBe(true);
	});

	it("ignores calls with a missing or empty path", async () => {
		await boot();
		expect(await handlers.tool_call({ toolName: "write", input: {} }, ctx())).toBeUndefined();
		expect(await handlers.tool_call({ toolName: "write", input: { path: "" } }, ctx())).toBeUndefined();
		expect(await handlers.tool_call({ toolName: "write" }, ctx())).toBeUndefined();
	});

	it("does not block when the target cannot be read (e.g. a directory)", async () => {
		mkdirSync(join(work, "somedir"));
		await boot();
		expect(await write("somedir")).toBeUndefined();
	});

	it("does not notify when there is no UI, but still blocks", async () => {
		writeFileSync(join(work, "big.txt"), lines(100));
		await boot();
		const r = await handlers.tool_call({ toolName: "write", input: { path: "big.txt" } }, ctx(false));
		expect(r.block).toBe(true);
		expect(notes).toEqual([]);
	});

	it("resolves the agent dir from XDG_CONFIG_HOME when PI_CODING_AGENT_DIR is unset", async () => {
		delete process.env.PI_CODING_AGENT_DIR;
		const xdg = mkdtempSync(join(tmpdir(), "pi-xdg-"));
		mkdirSync(join(xdg, "pi", "agent"), { recursive: true });
		writeFileSync(join(xdg, "pi", "agent", "edit-first.json"), JSON.stringify({ maxWriteLines: 2 }));
		writeFileSync(join(work, "a.txt"), lines(3));
		process.env.XDG_CONFIG_HOME = xdg;
		await boot();
		expect((await write("a.txt"))?.block).toBe(true);
		rmSync(xdg, { recursive: true, force: true });
	});

	it("resolveAgentDir: PI_CODING_AGENT_DIR wins, then XDG, then ~/.pi/agent", () => {
		expect(resolveAgentDir({ PI_CODING_AGENT_DIR: "/a", XDG_CONFIG_HOME: "/x" }, "/home/u")).toBe("/a");
		expect(resolveAgentDir({ XDG_CONFIG_HOME: "/x" }, "/home/u")).toBe(join("/x", "pi", "agent"));
		expect(resolveAgentDir({}, "/home/u")).toBe(join("/home/u", ".pi", "agent"));
		expect(resolveAgentDir({ PI_CODING_AGENT_DIR: "", XDG_CONFIG_HOME: "" }, "/home/u")).toBe(join("/home/u", ".pi", "agent"));
	});

	it("/edit-first reports status and counts blocks", async () => {
		writeFileSync(join(work, "big.txt"), lines(100));
		await boot();
		await write("big.txt");
		await write("big.txt");
		await command.handler("", ctx());
		expect(notes.at(-1)).toContain("on · maxWriteLines=40 · scaffold=true · blocked=2");
		await command.handler(undefined, ctx());
		expect(notes.at(-1)).toContain("blocked=2");
	});

	it("/edit-first allow without a path just shows status; allow works with absolute paths and spaces", async () => {
		writeFileSync(join(work, "my file.txt"), lines(100));
		await boot();
		await command.handler("allow", ctx());
		expect(notes.at(-1)).toContain("edit-first: on");
		await command.handler(`allow ${join(work, "my file.txt")}`, ctx());
		expect(await write("my file.txt")).toBeUndefined();
	});

	it("session_start resets the counters and the allow list", async () => {
		writeFileSync(join(work, "big.txt"), lines(100));
		await boot();
		await command.handler("allow big.txt", ctx());
		await command.handler("off", ctx());
		await handlers.session_start();
		expect((await write("big.txt"))?.block).toBe(true);
		await command.handler("", ctx());
		expect(notes.at(-1)).toContain("blocked=1");
	});
});
