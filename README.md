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
| `hooks/godmode-tracker.js` | `~/.claude/hooks/` | Toggles the flag and re-injects the directive each turn while active. |
| `settings.json` entry | `~/.claude/settings.json` | Registers the hook under `UserPromptSubmit` (merged in, never clobbered). |

## Install

Clone, then run the installer for your OS.

```bash
git clone https://github.com/Zavelinski/claude-code-godmode.git
cd claude-code-godmode
```

**macOS / Linux**
```bash
bash install.sh
```

**Windows (PowerShell)**
```powershell
.\install.ps1
```

Then **restart Claude Code** (so it picks up the new skill and hook) and say `godmode`.

> Requires Node.js (already a prerequisite for Claude Code hooks). The installer uses the same node binary that runs it, so the hook works even if `node` is not on PATH inside hook subprocesses (a common Windows gotcha).

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

The hook is ~60 lines of Node. On every prompt it: reads the prompt text, flips the flag file on/off when it sees `godmode` / `godmode off`, and — while active — prints the directive as `additionalContext`. It makes **no network calls**, touches only `~/.claude/.godmode-active`, and fails silently so it can never break your prompt. Read [`hooks/godmode-tracker.js`](hooks/godmode-tracker.js) before installing if you like (you should, for any hook).

## License

MIT. See [LICENSE](LICENSE).

---

## Install as a Claude Code plugin

```bash
/plugin marketplace add Zavelinski/claude-code-skills
/plugin install godmode@claude-code-skills
```

Part of the **[claude-code-skills](https://github.com/Zavelinski/claude-code-skills)** collection: a suite of focused, original Claude Code skills.
