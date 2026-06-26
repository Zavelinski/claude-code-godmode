#!/usr/bin/env node
// godmode — UserPromptSubmit hook: toggle + per-turn reinforcement of GODMODE.
// GODMODE = max-capability mode. While active, inject the directive on every turn
// so the model keeps using the BEST skill/plugin/MCP/agent and stays exhaustive.
// Mirrors the caveman persistent-mode pattern. Flag file: ~/.claude/.godmode-active

const fs = require('fs');
const path = require('path');
const os = require('os');

const claudeDir = process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude');
const flagPath = path.join(claudeDir, '.godmode-active');

const DIRECTIVE =
  "GODMODE ATIVO. Modo capacidade-maxima. Antes de agir em qualquer task: " +
  "(1) mapear TODAS as capacidades relevantes (Skill tool, plugins, conectores MCP incluindo deferred via ToolSearch, Agent, Workflow) e usar a MELHOR, nao a primeira que funciona; anunciar o tool/skill escolhido. " +
  "(2) Ser exaustivo e correto acima de rapido/barato; para trabalho substancial ou em paralelo, preferir Workflow/subagents e verificacao adversarial. " +
  "(3) Aplicar os gates karpathy; VERIFICAR antes de dizer pronto/funciona/corrigido; deixar evidencia; nunca afirmar sem um check. " +
  "(4) Recovery-first: mudancas pequenas, visiveis, reversiveis; escalar superficies sensiveis (prod, segredos, dados, pagamentos, auth). " +
  "(5) Ao fechar trabalho substancial, persistir contexto nas 3 camadas (CLAUDE.md do projeto + memoria global/MEMORY.md + git) e reservar tokens para salvar antes da janela fechar. " +
  "Dizer 'godmode off' para sair.";

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
    const offWord = /\b(off|stop|disable|deactivate|desativ\w*|desliga\w*|sai|sair|exit|turn off)\b/i.test(text);
    const onWord = /\b(on|ativ\w*|liga\w*|enable|activate|start|modo|turn on)\b/i.test(text);
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
