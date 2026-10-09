import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { mkdtempSync, writeFileSync, rmSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import editFirst from "../extensions/edit-first.ts";

describe("pi-edit-first", () => {
	let testDir: string;
	let handlers: Record<string, Function> = {};
	let commands: Record<string, any> = {};
	let notified: string[] = [];

	const mockPi = {
		on: (event: string, handler: Function) => {
			handlers[event] = handler;
		},
		registerCommand: (name: string, def: any) => {
			commands[name] = def;
		},
	};

	const makeCtx = () => ({
		cwd: testDir,
		hasUI: true,
		ui: {
			notify: (msg: string) => notified.push(msg),
		},
	});

	beforeEach(async () => {
		testDir = mkdtempSync(join(tmpdir(), "pi-edit-first-test-"));
		handlers = {};
		commands = {};
		notified = [];
		editFirst(mockPi as any);
		if (handlers.session_start) {
			await handlers.session_start();
		}
	});

	afterEach(() => {
		rmSync(testDir, { recursive: true, force: true });
	});

	it("allows writing new files", async () => {
		const res = await handlers.tool_call(
			{ toolName: "write", input: { path: "new-file.txt", content: "hello" } },
			makeCtx(),
		);
		expect(res).toBeUndefined();
	});

	it("allows writing small existing files (<= 40 lines)", async () => {
		const filePath = join(testDir, "small.txt");
		writeFileSync(filePath, "line 1\nline 2\nline 3\n");

		const res = await handlers.tool_call(
			{ toolName: "write", input: { path: "small.txt", content: "updated" } },
			makeCtx(),
		);
		expect(res).toBeUndefined();
	});

	it("blocks writing large existing files (> 40 lines)", async () => {
		const filePath = join(testDir, "large.txt");
		const content = Array.from({ length: 50 }, (_, i) => `line ${i + 1}`).join("\n");
		writeFileSync(filePath, content);

		const res = await handlers.tool_call(
			{ toolName: "write", input: { path: "large.txt", content: "overwrite" } },
			makeCtx(),
		);
		expect(res).toBeDefined();
		expect(res?.block).toBe(true);
		expect(res?.reason).toContain("use the edit tool");
		expect(notified.length).toBe(1);
	});

	it("ignores non-write tools like edit", async () => {
		const filePath = join(testDir, "large.txt");
		const content = Array.from({ length: 50 }, (_, i) => `line ${i + 1}`).join("\n");
		writeFileSync(filePath, content);

		const res = await handlers.tool_call(
			{ toolName: "edit", input: { path: "large.txt", edits: [] } },
			makeCtx(),
		);
		expect(res).toBeUndefined();
	});

	it("blocks writing Cargo.toml when no project exists", async () => {
		const res = await handlers.tool_call(
			{ toolName: "write", input: { path: "Cargo.toml", content: "[package]" } },
			makeCtx(),
		);
		expect(res).toBeDefined();
		expect(res?.block).toBe(true);
		expect(res?.reason).toContain("cargo init");
	});

	it("allows writing Cargo.toml if Cargo.toml already exists (e.g. small file)", async () => {
		writeFileSync(join(testDir, "Cargo.toml"), "[package]\nname = \"foo\"\n");
		const res = await handlers.tool_call(
			{ toolName: "write", input: { path: "Cargo.toml", content: "[package]\nname = \"bar\"\n" } },
			makeCtx(),
		);
		expect(res).toBeUndefined();
	});

	it("respects /edit-first allow <path>", async () => {
		const filePath = join(testDir, "large.txt");
		const content = Array.from({ length: 50 }, (_, i) => `line ${i + 1}`).join("\n");
		writeFileSync(filePath, content);

		await commands["edit-first"].handler("allow large.txt", makeCtx());

		const res = await handlers.tool_call(
			{ toolName: "write", input: { path: "large.txt", content: "overwrite" } },
			makeCtx(),
		);
		expect(res).toBeUndefined();
	});

	it("respects /edit-first off and on", async () => {
		const filePath = join(testDir, "large.txt");
		const content = Array.from({ length: 50 }, (_, i) => `line ${i + 1}`).join("\n");
		writeFileSync(filePath, content);

		await commands["edit-first"].handler("off", makeCtx());
		let res = await handlers.tool_call(
			{ toolName: "write", input: { path: "large.txt", content: "overwrite" } },
			makeCtx(),
		);
		expect(res).toBeUndefined();

		await commands["edit-first"].handler("on", makeCtx());
		res = await handlers.tool_call(
			{ toolName: "write", input: { path: "large.txt", content: "overwrite" } },
			makeCtx(),
		);
		expect(res).toBeDefined();
		expect(res?.block).toBe(true);
	});
});
