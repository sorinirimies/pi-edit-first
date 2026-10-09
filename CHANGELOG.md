# Changelog

Generated from [Conventional Commits](https://www.conventionalcommits.org) by
[git-cliff](https://git-cliff.org). Do not edit by hand.

## [0.1.2](https://github.com/sorinirimies/pi-edit-first/releases/tag/v0.1.2) — 2026-10-09


### 🐛 Fixes

- Block messages report the real line count (a trailing newline is not a line) ([`7504ca8`](https://github.com/sorinirimies/pi-edit-first/commit/7504ca89cbbf8c9cd35d50493d1865c8ca0e7f40))

### 🧪 Tests

- Make resolveToolPath tests platform-independent (Windows CI) ([`3745308`](https://github.com/sorinirimies/pi-edit-first/commit/374530875c4222894f2f661a7a6601087aed8316))
- File:// URL case valid on Windows too ([`6311ea6`](https://github.com/sorinirimies/pi-edit-first/commit/6311ea6e91d227825c19355b2773bd0e556cda2a))

### 🔧 Build & CI

- Auto-merge library updates only after CI is green, and publish a patch automatically (any library update ships; major updates wait for review) ([`02b6fd4`](https://github.com/sorinirimies/pi-edit-first/commit/02b6fd42a9cd4695c24c2ebfde51f241d7b93f89))
## [0.1.1](https://github.com/sorinirimies/pi-edit-first/releases/tag/v0.1.1) — 2026-10-09


### 🐛 Fixes

- Resolve paths exactly like pi (@, ~, file://, unicode spaces), stream line counts in constant memory, fail open on errors, harden globs; pin actions to SHAs and pass tags via env ([`6d6fecd`](https://github.com/sorinirimies/pi-edit-first/commit/6d6fecda09ccf40eb4b1acfad9dbaa5edfae206c))

### 🧪 Tests

- Add bun test suite for edit-first ([`acd7420`](https://github.com/sorinirimies/pi-edit-first/commit/acd74201f9e353cd45e9f0bd7bb64a3fad34a8d8))
- Raise coverage to ~100% and enforce 95% thresholds (bunfig), coverage summary in CI, nu tests for every script; extract resolveAgentDir for testability ([`ed90161`](https://github.com/sorinirimies/pi-edit-first/commit/ed90161a90018f6a7cddb8fafc62e672b5e6c3aa))

### 🔧 Build & CI

- Nushell quality gate, GitHub + Gitea workflows (CI, nightly deps + patch release, npm publish), justfile, typecheck ([`94d408a`](https://github.com/sorinirimies/pi-edit-first/commit/94d408ab5b8e238fe7382cac37e6622f78e3dd1d))
## [0.1.0](https://github.com/sorinirimies/pi-edit-first/releases/tag/v0.1.0) — 2026-10-09


### ✨ Features

- Pi-edit-first v0.1.0 ([`640a173`](https://github.com/sorinirimies/pi-edit-first/commit/640a173f461b084b991ec64afca9eefe61ca1038))

