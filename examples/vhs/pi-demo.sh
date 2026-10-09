#!/usr/bin/env bash
# Starts a real pi with ONLY the pi-edit-first extension loaded (plus the built-in read, write and
# edit tools), against the synthetic fixture (see fixture.sh): no real files, sessions, skills,
# MCP servers or network are touched.
#
#   eval "$(examples/vhs/fixture.sh env)" && bun examples/vhs/mock-llm.ts 8991 &  bash examples/vhs/pi-demo.sh
set -euo pipefail
REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$HOME/projects/my-app"
exec pi --no-extensions -e "$REPO/extensions/edit-first.ts" \
    --no-skills --no-prompt-templates --no-context-files --no-mcp --no-session \
    --tools read,write,edit --offline
