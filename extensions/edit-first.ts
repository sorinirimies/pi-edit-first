/**
 * pi-edit-first — make the agent edit, not rewrite.
 *
 * Zero prompt tokens: enforcement happens in a `tool_call` hook. The model only
 * sees a short reason when a call is blocked.
 *
 * Rules
 *   1. `write` over an existing file longer than `maxWriteLines` is blocked → use `edit`.
 *   2. `write` of a project manifest (Cargo.toml, settings.gradle[.kts], package.json)
 *      in a directory with no project yet is blocked → use a scaffolder.
 *
 * Commands
 *   /edit-first               status + block count
 *   /edit-first off | on      disable / enable for this session
 *   /edit-first allow <path>  allow one full rewrite of <path> this session
 *
 * Config (optional): <agent dir>/edit-first.json
 *   { "maxWriteLines": 40, "scaffold": true, "ignore": ["CHANGELOG.md", "*.lock"] }
 */

import { existsSync } from "node:fs";
import { open, readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { basename, dirname, isAbsolute, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

interface Config {
	maxWriteLines: number;
	scaffold: boolean;
	ignore: string[];
}

const DEFAULTS: Config = { maxWriteLines: 40, scaffold: true, ignore: [] };

/** Where pi keeps its config: PI_CODING_AGENT_DIR, then $XDG_CONFIG_HOME/pi/agent, then ~/.pi/agent. */
export function resolveAgentDir(env: Record<string, string | undefined>, home: string): string {
	if (env.PI_CODING_AGENT_DIR) return env.PI_CODING_AGENT_DIR;
	if (env.XDG_CONFIG_HOME) return join(env.XDG_CONFIG_HOME, "pi", "agent");
	return join(home, ".pi", "agent");
}

const agentDir = () => resolveAgentDir(process.env, homedir());

async function loadConfig(): Promise<Config> {
	try {
		const p = JSON.parse(await readFile(join(agentDir(), "edit-first.json"), "utf8"));
		return {
			maxWriteLines:
				Number.isFinite(p.maxWriteLines) && p.maxWriteLines > 0 ? p.maxWriteLines : DEFAULTS.maxWriteLines,
			scaffold: typeof p.scaffold === "boolean" ? p.scaffold : DEFAULTS.scaffold,
			ignore: Array.isArray(p.ignore) ? p.ignore.filter((x: unknown) => typeof x === "string") : [],
		};
	} catch {
		return { ...DEFAULTS };
	}
}

/** Minimal glob: `*` matches anything except `/`; matched against path or basename. */
/** Minimal glob (`*` = anything except `/`) against the path or its basename. */
export function matchesIgnore(path: string, patterns: string[]): boolean {
	return patterns.some((pat) => {
		if (pat.length > 256) return false; // absurd pattern: ignore it rather than risk slow matching
		const body = pat.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*+/g, "*").replace(/\*/g, "[^/]*");
		const re = new RegExp(`^${body}$`);
		return re.test(path) || re.test(basename(path));
	});
}


// ---------------------------------------------------------------------------
// Path handling — mirrors pi's own tool path resolution (`resolveToCwd`), so the
// guard looks at the same file the tool will: `@file`, `~/file`, `file://…`,
// Unicode spaces and Windows shell paths are normalised exactly as pi does.
// ---------------------------------------------------------------------------

const UNICODE_SPACES = /[\u00A0\u2000-\u200A\u202F\u205F\u3000]/g;

function normalizeWindowsShellPath(filePath: string): string {
	if (!filePath.startsWith("/") || filePath.startsWith("//") || filePath.includes("\\")) return filePath;
	const m = filePath.match(/^\/(?:mnt\/|cygdrive\/)?([a-z])(?:\/(.*))?$/i);
	if (!m) return filePath;
	return `${m[1].toUpperCase()}:\\${m[2]?.replaceAll("/", "\\") ?? ""}`;
}

export function resolveToolPath(
	input: string,
	cwd: string,
	home: string = homedir(),
	platform: string = process.platform,
): string {
	let p = input.replace(UNICODE_SPACES, " ");
	if (p.startsWith("@")) p = p.slice(1);
	if (platform === "win32") p = normalizeWindowsShellPath(p);
	if (p === "~") p = home;
	else if (p.startsWith("~/") || (platform === "win32" && p.startsWith("~\\"))) p = join(home, p.slice(2));
	if (/^file:\/\//.test(p)) {
		try {
			p = fileURLToPath(p);
		} catch {
			/* malformed URL: leave as is; the tool will report it */
		}
	}
	return isAbsolute(p) ? resolve(p) : resolve(cwd, p);
}

/**
 * Count lines without loading the file: constant memory, and it stops as soon as `cap` is
 * exceeded. Counts like `wc -l`, plus an unterminated last line. `lines` is exact unless `capped`.
 */
export async function countLinesCapped(path: string, cap: number): Promise<{ lines: number; capped: boolean }> {
	const fh = await open(path, "r");
	try {
		const buf = Buffer.allocUnsafe(64 * 1024);
		let newlines = 0;
		let size = 0;
		let lastByte = 0;
		for (;;) {
			const { bytesRead } = await fh.read(buf, 0, buf.length, null);
			if (bytesRead === 0) break;
			size += bytesRead;
			for (let i = 0; i < bytesRead; i++) if (buf[i] === 10) newlines++;
			lastByte = buf[bytesRead - 1];
			if (newlines > cap) return { lines: cap, capped: true }; // at least `newlines` lines: past the cap
		}
		const lines = size === 0 ? 0 : newlines + (lastByte === 10 ? 0 : 1);
		return lines > cap ? { lines: cap, capped: true } : { lines, capped: false };
	} finally {
		await fh.close();
	}
}

/** Lines counted exactly up to this many beyond the limit; past that the message says "over N". */
const COUNT_HEADROOM = 10_000;

/** Manifest → what to run instead, and a marker that proves a project already exists. */
const SCAFFOLDS: Record<string, { hint: string; exists: string[] }> = {
	"Cargo.toml": { hint: "run `cargo init` / `cargo new`", exists: ["Cargo.toml"] },
	"settings.gradle.kts": {
		hint: "run `android create` or `gradle init`",
		exists: ["settings.gradle.kts", "settings.gradle"],
	},
	"settings.gradle": {
		hint: "run `android create` or `gradle init`",
		exists: ["settings.gradle.kts", "settings.gradle"],
	},
	"package.json": { hint: "run `npm init -y`", exists: ["package.json"] },
};

export default function editFirst(pi: ExtensionAPI) {
	let config: Config = { ...DEFAULTS };
	let enabled = true;
	let blocked = 0;
	const allowed = new Set<string>();

	pi.on("session_start", async () => {
		config = await loadConfig();
		enabled = true;
		blocked = 0;
		allowed.clear();
	});

	/**
	 * pi BLOCKS the tool when a `tool_call` handler throws, so a bug here must never
	 * stop legitimate work: any unexpected error means "allow".
	 */
	const guard = async (event: any, ctx: any) => {
		if (!enabled || event.toolName !== "write") return undefined;

		const raw = event.input?.path;
		if (typeof raw !== "string" || raw === "") return undefined;
		const abs = resolveToolPath(raw, ctx.cwd);

		if (allowed.has(abs) || matchesIgnore(raw, config.ignore)) return undefined;

		const deny = (reason: string) => {
			blocked++;
			if (ctx.hasUI) ctx.ui.notify(`edit-first: blocked write to ${raw}`, "warning");
			return { block: true as const, reason };
		};

		if (existsSync(abs)) {
			let count: { lines: number; capped: boolean };
			try {
				count = await countLinesCapped(abs, config.maxWriteLines + COUNT_HEADROOM);
			} catch {
				return undefined;
			}
			if (count.lines > config.maxWriteLines) {
				const size = count.capped ? `over ${count.lines} lines` : `${count.lines} lines`;
				return deny(
					`"${raw}" exists (${size}). Do not rewrite whole files: use the edit tool with small targeted replacements. ` +
						`If a full rewrite is truly required, ask the user to run /edit-first allow ${raw}.`,
				);
			}
			return undefined;
		}

		if (config.scaffold) {
			const scaffold = SCAFFOLDS[basename(abs)];
			if (scaffold && dirname(abs) === resolve(ctx.cwd)) {
				const hasProject = scaffold.exists.some((f) => existsSync(join(dirname(abs), f)));
				if (!hasProject) {
					return deny(
						`No project here yet. Do not hand-write ${basename(abs)}: ${scaffold.hint}, then fill in the logic.`,
					);
				}
			}
		}
		return undefined;
	};

	pi.on("tool_call", async (event, ctx) => {
		try {
			return await guard(event, ctx);
		} catch {
			return undefined;
		}
	});

	pi.registerCommand("edit-first", {
		description: "Status, on/off, or `allow <path>` for pi-edit-first",
		handler: async (args, ctx) => {
			const [cmd, ...rest] = (args ?? "").trim().split(/\s+/).filter(Boolean);
			if (cmd === "off") enabled = false;
			else if (cmd === "on") enabled = true;
			else if (cmd === "allow" && rest.length > 0) {
				const p = rest.join(" ");
				allowed.add(resolveToolPath(p, ctx.cwd));
				ctx.ui.notify(`edit-first: full rewrite of ${p} allowed this session`, "info");
				return;
			}
			ctx.ui.notify(
				`edit-first: ${enabled ? "on" : "off"} · maxWriteLines=${config.maxWriteLines} · scaffold=${config.scaffold} · blocked=${blocked}`,
				"info",
			);
		},
	});
}
