# Working on LoginGuard

Start with the [current handoff](docs/ROADMAP.md#current-handoff) in the project roadmap. It records verified progress, the next task and the evidence needed to close each milestone. Keep that handoff current when implementation or decisions change.

Work from the repository root in WSL. Use the [README](README.md) for setup and verification with the locked toolchain and local environment. Preserve the existing `.env`, database volume and unrelated working-tree edits. Leave commits and publishing to an explicit request.

## Selecting agent skills

Use the [agent skills guide](docs/AGENT_SKILLS.md) to choose a workflow that fits the task. For a focused behavior change, start with the public contract, use one test-first skill if helpful, and run the relevant project checks. For a cross-module, architecture or authentication change, settle the boundaries and acceptance evidence with the human before implementation. Add a specialist for a specific question. Follow the task's authorization and the repository's own setup and verification commands when upstream instructions suggest external actions or additional tools.
