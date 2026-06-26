# Security

## What this plugin does

godmode is a max-capability mode for Claude Code: a skill plus a UserPromptSubmit hook that keeps best-tool-first, exhaustive, verify-before-done behavior active every turn until "godmode off".

## Hooks

- `UserPromptSubmit` -> `node \${CLAUDE_PLUGIN_ROOT}/hooks/godmode-tracker.js`

The hook reads the user prompt, toggles a local flag file when it sees "godmode" / "godmode off", and, while active, injects a directive into the prompt. It has a symlink guard and writes only to plugin-scoped state.

## Network access

None. The hook, the skill, and the installers perform no network I/O. No telemetry, no exfiltration.

## Filesystem access

- Reads: the user prompt (in-memory), `~/.claude/.godmode-active` flag file.
- Writes: `~/.claude/.godmode-active` flag file, plugin-scoped state.
- The manual `install.sh` / `install/merge-settings.js` also merges one hook entry into `~/.claude/settings.json` (idempotent, preserves existing hooks).

## Why auto-mode blocks install.sh

Claude Code auto-mode blocks `install.sh` because a third-party `UserPromptSubmit` hook injects text into every prompt, which the classifier treats as a permission-system bypass when added to `settings.json` outside the consent flow. This is a property of the install path, not of this plugin. The script is local and benign.

## Trusted install path

Use the plugin marketplace flow, which registers the same hook through the Claude Code consent UI:

```bash
/plugin marketplace add Zavelinski/claude-code-skills
/plugin install godmode@claude-code-skills
```

## Reporting issues

Report at https://github.com/Zavelinski/claude-code-godmode/issues