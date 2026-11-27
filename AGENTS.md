# Working on LoginGuard

LoginGuard is a security lab with a React frontend and a Spring Boot backend, built to test security features for future Spring Boot starter apps.

Work from the repository root in WSL Bash. For a new checkout, follow [Getting started](README.md#getting-started).

## Find the relevant guidance

- Read the [current handoff](docs/ROADMAP.md#current-handoff) when continuing a milestone or picking up unfinished work. Update it when the work changes milestone progress, a project decision, or the next step.
- Before changing sessions, protected routes, or permissions, read the [authorization contract](docs/ROADMAP.md#authorization-contract). Use it to choose checks for anonymous callers, owners, and other signed-in users as applicable.
- For rate limiting, Redis, or AWS perimeter work, follow the [API protection exercise](docs/API-PROTECTION.md). Start with the local checks. Confirm the target account and environment before making authorized AWS changes.

Choose a workflow from the [skills registry](docs/AGENT_SKILLS.md) when a task calls for one.

## Verify the change

Run the relevant checks from [Development](README.md#development). Before committing, confirm the relevant checks passed on the changes being committed.

| Change | Check |
| --- | --- |
| Schema | Add a new versioned [Flyway migration](backend/src/main/resources/db/migration/) when changing an already-applied schema. Run Maven `verify` with the [isolated migration check](README.md#isolated-migration-check). |
| Other backend changes | Run Maven `verify` through `direnv` and `mise` with local PostgreSQL running. |
| Frontend only | Run `lint` and `build` through `mise`. The build includes TypeScript checking. |
| Browser and API contract | Run frontend lint and build, run the applicable backend check, and exercise the affected browser flow when runnable. |
| Documentation only | Check the changed text, links, and any commands it introduces. |

In your final response, list the checks you ran and explain any relevant check that was blocked.

## Code Review Rules

- Flag protected actions that rely on frontend visibility or an unscoped resource lookup. Check that the server enforces the [authorization contract](docs/ROADMAP.md#authorization-contract), including resource ownership where applicable.

## Working tree and local data

Preserve the existing `.env`, PostgreSQL volume, and unrelated working-tree edits. Leave commits and publishing to an explicit request.
