# godmode for Claude Code

[![License: MIT](https://img.shields.io/github/license/Zavelinski/claude-code-godmode)](LICENSE)
[![Stars](https://img.shields.io/github/stars/Zavelinski/claude-code-godmode?style=flat)](https://github.com/Zavelinski/claude-code-godmode/stargazers)
[![Last commit](https://img.shields.io/github/last-commit/Zavelinski/claude-code-godmode)](https://github.com/Zavelinski/claude-code-godmode/commits)
[![Claude Code skill](https://img.shields.io/badge/Claude%20Code-skill-8A2BE2)](https://claude.com/claude-code)

A one-word **max-capability mode** for [Claude Code](https://claude.com/claude-code). Say `godmode` and Claude runs every task at full power for the rest of the session: it maps and uses the *best* available tool (skill / plugin / MCP / agent / workflow) instead of the first that works, stays exhaustive over fast, verifies before claiming done, keeps changes small and reversible, and persists context at the end. Say `godmode off` to stop.

It stays on across long sessions because a small `UserPromptSubmit` hook re-injects the directive on **every turn**, so the behavior never drifts. No drift, no re-typing.

## Prerequisites

Claude Code with `/plugin` support (v2.x+) and a shell if you use the manual fallback.

## Install

### Option 1 — Claude Code plugin marketplace (recommended)

```bash
/plugin marketplace add Zavelinski/claude-code-skills
/plugin install godmode@claude-code-skills
```

Registered hooks (if any) install through the Claude Code consent UI, with no manual edit to `~/.claude/settings.json`.

This plugin registers a `UserPromptSubmit` hook. Option 1 registers it through the Claude Code consent UI; Option 2 (`install.sh`) is the path that auto-mode blocks.

### Option 2 — Manual fallback (run it yourself)

> **Security note.** This script mutates `~/.claude/settings.json` directly. Claude Code auto-mode blocks it because a third-party `UserPromptSubmit` hook that injects text into every prompt is a known risk vector. The script is benign and local-only (no network), but you must review and run it yourself. Prefer Option 1.

```bash
git clone https://github.com/Zavelinski/claude-code-godmode.git
cd claude-code-godmode
bash install.sh        # macOS / Linux
.\install.ps1          # Windows (PowerShell)
```

## Uninstall

```bash
/plugin uninstall godmode@claude-code-skills    # Option 1
bash uninstall.sh                                # Option 2 (or uninstall.ps1 on Windows)
```

## Update

```bash
/plugin marketplace update claude-code-skills    # Option 1
# Option 2: pull the latest commit and re-run the manual fallback.
```

## What you get

| File | Installed to | Purpose |
|------|--------------|---------|
| `skills/godmode/SKILL.md` | `~/.claude/skills/godmode/` | The on-demand ritual Claude reads when you say `godmode`. |
| `skills/best-tool/SKILL.md` | `~/.claude/skills/best-tool/` | The per-task "pick the best capability" ritual godmode runs every time. |
| `hooks/godmode-tracker.js` | `~/.claude/hooks/` (script) or plugin root (plugin) | Toggles the flag and re-injects the directive each turn while active. |
| `hooks/hooks.json` | registered on `/plugin install` | Wires the hook into Claude Code through the plugin's official hook mechanism (no `settings.json` edit). |
| `settings.json` entry | `~/.claude/settings.json` (script install only) | Registers the hook under `UserPromptSubmit` (merged in, never clobbered). |

## Use

- `godmode` / `god mode` / `/godmode` — turn it on.
- `godmode off` — turn it off.
- Check state: the file `~/.claude/.godmode-active` exists (contains `on`) while active.

When active, every turn carries this directive:

1. **Best tool, not first.** Map all relevant capabilities, use the best, announce the choice.
2. **Exhaustive over fast.** Most correct and complete answer; prefer workflows/subagents and adversarial verification for substantial work.
3. **Discipline stays on.** Verify before saying done; leave evidence; never claim without a check.
4. **Recovery-first.** Small, visible, reversible changes; escalate sensitive surfaces (production, secrets, data, payments, auth).
5. **Persist context.** Save notes/decisions/next steps when finishing substantial work.

## Português

There is a Portuguese-flavored variant in [`variants/pt-br/`](variants/pt-br/) (directive and SKILL in PT, tuned to a stricter "recovery-first / persist context in 3 layers" workflow). To use it, copy those two files over the installed ones after running the installer:

```bash
cp variants/pt-br/godmode-tracker.js ~/.claude/hooks/godmode-tracker.js
cp variants/pt-br/SKILL.md           ~/.claude/skills/godmode/SKILL.md
```

## How it works (security note)

The hook is ~60 lines of Node. On every prompt it: reads the prompt text, flips the flag file on/off when it sees `godmode` / `godmode off`, and — while active — prints the directive as `additionalContext`. It makes **no network calls**, touches only `~/.claude/.godmode-active`, and fails silently so it can never break your prompt. Read [`hooks/godmode-tracker.js`](hooks/godmode-tracker.js) before installing (you should, for any hook).

Be clear-eyed about what this is: a hook that **injects text into every prompt**. That is useful here, and it is also a real capability worth gating. The recommended path (Option 1) installs it through Claude Code's own plugin consent flow; the script path (Option 2) must be run by you, not an agent. Either way you are opting in deliberately. This skill does not, and should not, try to get around Claude Code's safety prompts.

## License

MIT. See [LICENSE](LICENSE).

---

## Part of claude-code-skills

This skill ships in the [claude-code-skills](https://zavelinski.github.io/claude-code-skills/) marketplace. Browse its landing page: [godmode](https://zavelinski.github.io/claude-code-skills/godmode.html). See also: [adversarial-verify](https://github.com/Zavelinski/claude-code-adversarial-verify), [salve](https://github.com/Zavelinski/claude-code-salve).
