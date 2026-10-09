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
import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { basename, dirname, isAbsolute, join, resolve } from "node:path";
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
function matchesIgnore(path: string, patterns: string[]): boolean {
	return patterns.some((pat) => {
		const re = new RegExp(`^${pat.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, "[^/]*")}$`);
		return re.test(path) || re.test(basename(path));
	});
}

function countLines(text: string): number {
	return text === "" ? 0 : text.split("\n").length;
}

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

	pi.on("tool_call", async (event, ctx) => {
		if (!enabled || event.toolName !== "write") return undefined;

		const raw = event.input?.path;
		if (typeof raw !== "string" || raw === "") return undefined;
		const abs = isAbsolute(raw) ? raw : resolve(ctx.cwd, raw);

		if (allowed.has(abs) || matchesIgnore(raw, config.ignore)) return undefined;

		const deny = (reason: string) => {
			blocked++;
			if (ctx.hasUI) ctx.ui.notify(`edit-first: blocked write to ${raw}`, "warning");
			return { block: true as const, reason };
		};

		if (existsSync(abs)) {
			let lines = 0;
			try {
				lines = countLines(await readFile(abs, "utf8"));
			} catch {
				return undefined;
			}
			if (lines > config.maxWriteLines) {
				return deny(
					`"${raw}" exists (${lines} lines). Do not rewrite whole files: use the edit tool with small targeted replacements. ` +
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
	});

	pi.registerCommand("edit-first", {
		description: "Status, on/off, or `allow <path>` for pi-edit-first",
		handler: async (args, ctx) => {
			const [cmd, ...rest] = (args ?? "").trim().split(/\s+/).filter(Boolean);
			if (cmd === "off") enabled = false;
			else if (cmd === "on") enabled = true;
			else if (cmd === "allow" && rest.length > 0) {
				const p = rest.join(" ");
				allowed.add(isAbsolute(p) ? p : resolve(ctx.cwd, p));
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
