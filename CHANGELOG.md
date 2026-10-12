# Changelog

Generated from [Conventional Commits](https://www.conventionalcommits.org) by
[git-cliff](https://git-cliff.org). Do not edit by hand.

## [0.1.6](https://github.com/sorinirimies/pi-edit-first/releases/tag/v0.1.6) — 2026-10-12


### 📚 Docs

- List pi-context-diet in the related plugins ([`f6f9358`](https://github.com/sorinirimies/pi-edit-first/commit/f6f9358cdd2ae7425831930f95ae04ee5afcd6df))

### 🧪 Tests

- No test may touch the real ~/.pi/agent (preload sets a temp config dir; the autocomplete test persisted mode=always into it) ([`035a7e8`](https://github.com/sorinirimies/pi-edit-first/commit/035a7e8dfc5e333b463d31128f8a1c25359f744f))

### 🔧 Build & CI

- **deps:** Bump taiki-e/install-action from 2.87.26 to 2.87.27 (#4) ([`973d9dc`](https://github.com/sorinirimies/pi-edit-first/commit/973d9dc7e15f60e39730464140857628c24e8eba))
## [0.1.5](https://github.com/sorinirimies/pi-edit-first/releases/tag/v0.1.5) — 2026-10-12


### 🔧 Build & CI

- **deps:** Bump actions/setup-node from 7.0.0 to 7.1.0 (#3) ([`ad541cb`](https://github.com/sorinirimies/pi-edit-first/commit/ad541cbc23a633ccf38e7468bbd3c761a43272d6))
## [0.1.4](https://github.com/sorinirimies/pi-edit-first/releases/tag/v0.1.4) — 2026-10-12


### 🔧 Build & CI

- **deps:** Bump actions/setup-node from 4.4.0 to 7.0.0 ([`0a2d66b`](https://github.com/sorinirimies/pi-edit-first/commit/0a2d66bbca17f241a9497157ca0980c1a198d3b7))
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

