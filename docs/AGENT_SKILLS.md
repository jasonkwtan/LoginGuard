# LoginGuard agent skills registry

LoginGuard uses a small set of reusable engineering workflows. Core skills cover the normal delivery loop, supporting skills provide references and dependencies, and optional skills answer specialist questions. Start with the [roadmap handoff](ROADMAP.md#current-handoff) and use the [repo instructions](../AGENTS.md) and [README](../README.md) for authorization, setup and verification.

## Engineering workflow

1. **Clarify the behavior.** For an uncertain design, use `grill-with-docs` to settle vocabulary, trade-offs and acceptance examples. For significant changes, capture the agreed scope, interfaces and observable outcomes with `spec-driven-development`.
2. **Plan and hand off.** Use `planning-and-task-breakdown` when work needs multiple slices. Give each slice an acceptance check. Use `context-engineering` to hand off the relevant decision, current evidence and next unfinished action.
3. **Implement and check a slice.** Pick one test-first workflow. Use `incremental-implementation` to connect each change to a passing check. Use `systematic-debugging` when the evidence points to a failure you cannot yet explain.
4. **Review and record evidence.** Use `code-review-and-quality` for a review and `security-and-hardening` when a trust boundary changes. Use `verification-before-completion` to support completion claims with fresh output. Record milestone evidence and the next step in the roadmap.

For a small change with a clear contract, the contract, a focused check and review can all live in the same PR. Use repository tests and commands in place of generic upstream examples. Keep design decisions, verification evidence and release approval explicit as the workflow matures.

## Core skills

| Skill and upstream | Purpose and when to invoke | Dependencies and overlap |
| --- | --- | --- |
| [`grill-with-docs`](https://github.com/mattpocock/skills) | Interview the developer when a design has unresolved choices. Capture agreed terms and durable decisions. | Calls `grilling` and `domain-modeling`. Feeds the spec with decisions. |
| [`spec-driven-development`](https://github.com/addyosmani/agent-skills) | Specify outcomes, scope and acceptance criteria for a significant change before coding. | Hands off to `planning-and-task-breakdown`. Calls `incremental-implementation`, `test-driven-development` and `context-engineering` for execution. |
| [`planning-and-task-breakdown`](https://github.com/addyosmani/agent-skills) | Turn agreed requirements into ordered, independently verifiable slices. Invoke when task order or boundaries need a written plan. | Uses the shared [definition of done](../.agents/references/definition-of-done.md). Starts from the spec or an already agreed contract. |
| [`context-engineering`](https://github.com/addyosmani/agent-skills) | Select the code, decisions and evidence needed to resume a task or restore focus. | Uses the repo handoff as context. Invoked by `spec-driven-development` during execution. |
| [`tdd`](https://github.com/mattpocock/skills) | Drive a focused behavior change through a failing test and the smallest passing change. | Uses the project test runner and consults `codebase-design` when the interface is unsettled. Use `code-review-and-quality` for the separate review and refactoring pass. Overlaps `test-driven-development`. |
| [`incremental-implementation`](https://github.com/addyosmani/agent-skills) | Change one verifiable slice at a time when implementing a plan or touching multiple modules. | Uses the definition of done, project checks and `test-driven-development` guidance for finding those checks. Consults `git-workflow-and-versioning` for authorized commits. |
| [`systematic-debugging`](https://github.com/obra/superpowers) | Reproduce a failure, test a hypothesis and identify the cause before proposing a fix. | Uses relevant logs and test commands. Use the retained `tdd` when the upstream text calls for a regression test. |
| [`code-review-and-quality`](https://github.com/addyosmani/agent-skills) | Review a diff for correctness, maintainability, tests, security and performance. | Uses the shared security and performance checklists. `security-and-hardening` goes deeper on trust boundaries. `blast-radius` can investigate a specific downstream effect. |
| [`security-and-hardening`](https://github.com/addyosmani/agent-skills) | Check defensive handling of inputs, identities, secrets and dependencies when a trust boundary changes. | Uses bundled patterns and the shared security checklist. Use `systematic-debugging` to investigate unexpected behavior. `supply-chain-risk-auditor` covers specialized dependency audits. |
| [`verification-before-completion`](https://github.com/obra/superpowers) | Collect current command output before claiming a change is complete or verified. | Uses the repo's check commands and the slice's acceptance criteria. Complements TDD and review with final evidence. |

## Supporting skills

| Skill and upstream | Purpose and when to invoke | Dependencies and overlap |
| --- | --- | --- |
| [`grilling`](https://github.com/mattpocock/skills) | Stress-test a design in decision order when the developer can answer questions. | Used by `grill-with-docs`. Investigate repo facts directly when delegation is unavailable or unauthorized. |
| [`domain-modeling`](https://github.com/mattpocock/skills) | Define terms and capture architecture decisions when the domain vocabulary changes. | Uses its bundled glossary and ADR templates. Used by `grill-with-docs`. |
| [`codebase-design`](https://github.com/mattpocock/skills) | Reason about interfaces, test seams and module depth when the next test exposes an unclear boundary. | Uses bundled design references. Consulted by `tdd`. Use parallel design exploration only when authorized. |
| [`git-workflow-and-versioning`](https://github.com/addyosmani/agent-skills) | Consult for atomic commits or versioning once a task calls for them. | Uses Git and the repo's authorization rules. Consulted by `incremental-implementation`. Its optional migration and shipping workflows belong to release work. |
| [`test-driven-development`](https://github.com/addyosmani/agent-skills) | Follow the fuller test-first procedure when executing an approved spec. | Uses project test commands and the shared testing patterns. Use together with `incremental-implementation` as required by the spec workflow. For focused work, pick `tdd` or this skill. |
| [`how`](https://github.com/backnotprop/pstack) | Trace runtime behavior and ownership through source when preparing an explanation. | Called by `teach`. Trace directly when a read-only subagent is unavailable or unauthorized. |
| [`why`](https://github.com/backnotprop/pstack) | Find the evidence for a design decision and label any inference. | Called by `teach`. Uses Git history, ADRs or authorized PR evidence. |
| [`unslop`](https://github.com/backnotprop/pstack) | Edit explanations for clear, direct prose while preserving the underlying evidence. | Called by `teach` and `blast-radius`. Uses its bundled writing rules. |

## Optional specialist skills

| Skill and upstream | Purpose and when to invoke | Dependencies and overlap |
| --- | --- | --- |
| [`teach`](https://github.com/backnotprop/pstack) | Explain a change or subsystem at the developer's pace, such as the session lifecycle. | Calls `how`, `why` and `unslop`. Gather the two evidence threads sequentially if parallel delegation is unavailable or unauthorized. |
| [`blast-radius`](https://github.com/backnotprop/pstack) | Trace a change beyond its immediate diff and prove a downstream assumption with a focused check. | Uses relevant project checks and `unslop`. Complements general code review and can use `how` and `why` for extra context. |
| [`playwright-cli`](https://github.com/microsoft/playwright-cli) | Check browser behavior such as sign-in, cookies and two independent sessions when an HTTP test alone leaves a gap. | Requires the Playwright CLI and a browser. Use a fresh local browser profile. Provides a browser path for the workflows that cite DevTools. |
| [`supply-chain-risk-auditor`](https://github.com/trailofbits/skills) | Review pinned dependencies, matched advisories and install-time risk when auditing a package or lockfile. | Uses Python via `uv` for its collector. Inspect scripts and data destinations before any run. The collector can make network requests and use GitHub CLI credentials. Use `security-and-hardening` for a general security review. |
| [`terraform-test`](https://github.com/hashicorp/agent-skills) | Design Terraform assertions and mocked plan tests when infrastructure work begins. | Requires Terraform to run tests. Use mocked providers for local exercises and follow task authorization for anything that can provision resources. |
| [`supabase-postgres-best-practices`](https://github.com/supabase/agent-skills) | Consult PostgreSQL guidance when designing migrations, indexes or queries. | Uses bundled rules. Verify database claims with the project's PostgreSQL integration checks or a relevant query plan. |

## Codex compatibility

Codex discovers project skills under `.agents/skills/`. Select a skill by its exact name. When upstream refers to a **Skill tool**, use the discovered skill or read its local `SKILL.md` directly. Resolve upstream paths such as `skills/test-driven-development/SKILL.md` under the project's `.agents/skills/`. The shared `../../references/` paths still resolve from the installed directories. Keep the upstream invocation metadata, including explicit-only settings where supplied. [Codex skill documentation](https://learn.chatgpt.com/docs/build-skills)

The dependency references above distinguish required workflow steps from adjacent topics. General review covers the `code-review` reference in `tdd`; the retained performance checklist covers routine performance review. Release extensions and specialized incident or DevTools workflows can be considered when those tasks arise. Upstream instructions pass through the repository's authorization rules for delegation, prescribing new tools, commits, external data and publishing.

## Install and maintain

Vercel's Skills CLI discovers and copies reusable skills into the project. `npx` runs the specified npm CLI version. LoginGuard uses a reviewed version and full upstream Git commits so an update can be reviewed as a normal diff. A checkout already contains the installed copies. [Skills CLI commands](https://github.com/vercel-labs/skills/blob/main/docs/commands.md)

For example, inspect the project inventory or reinstall the pinned PostgreSQL skill from the WSL repo root.

```bash
export npm_config_ignore_scripts=true DISABLE_TELEMETRY=1
mise exec -- npx --yes skills@1.9.0 list -a codex
mise exec -- npx --yes skills@1.9.0 add supabase/agent-skills@c9be0e931b7930f7d02126d04774d904c381e7d7 \
  --skill supabase-postgres-best-practices -a codex --copy -y
```

Review upstream instructions, metadata, references, licenses and scripts before updating any pin. Use `skills remove NAME -a codex -y` with the same pinned CLI when dropping a skill. Review the installed files and [lockfile](../skills-lock.json) together. The lock records the upstream Git commit, skill path and content hash. Keep shared references and [upstream notices](../.agents/vendor-licenses/) for every retained source that uses them. Check discovery in a clean checkout before merging changes to the registry.
