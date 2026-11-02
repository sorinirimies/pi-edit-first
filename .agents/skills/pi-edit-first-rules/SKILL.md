---
name: pi-edit-first-rules
description: Rules for work in the pi-edit-first repository that the code can't show: constraints, ownership and must-keep behaviour. Use before changing, fixing, reviewing or extending code here, together with the typescript-in-projects skill.
---

# pi-edit-first: rules the code can't show

Hard constraints for this repository. The general conventions (orientation, tests,
scripting, releasing) are in the `typescript-in-projects` skill; this file holds only what is
specific to pi-edit-first.

* Blocks whole-file `write` over existing files longer than `maxWriteLines`, and
  hand-written manifests in a directory with no project; the reason names the
  scaffolder to run.
