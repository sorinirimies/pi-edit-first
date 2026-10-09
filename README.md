# pi-edit-first

Pi extension that cuts output tokens by making the agent **edit, not rewrite**.

Enforcement lives in a `tool_call` hook, so it adds **zero tokens to the system prompt**.
The model only sees a one-line reason when a call is blocked.

## Rules

| # | Blocks | Tells the model |
|---|---|---|
| 1 | `write` over an existing file longer than `maxWriteLines` (default 40) | use `edit` with targeted replacements |
| 2 | `write` of `Cargo.toml`, `settings.gradle[.kts]`, `package.json` in a dir with no project yet | run `cargo init` / `android create` / `npm init -y` |

## Install

```bash
pi install npm:pi-edit-first
# or
pi install git:github.com/sorinirimies/pi-edit-first
```

Applies to every pi session (including pi run as an external agent in editors).

## Commands

- `/edit-first` — status and block count
- `/edit-first off` / `on` — disable / enable for this session
- `/edit-first allow <path>` — allow one full rewrite of `<path>` this session

## Config (optional)

`~/.pi/agent/edit-first.json`:

```json
{ "maxWriteLines": 40, "scaffold": true, "ignore": ["CHANGELOG.md", "*.lock"] }
```

## Notes

- A block costs one extra round trip, far cheaper than a whole-file rewrite.
- Only affects the `write` tool; `edit` is never blocked.
- Does not affect other agents (e.g. Zed's native agent).

MIT
