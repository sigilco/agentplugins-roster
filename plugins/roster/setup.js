#!/usr/bin/env node
/**
 * roster/setup.js — model availability probe
 *
 * Runs at install time via the `setup` hook. Checks which provider API keys
 * are available and resolves each agent's model to the first reachable option
 * in its fallback chain. When nothing resolves, leaves model unset so the
 * harness uses its default.
 *
 * Output: prints a summary to stdout; no files are modified at this stage
 * (model resolution is advisory — the harness picks up the emitted frontmatter).
 */

const PROVIDER_KEY_MAP = {
  'claude-opus-4-8': 'ANTHROPIC_API_KEY',
  'claude-opus-4-7': 'ANTHROPIC_API_KEY',
  'claude-sonnet-4-6': 'ANTHROPIC_API_KEY',
  'claude-haiku-4-5-20251001': 'ANTHROPIC_API_KEY',
  'gpt-4o': 'OPENAI_API_KEY',
  'gpt-4-turbo': 'OPENAI_API_KEY',
  'glm-5.2': 'ZHIPUAI_API_KEY',
  'glm-4-flash': 'ZHIPUAI_API_KEY',
  'kimi-k2': 'MOONSHOT_API_KEY',
};

const AGENT_FALLBACK_CHAINS = {
  orchestrator: ['claude-opus-4-8', 'glm-5.2', 'kimi-k2', 'gpt-4o'],
  oracle:       ['claude-opus-4-8', 'gpt-4o', 'glm-5.2'],
  explorer:     ['claude-haiku-4-5-20251001', 'glm-4-flash'],
  librarian:    ['claude-sonnet-4-6', 'glm-5.2'],
  fixer:        ['claude-sonnet-4-6', 'glm-5.2', 'kimi-k2'],
};

function isModelAvailable(model) {
  const envKey = PROVIDER_KEY_MAP[model];
  if (!envKey) return false;
  return Boolean(process.env[envKey]);
}

function resolveModel(agentName) {
  const chain = AGENT_FALLBACK_CHAINS[agentName] ?? [];
  return chain.find(isModelAvailable) ?? null;
}

console.log('[roster] Probing available models...\n');

let anyResolved = false;
for (const [agent, chain] of Object.entries(AGENT_FALLBACK_CHAINS)) {
  const resolved = resolveModel(agent);
  if (resolved) {
    console.log(`  ${agent}: ${resolved}`);
    anyResolved = true;
  } else {
    console.log(`  ${agent}: (harness default — no provider key found for chain: ${chain.join(', ')})`);
  }
}

if (!anyResolved) {
  console.log('\n[roster] No provider keys found. All agents will use the harness default model.');
} else {
  console.log('\n[roster] Model resolution complete. Override per-agent at runtime: /model <agent> <model-id>');
}

process.exit(0);
