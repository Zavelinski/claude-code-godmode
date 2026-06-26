#!/usr/bin/env node
// godmode — UserPromptSubmit hook: toggle + per-turn reinforcement of GODMODE.
// GODMODE = max-capability mode. While active, inject the directive on every turn
// so the model keeps using the BEST skill/plugin/MCP/agent and stays exhaustive.
// Flag file: ~/.claude/.godmode-active (or $CLAUDE_CONFIG_DIR/.godmode-active)

const fs = require('fs');
const path = require('path');
const os = require('os');

const claudeDir = process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude');
const flagPath = path.join(claudeDir, '.godmode-active');

const DIRECTIVE =
  "GODMODE ACTIVE. Max-capability mode. Before acting on any task: " +
  "(1) Map ALL relevant capabilities (Skill tool, plugins, MCP connectors including deferred via ToolSearch, Agent, Workflow) and use the BEST one, not the first that works; announce the chosen tool/skill. " +
  "(2) Be exhaustive and correct over fast/cheap; for substantial or parallel work, prefer Workflow/subagents and adversarial verification. " +
  "(3) VERIFY before claiming done/works/fixed; leave evidence; never claim without a check. " +
  "(4) Recovery-first: keep changes small, visible, reversible; escalate sensitive surfaces (production, secrets, data, payments, auth). " +
  "(5) On finishing substantial work, persist context (notes, decisions, next steps) so the next session can continue. " +
  "Say 'godmode off' to exit.";

function readFlag() {
  try {
    const st = fs.lstatSync(flagPath);
    if (!st.isFile() || st.size > 64) return false; // no symlink, tiny file only
    return fs.readFileSync(flagPath, 'utf8').trim() === 'on';
  } catch (e) { return false; }
}

let input = '';
process.stdin.on('data', c => { input += c; });
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const text = (data.prompt || '').trim();

    const mentions = /\bgod ?mode\b/i.test(text) || /^\/?god ?mode\b/i.test(text);
    const offWord = /\b(off|stop|disable|deactivate|exit|turn off)\b/i.test(text);
    const onWord = /\b(on|enable|activate|start|mode|turn on)\b/i.test(text);
    const slash = /^\/godmode\b/i.test(text);
    const bare = /^\/?god ?mode[.!]?$/i.test(text);

    if (mentions && offWord) {
      try { fs.unlinkSync(flagPath); } catch (e) {}
    } else if (slash || bare || (mentions && onWord)) {
      try { fs.writeFileSync(flagPath, 'on', { mode: 0o600 }); } catch (e) {}
    }

    if (readFlag()) {
      process.stdout.write(JSON.stringify({
        hookSpecificOutput: {
          hookEventName: "UserPromptSubmit",
          additionalContext: DIRECTIVE
        }
      }));
    }
  } catch (e) {
    // silent fail — never break the prompt
  }
});
