import { definePlugin } from '@agentplugins/core';

/**
 * agentplugins-teams/orchestrator
 *
 * Explicit lead workflow: the orchestrator agent plans a work graph and fans
 * out bounded tasks to roster agents as named subagents.
 *
 * Requires: agentplugins-teams-roster (for agent name resolution at the harness level)
 *
 * Usage: /orchestrate <task-description>
 */
export default definePlugin({
  name: 'teams-orchestrator',
  version: '0.1.0',
  description: 'Explicit lead workflow — /orchestrate delegates tasks to roster agents as subagents',
  license: 'Apache-2.0',

  skills: [
    {
      name: 'orchestrate',
      description:
        'Decompose a complex task into a work graph and fan out to specialist agents ' +
        '(explorer, oracle, fixer, librarian). Roster plugin required for named agent resolution.',
      content: `---
name: orchestrate
description: Decompose and delegate — explicit subagent orchestration workflow
---

# /orchestrate — Explicit Orchestration Workflow

Invoke the \`orchestrator\` agent to plan and delegate a complex task across the roster.

## Prerequisites

Install the roster plugin before the orchestrator:

\`\`\`bash
agentplugins add espetro/agentplugins-teams#plugins/roster
agentplugins add espetro/agentplugins-teams#plugins/orchestrator
\`\`\`

## How it works

1. **Plan** — Orchestrator decomposes the task into a directed work graph.
2. **Delegate** — Each node fans out to the appropriate specialist (no overlapping write ownership):
   - \`explorer\` — read-only recon and grep
   - \`oracle\` — architecture review and hard debugging
   - \`fixer\` — bounded implementation changes
   - \`librarian\` — documentation and external knowledge
3. **Reconcile** — Orchestrator merges results and resolves conflicts.
4. **Verify** — Final state checked against the original acceptance criteria.

## Harness composition

Agents are resolved by **name** at the harness level. Install roster + orchestrator together; the harness links them automatically. Model overrides: \`/model orchestrator claude-sonnet-4-6\`.

## When orchestration is overkill

Use a single agent for tasks that are clearly bounded and don't benefit from specialist delegation. Orchestration adds overhead — reserve it for multi-domain or multi-phase work.
`,
    },
  ],

  commands: [
    {
      name: 'orchestrate',
      description: 'Delegate a complex task to the orchestrator agent with specialist subagents',
      argumentHint: '<task-description>',
      prompt: `You are acting as the orchestrator agent for this task.

Decompose the following task into a work graph, delegate to specialist subagents (explorer, oracle, fixer, librarian), wait for each to complete, reconcile the outputs, and verify the final state.

Task: {{args}}

Follow the orchestration protocol:
1. State the work graph (nodes + dependencies) before delegating.
2. Assign each node to the appropriate specialist — no overlapping write ownership.
3. Reconcile all outputs before marking the task complete.
4. Surface any blockers or ambiguities immediately rather than guessing.`,
    },
  ],
});
