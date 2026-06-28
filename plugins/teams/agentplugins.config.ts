import { definePlugin } from '@agentplugins/core';

/**
 * agentplugins-teams/teams
 *
 * Implicit peer workflow: spawns roster agents as teammates that share a task
 * list and coordinate without a dedicated lead.
 *
 * On Claude Code: sets CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1 via env so the
 * harness enables the agent-teams feature. Roster agent definitions supply the
 * model + tools frontmatter that Claude uses per-teammate.
 *
 * Requires: agentplugins-teams-roster (for teammate agent definitions)
 *
 * Usage: /team <task-description>
 */
export default definePlugin({
  name: 'teams-workflow',
  version: '0.1.0',
  description: 'Implicit peer workflow — /team spawns roster agents as teammates with a shared task list',
  license: 'Apache-2.0',

  // Enable Claude Code's experimental agent-teams feature at session start
  hooks: {
    sessionStart: {
      handler: {
        type: 'command',
        command: 'echo "Agent teams mode active — CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS enabled"',
      },
    },
  },

  // Emit the env var that gates Claude's agent-teams feature
  env: {
    CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS: '1',
  },

  skills: [
    {
      name: 'team',
      description:
        'Spawn roster agents as peer teammates sharing a task list. ' +
        'Requires Claude Code with CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1.',
      content: `---
name: team
description: Peer coordination workflow — implicit teammate spawning with shared task list
---

# /team — Peer Coordination Workflow

Spawn a team of roster agents as **peer teammates** — they share a task list and
coordinate without a dedicated orchestrator lead.

## Prerequisites

\`\`\`bash
agentplugins add espetro/agentplugins-teams#plugins/roster
agentplugins add espetro/agentplugins-teams#plugins/teams
\`\`\`

On Claude Code, \`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1\` is set automatically
by this plugin's env config.

## How it works

1. **Spawn** — Teammates (explorer, oracle, fixer, librarian) are spawned as peer agents.
2. **Share** — All teammates read from and write to a shared task list.
3. **Coordinate** — Teammates claim tasks, complete them, and surface blockers to each other.
4. **Self-organize** — No explicit lead; peers decide who does what based on task type and availability.

## Orchestrator vs teams

| Mode | Lead | Coordination | Best for |
|---|---|---|---|
| \`/orchestrate\` | Explicit orchestrator | Top-down work graph | Complex multi-phase tasks |
| \`/team\` | None (peer) | Shared task list | Exploratory or parallel discovery |

Both draw from the same roster — install together to use either workflow.

## Claude Code note

Agent teams is an experimental Claude Code feature. Set \`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1\`
in your environment if this plugin's env injection does not take effect (e.g. in a non-hook context).
`,
    },
  ],

  commands: [
    {
      name: 'team',
      description: 'Spawn roster agents as peer teammates with a shared task list',
      argumentHint: '<task-description>',
      prompt: `You are coordinating a peer team of specialist agents for this task.

Spawn the appropriate roster teammates (explorer, oracle, fixer, librarian) based on the task's needs. Each teammate should:
- Claim a specific slice of the work from the shared task list
- Complete it without overlapping file writes with other teammates
- Surface blockers immediately so peers can re-assign

Task: {{args}}

Start by analyzing the task and deciding which teammates are needed and what each one's initial assignment should be.`,
    },
  ],
});
