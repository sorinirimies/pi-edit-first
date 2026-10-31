# Changelog

Generated from [Conventional Commits](https://www.conventionalcommits.org) by
[git-cliff](https://git-cliff.org). Do not edit by hand.

## [0.2.2](https://github.com/sorinirimies/pi-edit-first/releases/tag/v0.2.2) — 2026-10-31


### 🐛 Fixes

- `?` in an ignore glob matches one character (it reached the RegExp unescaped and threw on every tool call) ([`5a905c0`](https://github.com/sorinirimies/pi-edit-first/commit/5a905c0efb9f1d7506de11b9c46c3607e51896cc))

### 🧪 Tests

- Seeded fuzz tests (FUZZ_ITERS / FUZZ_SEED; a failure prints the seed that reproduces it) ([`9563eb3`](https://github.com/sorinirimies/pi-edit-first/commit/9563eb389b0e31d995287db599a6e84907b70b17))

### 🔧 Build & CI

- Fuzz and Security workflows on GitHub and Gitea ([`b043cb1`](https://github.com/sorinirimies/pi-edit-first/commit/b043cb11bb4f48f5205a64631a9ccef7c2e1f519))
## [0.2.1](https://github.com/sorinirimies/pi-edit-first/releases/tag/v0.2.1) — 2026-10-31


### 🔧 Build & CI

- **deps-dev:** Pin undici 8.12.3 via overrides ([`78a6c9e`](https://github.com/sorinirimies/pi-edit-first/commit/78a6c9e7d6e4ae761bb2ba7f926d1df92632bef9))
- Keep .gitea workflow actions up to date; auto-merge needs GH_PAT for action bumps ([`c697b14`](https://github.com/sorinirimies/pi-edit-first/commit/c697b14ab08d7ddd3d08b1113113a3ef00314297))
- **deps:** Bump Gitea workflow actions ([`d230115`](https://github.com/sorinirimies/pi-edit-first/commit/d230115bdd869cfcf75d57601a974ae68b5e49d2))
- One nightly (GitHub); Gitea mirrors GitHub's main and tags hourly ([`c6eb52e`](https://github.com/sorinirimies/pi-edit-first/commit/c6eb52ec57efd8fa7ed3d812e4c7a8822cec1024))

### 🧹 Chores

- Nightly dev-tooling lockfile update 2026-10-31 (not released) ([`ea168ae`](https://github.com/sorinirimies/pi-edit-first/commit/ea168ae53ca47c3f7ebd8eebbbdd26b248ae1b42))
- Nightly dev-tooling lockfile update 2026-10-31 (not released) ([`e48d074`](https://github.com/sorinirimies/pi-edit-first/commit/e48d0749f5f29b0ef378d55f749ffa67557dac51))
- Merge Gitea's main (both hosts ran their own nightly) ([`3dac1d7`](https://github.com/sorinirimies/pi-edit-first/commit/3dac1d76169facf1ffd3cac0ac15257764d3e6f2))
## [0.2.0](https://github.com/sorinirimies/pi-edit-first/releases/tag/v0.2.0) — 2026-10-30


### ✨ Features

- One-shot allow, spelling-proof ignore, command usage + completions ([`a16611c`](https://github.com/sorinirimies/pi-edit-first/commit/a16611c126a937e82b1d5b00dc385042889ceae4))

### 🔧 Build & CI

- **deps:** Bump taiki-e/install-action from 2.87.27 to 2.87.29 (#5) ([`24b7524`](https://github.com/sorinirimies/pi-edit-first/commit/24b7524a875d1bed6daee00e03ea78f7d1e804fb))
- **deps:** Bump hustcer/setup-nu from 3.28 to 3.29 (#6) ([`5e3908a`](https://github.com/sorinirimies/pi-edit-first/commit/5e3908a0dfa883844b0a258845d5ad96faa4f977))
- Auto-merge with GH_PAT, drop forbidden self-approve ([`88c4260`](https://github.com/sorinirimies/pi-edit-first/commit/88c42608e43dd2f19d23d16c3d578f49f39b5b81))
- **deps:** Bump taiki-e/install-action from 2.87.29 to 2.87.31 (#7) ([`71f12e2`](https://github.com/sorinirimies/pi-edit-first/commit/71f12e22b3e647bfd0f79d96061013f50c7f2870))

### 🧹 Chores

- Nightly dev-tooling lockfile update 2026-10-16 (not released) ([`bcae717`](https://github.com/sorinirimies/pi-edit-first/commit/bcae7177638d5340a9394876626604b57195d7da))
- Nightly dev-tooling lockfile update 2026-10-20 (not released) ([`12efaed`](https://github.com/sorinirimies/pi-edit-first/commit/12efaeda0d0aa53ac0d37819e6e850bc7c0945e2))
- Nightly dev-tooling lockfile update 2026-10-21 (not released) ([`0dbd86a`](https://github.com/sorinirimies/pi-edit-first/commit/0dbd86abed57af0933e45ae47e40bac26904407b))
- Nightly dev-tooling lockfile update 2026-10-22 (not released) ([`ff75c5e`](https://github.com/sorinirimies/pi-edit-first/commit/ff75c5e17c5ba7d62ad2ce40b2665945be796a18))
- Nightly dev-tooling lockfile update 2026-10-23 (not released) ([`096e05d`](https://github.com/sorinirimies/pi-edit-first/commit/096e05d195274849087f7227b5c0ad5407ab34b7))
- Nightly dev-tooling lockfile update 2026-10-27 (not released) ([`4c0ba1b`](https://github.com/sorinirimies/pi-edit-first/commit/4c0ba1bddfcdedd302ef0ee357facf6f074dbd73))
- Nightly dev-tooling lockfile update 2026-10-29 (not released) ([`5604f6d`](https://github.com/sorinirimies/pi-edit-first/commit/5604f6dc8ea97f3bef46717d2770a7d580e58ab7))
- Nightly dev-tooling lockfile update 2026-10-30 (not released) ([`e053043`](https://github.com/sorinirimies/pi-edit-first/commit/e053043c232f880f68cf9f6c872bbc52fbd62e5e))
- Ignore the local .codegraph index ([`e0047f5`](https://github.com/sorinirimies/pi-edit-first/commit/e0047f571d5a2ae89fadcb9c9df41137b2c52222))
## [0.1.9](https://github.com/sorinirimies/pi-edit-first/releases/tag/v0.1.9) — 2026-10-15


### 🔧 Build & CI

- Ignore commits already released via the other host's parallel nightly (no phantom patch release) ([`1768152`](https://github.com/sorinirimies/pi-edit-first/commit/17681520cfcc7b8f7051b1dcb016bd6705adcccd))

### 🧹 Chores

- **justfile:** Push/pull current branch instead of hardcoded main ([`ec260a6`](https://github.com/sorinirimies/pi-edit-first/commit/ec260a6580116945306b7f347b1a843244cc3a70))
- Nightly dev-tooling lockfile update 2026-10-15 (not released) ([`40a6fd1`](https://github.com/sorinirimies/pi-edit-first/commit/40a6fd13ed67ff59afad4dce470897b997357e22))
- Nightly dev-tooling lockfile update 2026-10-15 (not released) ([`c42a330`](https://github.com/sorinirimies/pi-edit-first/commit/c42a330a8518a36c6b5a6dceef12fea2cbc1c623))
## [0.1.8](https://github.com/sorinirimies/pi-edit-first/releases/tag/v0.1.8) — 2026-10-14


### 📚 Docs

- Separate install commands for individual copy ([`5b4fe19`](https://github.com/sorinirimies/pi-edit-first/commit/5b4fe19f545a491d0bbee943658eba6caa3b0b1e))

### 🔧 Build & CI

- Don't release on ci(deps) (GitHub Actions) bumps ([`ef1be66`](https://github.com/sorinirimies/pi-edit-first/commit/ef1be665ba3066e05340efabdc4f90064074862f))
- Publish only when a runtime dependency really upgrades (or feat/fix/perf); dev-tooling updates no longer release ([`3c71170`](https://github.com/sorinirimies/pi-edit-first/commit/3c7117041d6fa7d281c45d3f02b0697d46622aa0))
## [0.1.7](https://github.com/sorinirimies/pi-edit-first/releases/tag/v0.1.7) — 2026-10-13


### 📚 Docs

- Separate install commands for individual copy ([`6295e15`](https://github.com/sorinirimies/pi-edit-first/commit/6295e15bf9448635e8a260f38707672a0f232d56))

### 🔧 Build & CI

- Restore the Gitea nightly and release workflows (both hosts run the full pipeline in parallel) ([`fc6472d`](https://github.com/sorinirimies/pi-edit-first/commit/fc6472d4d401dd5532539af4d4a16c377f30c0c2))
- Don't release on ci(deps) (GitHub Actions) bumps ([`950a74d`](https://github.com/sorinirimies/pi-edit-first/commit/950a74d39098dbb8031dbdcd66dabae81cabd053))

### 🧹 Chores

- Just recipes to push, pull and force-push to several remotes (push-all, pull-all, push-tags-all, *-force, sync-starscream, setup-remotes; release-push goes to every remote) ([`fdf9ecf`](https://github.com/sorinirimies/pi-edit-first/commit/fdf9ecff67d16f1735225ad5b79c56ab4c35e8ce))
- Justfile remotes and release recipes in the gitkraft style (gitea-microlab, gitea-starscream, gitea-nexus-lab: push, pull, release, sync, all-remotes and force variants; unconfigured remotes are skipped) ([`dc852f0`](https://github.com/sorinirimies/pi-edit-first/commit/dc852f08983714c37bd36ed43e7049a2d9ed35b8))
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

