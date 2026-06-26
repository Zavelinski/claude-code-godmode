# godmode for Claude Code

[![License: MIT](https://img.shields.io/github/license/Zavelinski/claude-code-godmode)](LICENSE)
[![Stars](https://img.shields.io/github/stars/Zavelinski/claude-code-godmode?style=flat)](https://github.com/Zavelinski/claude-code-godmode/stargazers)
[![Last commit](https://img.shields.io/github/last-commit/Zavelinski/claude-code-godmode)](https://github.com/Zavelinski/claude-code-godmode/commits)
[![Claude Code skill](https://img.shields.io/badge/Claude%20Code-skill-8A2BE2)](https://claude.com/claude-code)

A one-word **max-capability mode** for [Claude Code](https://claude.com/claude-code). Say `godmode` and Claude runs every task at full power for the rest of the session: it maps and uses the *best* available tool (skill / plugin / MCP / agent / workflow) instead of the first that works, stays exhaustive over fast, verifies before claiming done, keeps changes small and reversible, and persists context at the end. Say `godmode off` to stop.

It stays on across long sessions because a small `UserPromptSubmit` hook re-injects the directive on **every turn**, so the behavior never drifts. No drift, no re-typing.

## What you get

| File | Installed to | Purpose |
|------|--------------|---------|
| `skills/godmode/SKILL.md` | `~/.claude/skills/godmode/` | The on-demand ritual Claude reads when you say `godmode`. |
| `skills/best-tool/SKILL.md` | `~/.claude/skills/best-tool/` | The per-task "pick the best capability" ritual godmode runs every time. |
| `hooks/godmode-tracker.js` | `~/.claude/hooks/` (script) or plugin root (plugin) | Toggles the flag and re-injects the directive each turn while active. |
| `hooks/hooks.json` | registered on `/plugin install` | Wires the hook into Claude Code through the plugin's official hook mechanism (no `settings.json` edit). |
| `settings.json` entry | `~/.claude/settings.json` (script install only) | Registers the hook under `UserPromptSubmit` (merged in, never clobbered). |

## Install

### Option 1 — as a plugin (recommended)

Install through Claude Code's own plugin flow, so you explicitly consent to the hook:

```bash
/plugin marketplace add Zavelinski/claude-code-skills
/plugin install godmode@claude-code-skills
```

Restart Claude Code and say `godmode`. This installs the two skills **and** registers the `UserPromptSubmit` hook through Claude Code's official, opt-in plugin mechanism, no manual `settings.json` editing.

### Option 2 — script installer

Clone and run the installer for your OS:

```bash
git clone https://github.com/Zavelinski/claude-code-godmode.git
cd claude-code-godmode
bash install.sh        # macOS / Linux
.\install.ps1          # Windows (PowerShell)
```

> **Run this yourself, in an interactive shell.** `install.sh` registers a `UserPromptSubmit` hook and merges an entry into your `~/.claude/settings.json`. If you ask an AI agent to run it, Claude Code's auto-mode will (correctly) **block** it: a third-party script that installs a per-turn prompt-injecting hook is exactly what that protection exists for. The block is expected, not a bug. Read the code, then run it yourself, or use Option 1.

> Requires Node.js. The installer uses the same node binary that runs it, so the hook works even if `node` is not on PATH inside hook subprocesses (a common Windows gotcha).

Then **restart Claude Code** (so it picks up the new skill and hook) and say `godmode`.

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

## Uninstall

```bash
bash uninstall.sh      # macOS / Linux
```
```powershell
.\uninstall.ps1        # Windows
```

This removes the godmode skill, the hook, the flag file, and the `settings.json` entry. It leaves the `best-tool` skill in place (useful on its own); delete `~/.claude/skills/best-tool` manually if you want it gone too.

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

Part of the **[claude-code-skills](https://github.com/Zavelinski/claude-code-skills)** collection: a suite of focused, original Claude Code skills. See [Install, Option 1](#option-1--as-a-plugin-recommended) for the one-command plugin setup.
