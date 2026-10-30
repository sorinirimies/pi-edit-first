# pi-edit-first

[![npm](https://img.shields.io/npm/v/pi-edit-first.svg)](https://www.npmjs.com/package/pi-edit-first)
[![npm downloads](https://img.shields.io/npm/dm/pi-edit-first.svg)](https://www.npmjs.com/package/pi-edit-first)
[![CI](https://github.com/sorinirimies/pi-edit-first/actions/workflows/ci.yml/badge.svg)](https://github.com/sorinirimies/pi-edit-first/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A [pi](https://github.com/earendil-works/pi-coding-agent) extension that cuts output tokens by making the agent **edit, not rewrite**.

Enforcement lives in a `tool_call` hook, so it adds **zero tokens to the system prompt**. The model only sees a one-line reason when a call is blocked.

<img src="examples/vhs/generated/overview.gif" alt="The agent tries to rewrite a whole file; pi-edit-first blocks it and the agent makes a one-line targeted edit instead" width="900">

## Rules

| # | Blocks | Tells the model |
|---|---|---|
| 1 | `write` over an existing file longer than `maxWriteLines` (default 40) | use `edit` with targeted replacements |
| 2 | `write` of `Cargo.toml`, `settings.gradle[.kts]`, `package.json` in a dir with no project yet | run `cargo init` / `android create` / `npm init -y` |

## Install

From npm:

```bash
pi install npm:pi-edit-first
```

Or from git:

```bash
pi install git:github.com/sorinirimies/pi-edit-first
```

Applies to every pi session (including pi run as an external agent in editors).

## Previews

Recorded from a real pi with only this plugin loaded; a small scripted mock model plays the agent, so you see the **real guard** reacting to **real tool calls**.

**A whole-file rewrite is blocked, the agent makes a targeted edit** (one line added, not 62 rewritten):

![The write is blocked and the agent falls back to a one-line edit](examples/vhs/generated/overview.gif)

**Hand-written manifests are blocked too** (scaffold with the real tool instead):

![Writing Cargo.toml by hand is blocked: run cargo init](examples/vhs/generated/scaffold.gif)

**Commands:** status and block count, `off` / `on`, and `allow <path>` for one deliberate rewrite:

![/edit-first status, off, on and allow](examples/vhs/generated/commands.gif)

## Commands

- `/edit-first`: status and block count
- `/edit-first off` / `on`: disable / enable for this session
- `/edit-first allow <path>`: allow the next full rewrite of `<path>` (one-shot; run it again for another)

## Config (optional)

`~/.pi/agent/edit-first.json`:

```json
{ "maxWriteLines": 40, "scaffold": true, "ignore": ["CHANGELOG.md", "*.lock"] }
```

`ignore` globs (`*` = anything but `/`) match the path relative to the working directory or the file name, however the path is spelled (`./x`, `@x`, absolute, `\`).

## Notes

- A block costs one extra round trip, far cheaper than a whole-file rewrite.
- Only affects the `write` tool; `edit` is never blocked.
- Line counts match `wc -l` (a trailing newline is not an extra line).
- Does not affect other agents (e.g. Zed's native agent).

## Security notes

- **A token saver, not a sandbox.** It guards pi's `write` tool. An agent can still write files through `bash`; the guard exists to keep wasteful rewrites out of your context, not to confine the agent.
- **Same path as the tool.** Paths are resolved exactly like pi's own tools (`@file`, `~/file`, `file://`, Unicode spaces, Windows shell paths), so those spellings can't slip past it. A contract test compares it with pi's real `resolveToCwd`.
- **Fails open.** pi blocks a tool when a `tool_call` handler throws, so any unexpected error here means "allow": the guard can never stop legitimate work.
- **Constant memory.** Line counts are streamed (64 KB chunks, early exit), never the whole file.
- No network access, no shell commands, **zero runtime dependencies**.

## Development

```bash
bun install
just check          # typecheck + tests + pack check + nushell tests (what CI runs)
just test           # bun test only (with coverage)
just coverage       # tests + a coverage table
just push-all       # push main to every configured remote (origin + the Gitea instances); `just --list` has pull-all, push-tags-all, release-all, the *-force and sync-gitea-* variants
```

**Coverage:** every `bun test` collects coverage (`bunfig.toml`) and **fails below 95% lines / 95% functions**. CI shows the table on the run page and uploads `lcov.info`.

CI scripts are [nushell](https://www.nushell.sh) (`scripts/`), the same ones locally and in GitHub / Gitea Actions.
`just --list` shows every task.

## Demo recordings

The GIFs above live in [`examples/vhs/generated/`](examples/vhs/generated) and are stored with **Git LFS** (`git lfs install` once). They are recorded with [VHS](https://github.com/charmbracelet/vhs) from a **real pi** that loads only this extension, on **synthetic** data (`examples/vhs/fixture.sh`), never from real files, sessions or credentials. The agent is a scripted mock model (`examples/vhs/mock-llm.ts`), so the recording is repeatable.

```sh
just vhs-all          # every tape (examples/vhs/*.tape): needs vhs, ttyd, ffmpeg, pi, bun, python3
just vhs-tape overview  # one tape
just vhs-list         # list the tapes
just demo             # try it yourself in a real pi on the same synthetic data
```

## Releases (automatic)

| Workflow | When | What |
|---|---|---|
| **CI** | push / PR | quality gate on Linux; tests on macOS and Windows |
| **Auto-merge library updates** | CI finished on a Dependabot PR | **patch and minor** updates (GitHub Actions) are merged automatically, but only **after CI is green** on that exact commit; a **major** update waits for you. Needs the `GH_PAT` secret: action bumps change `.github/workflows/*`, which `GITHUB_TOKEN` may not merge |
| **Gitea Actions Update** | Mondays 03:15 UTC | Gitea has no Dependabot: moves the sha pins in `.gitea/workflows` to the newest release of the **same major** and commits `ci(deps)`; a new major is only reported |
| **Nightly Dependency Update** | every night (GitHub 02:00 UTC, Gitea 02:30) and after each auto-merge | `bun update` within ranges, verify on all platforms, commit `chore(deps)`; then **build, tag and publish a new patch** whenever a library was upgraded or merged, or `feat`/`fix`/`perf` commits are waiting since the last tag |
| **Release** | tag `vX.Y.Z` | validates the tag against `package.json`, runs the gate, `npm publish` (idempotent, with provenance), creates the release |

So library updates need no human: they are merged once CI passes, built, versioned and published as a patch. A downgrade, a failing check, or a major update stops the chain and waits for review.

Manual release: `just release patch` (or `minor` / `major` / `X.Y.Z`) bumps, tags and pushes to GitHub; `just release-all patch` pushes to every configured remote; `just push-release-all` pushes an existing bump.

**Secrets** (repo settings): `NPM_TOKEN` is an npm *granular access token* with publish rights and "bypass 2FA" (required for CI publishing). `GH_PAT` (classic PAT, `repo` + `workflow`: needed to auto-merge GitHub Actions bumps; also lets a tag push trigger the release itself). Optional: `GITEA_TOKEN` (Gitea).

Commits follow [Conventional Commits](https://www.conventionalcommits.org); the changelog is generated by git-cliff.

## Related plugins

Four small [pi](https://github.com/earendil-works/pi-coding-agent) extensions that save tokens without adding anything to the system prompt:

| Plugin | What it does |
|---|---|
| [**pi-edit-first**](https://github.com/sorinirimies/pi-edit-first) | Blocks whole-file `write` rewrites and hand-written project manifests, steering the agent to targeted `edit` calls and scaffolders |
| [**pi-read-guard**](https://github.com/sorinirimies/pi-read-guard) | Blocks full reads of large files, steering the agent to `offset`/`limit` or search |
| [**pi-tokenburn**](https://github.com/sorinirimies/pi-tokenburn) | Live token and cost counter in pi's footer, with charts and budgets |
| [**pi-context-diet**](https://github.com/sorinirimies/pi-context-diet) | Drops stale tool results from the context when the prompt cache is already cold, so long sessions cost less |

```bash
pi install npm:pi-edit-first
pi install npm:pi-read-guard
pi install npm:pi-tokenburn
pi install npm:pi-context-diet
```

MIT
