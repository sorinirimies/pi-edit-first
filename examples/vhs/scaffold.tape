# VHS tape: scaffold
# Hand-writing a project manifest in an empty directory is blocked too: the model is told to
# scaffold with the real tool (`cargo init`) instead of spending tokens on boilerplate.
#
# Runs a real pi with only the pi-edit-first extension loaded (and pi's built-in read, write and
# edit tools), on the throw-away project from fixture.sh. A tiny scripted mock model (mock-llm.ts)
# plays the agent, so the recording shows the REAL guard reacting to REAL tool calls. HOME and
# the pi agent dir are redirected into /tmp: it never touches your real files or settings.

Output examples/vhs/generated/scaffold.gif

Set Shell "bash"
Set FontSize 18
Set Width 1200
Set Height 720
Set Padding 24
Set PlaybackSpeed 1.0
Set Theme "Catppuccin Mocha"

Hide
Type 'bash examples/vhs/fixture.sh >/dev/null && echo DONE-$((6*7))'
Enter
Wait+Screen@60s /DONE-42/
Type 'eval "$(examples/vhs/fixture.sh env)" && (bun examples/vhs/mock-llm.ts 8991 >/dev/null 2>&1 &) ; sleep 1 ; clear'
Enter
Type "bash examples/vhs/pi-demo.sh"
Enter
Wait+Screen@30s /demo-model/
Show

Sleep 2s
Type "Create a new Rust project here"
Sleep 800ms
Enter
Wait+Screen@40s /cargo init/
Sleep 4s

# (hidden) quit pi, then stop the mock model
Hide
Ctrl+D
Sleep 1s
Type "pkill -f mock-llm"
Enter
Sleep 500ms
