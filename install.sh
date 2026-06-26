#!/usr/bin/env bash
# Install the godmode skill + hook into ~/.claude (or $CLAUDE_CONFIG_DIR).
set -euo pipefail

repo="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
claude_dir="${CLAUDE_CONFIG_DIR:-$HOME/.claude}"

command -v node >/dev/null 2>&1 || { echo "error: node is required (Claude Code hooks run on node)." >&2; exit 1; }

mkdir -p "$claude_dir/skills/godmode" "$claude_dir/skills/best-tool" "$claude_dir/hooks"

cp "$repo/skills/godmode/SKILL.md"    "$claude_dir/skills/godmode/SKILL.md"
cp "$repo/skills/best-tool/SKILL.md"  "$claude_dir/skills/best-tool/SKILL.md"
cp "$repo/hooks/godmode-tracker.js"   "$claude_dir/hooks/godmode-tracker.js"

node "$repo/install/merge-settings.js" add

echo ""
echo "godmode installed into $claude_dir"
echo "Restart Claude Code, then say 'godmode' to activate (and 'godmode off' to stop)."
