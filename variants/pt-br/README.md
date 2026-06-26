# Variant: pt-br

Portuguese-flavored godmode. Same mechanism as the default (English) version, but:

- The per-turn directive is written in Portuguese.
- It is tuned to a stricter workflow: applies the "karpathy gates" and, on finishing substantial work, persists context in **3 layers** (project `CLAUDE.md` anchor + global memory/`MEMORY.md` + git/GitHub).

## Use it

After running the normal installer from the repo root, overwrite the two installed files with these:

```bash
cp variants/pt-br/godmode-tracker.js ~/.claude/hooks/godmode-tracker.js
cp variants/pt-br/SKILL.md           ~/.claude/skills/godmode/SKILL.md
```

```powershell
Copy-Item variants\pt-br\godmode-tracker.js (Join-Path $HOME '.claude\hooks\godmode-tracker.js') -Force
Copy-Item variants\pt-br\SKILL.md           (Join-Path $HOME '.claude\skills\godmode\SKILL.md')   -Force
```

Restart Claude Code afterward.
