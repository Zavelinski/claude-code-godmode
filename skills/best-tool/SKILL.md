---
name: best-tool
description: Use when starting any non-trivial task to pick the BEST available capability (skill, plugin, MCP connector, agent, workflow) instead of the first one that works. Maps relevant skills/MCPs/agents, compares, picks the highest-quality fit, announces it, then executes. Trigger with /best-tool or whenever about to start a task by hand without checking for a better tool.
---

# best-tool: pick the best capability, not the first

Run this BEFORE executing a non-trivial task, so you use the highest-quality capability available instead of the first one that happens to work.

## When to run
- Start of any non-trivial task (research, design, build, data pull, doc, scrape, PDF, deploy, review).
- Whenever about to do something by hand and unsure a dedicated skill/MCP exists.
- Skip for trivial turns (chat, one-line answer, obvious single-file edit).

## Steps
1. Name the objective in one line and the task type (code, research, design, data, content, ops, review).
2. Map candidates across all layers:
   - Skills (Skill tool): scan the available-skills list for a domain match.
   - MCP connectors (ToolSearch): search by keyword; include deferred tools (they need ToolSearch before they can be called).
   - Agents (Agent tool) and Workflow: for fan-out, parallel, or multi-step work.
3. Compare on fit and quality, not convenience. A dedicated skill/MCP beats doing it by hand almost always.
4. Pick the best. If two tie, prefer the one more specific to the domain.
5. Announce: state which skill/tool/agent you chose and why, in one line.
6. Execute with it.

## Rule of thumb
- Do not work by hand when a better tool exists.
- First-that-works is a smell. The win is total quality, not speed.
- If nothing fits, say so, then proceed by hand. That is a valid outcome, just make it a decision and not a default.

## Related
- For max-capability mode across a whole session (best-tool plus exhaustive plus verify plus persist), see the godmode skill, or say `godmode`.
