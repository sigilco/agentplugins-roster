# agentplugins-teams

Orchestration plugins built on [agentplugins](https://github.com/sigilco/agentplugins).

**GitHub Project:** _to be set up — see Open items below_

## Plugins

| Plugin | Purpose | Install command |
|---|---|---|
| `roster` | Predefined agent lineup with optional per-agent model + fallback config | `agentplugins add espetro/agentplugins-teams#plugins/roster` |
| `orchestrator` | Explicit lead workflow — `/orchestrate` fans out to roster agents as subagents | `agentplugins add espetro/agentplugins-teams#plugins/orchestrator` |
| `teams` | Implicit peer workflow — `/team` spawns teammates that share a task list | `agentplugins add espetro/agentplugins-teams#plugins/teams` |

## Operating Principles

1. **Roster is the model config layer.** `model` and `fallbackModels` live in `plugins/roster/agentplugins.config.ts`. Override per-agent at runtime via `/model`.
2. **Composition happens at harness level.** Orchestrator and teams reference roster agents by name; the harness resolves them if both plugins are installed.
3. **Harness default when nothing resolves.** If `model` is unset or no fallback is reachable, the harness uses its currently-selected model.
4. **Tier-1 parity is the bar.** Orchestrator and teams compose via universal subagent primitives; teams additionally sets `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` on Claude.

## Commit & branch conventions

- Atomic conventional commits
- Feature work on `feat/<purpose>` branches; release tags cut from `main`
- All work linked to a refined issue in the GitHub Project (see above)

## Open items

- **GitHub repo:** Create `espetro/agentplugins-teams` on GitHub and add remote: `git remote add origin https://github.com/espetro/agentplugins-teams.git`
- **GitHub Project:** Set up a project for this repo and record the URL here.
- **npm publish:** `plugins/roster`, `plugins/orchestrator`, `plugins/teams` will publish as scoped packages when `@agentplugins/cli ≥ 0.5.0` is released.
