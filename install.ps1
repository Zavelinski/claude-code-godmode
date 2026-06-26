# Install the godmode skill + hook into ~/.claude (or $env:CLAUDE_CONFIG_DIR).
$ErrorActionPreference = 'Stop'

$repo = Split-Path -Parent $MyInvocation.MyCommand.Path
$claudeDir = if ($env:CLAUDE_CONFIG_DIR) { $env:CLAUDE_CONFIG_DIR } else { Join-Path $HOME '.claude' }

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Error "node is required (Claude Code hooks run on node)."
}

New-Item -ItemType Directory -Force -Path (Join-Path $claudeDir 'skills\godmode')   | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $claudeDir 'skills\best-tool') | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $claudeDir 'hooks')            | Out-Null

Copy-Item (Join-Path $repo 'skills\godmode\SKILL.md')   (Join-Path $claudeDir 'skills\godmode\SKILL.md')   -Force
Copy-Item (Join-Path $repo 'skills\best-tool\SKILL.md') (Join-Path $claudeDir 'skills\best-tool\SKILL.md') -Force
Copy-Item (Join-Path $repo 'hooks\godmode-tracker.js')  (Join-Path $claudeDir 'hooks\godmode-tracker.js')  -Force

node (Join-Path $repo 'install\merge-settings.js') add

Write-Host ""
Write-Host "godmode installed into $claudeDir"
Write-Host "Restart Claude Code, then say 'godmode' to activate (and 'godmode off' to stop)."
