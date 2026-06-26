---
name: godmode
description: Use when the user says "godmode", "god mode", "/godmode", "ativa godmode", or wants max-capability mode for the session. Turns on exhaustive, best-tool-first behavior: map and use the BEST skill/plugin/MCP/agent, prefer Workflow/subagents for substantial work, verify before claiming done, persist context at the end. A UserPromptSubmit hook keeps it active every turn until "godmode off".
---

# godmode: max-capability mode

Trigger: user says `godmode` / `god mode` / `/godmode` / `ativa godmode`. Turn off with `godmode off` (or stop/disable/sai/desliga together with godmode).

GODMODE means run every task at full power. This skill is the on-demand ritual; the `godmode-tracker.js` UserPromptSubmit hook keeps the directive in context on EVERY turn while active (flag file `~/.claude/.godmode-active`), so it survives long sessions and does not drift.

## What GODMODE means (apply on every task while active)
1. Best tool, not first. Before acting, map ALL relevant capabilities (Skill tool, plugins, MCP connectors including deferred via ToolSearch, Agent, Workflow) and use the BEST fit. Announce the choice. This runs the best-tool ritual.
2. Exhaustive over fast. Optimize for the most correct and complete answer, not the cheapest. For substantial or fan-out work, prefer Workflow/subagents and adversarial verification.
3. Discipline stays on. Apply the karpathy gates. VERIFY before saying done/works/fixed; leave evidence; never claim without a check.
4. Recovery-first. Keep changes small, visible, reversible. Escalate sensitive or irreversible surfaces (prod, secrets, data, payments, auth).
5. Persist context. On finishing substantial work, save the 3 layers (project CLAUDE.md anchor plus global memory/MEMORY.md plus git). Reserve tokens to save before the window closes.

## How it stays on
- Toggle plus per-turn reinforcement live in `~/.claude/hooks/godmode-tracker.js`, registered in settings.json under UserPromptSubmit.
- The hook writes or removes `~/.claude/.godmode-active` and, while active, injects the GODMODE directive each turn.
- Saying `godmode off` removes the flag and stops the injection.

## Related
- best-tool: the per-task capability-mapping ritual that GODMODE runs every time.
- Global rule: CLAUDE.md, section "Use the best capability, not the first one".
