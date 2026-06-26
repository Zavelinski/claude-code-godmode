#!/usr/bin/env bash
# Remove the godmode skill + hook from ~/.claude (or $CLAUDE_CONFIG_DIR).
# Leaves the best-tool skill in place (it is useful on its own).
set -euo pipefail

repo="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
claude_dir="${CLAUDE_CONFIG_DIR:-$HOME/.claude}"

node "$repo/install/merge-settings.js" remove || true

rm -rf "$claude_dir/skills/godmode"
rm -f  "$claude_dir/hooks/godmode-tracker.js"
rm -f  "$claude_dir/.godmode-active"

echo "godmode uninstalled from $claude_dir (best-tool skill left in place)."
