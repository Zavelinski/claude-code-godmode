# Remove the godmode skill + hook from ~/.claude (or $env:CLAUDE_CONFIG_DIR).
# Leaves the best-tool skill in place (it is useful on its own).
$ErrorActionPreference = 'Stop'

$repo = Split-Path -Parent $MyInvocation.MyCommand.Path
$claudeDir = if ($env:CLAUDE_CONFIG_DIR) { $env:CLAUDE_CONFIG_DIR } else { Join-Path $HOME '.claude' }

try { node (Join-Path $repo 'install\merge-settings.js') remove } catch {}

Remove-Item -Recurse -Force (Join-Path $claudeDir 'skills\godmode')        -ErrorAction SilentlyContinue
Remove-Item -Force          (Join-Path $claudeDir 'hooks\godmode-tracker.js') -ErrorAction SilentlyContinue
Remove-Item -Force          (Join-Path $claudeDir '.godmode-active')        -ErrorAction SilentlyContinue

Write-Host "godmode uninstalled from $claudeDir (best-tool skill left in place)."
