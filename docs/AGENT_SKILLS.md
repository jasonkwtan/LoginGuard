# LoginGuard agent skills

Use this guide from the LoginGuard WSL checkout. The skills are available for tasks in this repository. Treat session authentication, JWT, Redis, dashboard, and AWS examples as exercises at the corresponding roadmap milestone. The Kafka example belongs in a separate learning sandbox, as specified in the [roadmap](ROADMAP.md).

## How the tooling fits together

| Component | Role |
| --- | --- |
| Skill | A folder with `SKILL.md` and optional references, templates, scripts, and agent metadata. Codex starts with names and descriptions, loads the selected instructions on demand, and opens supporting files as needed. This is progressive disclosure. |
| `AGENTS.md` | Standing repository guidance such as setup commands, test expectations, and conventions. More specific files can guide work in a subtree. |
| MCP | A protocol that gives an agent callable tools and resources from a server, such as read-only documentation search. The server and its authorized account determine what it can access. |
| Plugin | A bundle that can deliver skills, MCP servers, hooks, and other integrations together. Inspect the manifest and any setup instructions before enabling a bundle. |
| Subagent | A delegated agent with its own context. Give it a bounded question, the evidence to inspect, and a read/write boundary. The parent verifies and integrates the result. |
| Hook | A registered action on a lifecycle event such as session start or before a tool call. Hook configuration and trust are separate from installing a Markdown skill. |

Codex looks for `.agents/skills/` from its working directory up to the repository root and also has a user scope at `~/.agents/skills/`. Start Codex in the WSL checkout you intend to use. Type `$` to find a skill in the picker and select its exact name, or explicitly ask for it by name. Codex can also select skills from their descriptions. A skill with `policy.allow_implicit_invocation: false` in `agents/openai.yaml` remains available for explicit use. If a new skill does not appear, start a fresh session from the repository root. [Build skills](https://learn.chatgpt.com/docs/build-skills) · [AGENTS.md guidance](https://learn.chatgpt.com/docs/agent-configuration/agents-md) · [Skills and plugins](https://learn.chatgpt.com/docs/skills-and-plugins) · [MCP specification](https://modelcontextprotocol.io/specification/) · [Subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents) · [Hooks](https://learn.chatgpt.com/docs/hooks)

Node.js runs the JavaScript CLI. npm resolves and fetches packages from the registry. `npx`, implemented through `npm exec`, runs a local package executable or fetches it into an npm cache for execution. In `npx skills@latest`, `skills` is Vercel's package and `latest` is the moving registry tag. The setup was discovered with that tag and installed using the resolved `skills@1.9.0` on WSL Node 26.13.1. That CLI release requires Node 22.20.0 or newer. The commands below require no application package changes. [Node.js](https://nodejs.org/en/learn/getting-started/introduction-to-nodejs) · [npm exec](https://docs.npmjs.com/cli/v11/commands/npm-exec) · [Skills CLI commands](https://github.com/vercel-labs/skills/blob/main/docs/commands.md)

## Install, inspect, update and remove

The project copies, [provenance and content lock](../skills-lock.json), and [upstream notices](../.agents/vendor-licenses/) are tracked in Git. A checkout is sufficient for Codex discovery. Project scope shares the selection and pins with reviewers. Global scope, requested with `-g` in Skills CLI, is appropriate for personal tools intended across repositories. Run Skill CLI commands from the project root for LoginGuard.

```bash
# Run in WSL from the LoginGuard repository root.
export npm_config_ignore_scripts=true DISABLE_TELEMETRY=1
npx --yes skills@1.9.0 find postgres
npx --yes skills@1.9.0 add supabase/agent-skills --list --full-depth
npx --yes skills@1.9.0 list -a codex
npx --yes skills@1.9.0 check
```

Review a proposed source in a temporary checkout before adding it. Inspect `SKILL.md`, supporting files, executable code, network destinations, and any requested credentials. Check the existing list for name collisions. Install an explicit selection at the full reviewed revision. Example using an existing pin:

```bash
npx --yes skills@1.9.0 add supabase/agent-skills@c9be0e931b7930f7d02126d04774d904c381e7d7 \
  --skill supabase-postgres-best-practices -a codex --copy -y
```

For an update, review the upstream diff and repeat the pinned add with the new commit on a branch. Review the lock, skill contents, shared references and notices together. `skills update` is available for routine refreshes of other installations. This repository's review process uses an explicit new pin. To repair a missing skill directory, prefer restoring the checked-in paths from the intended Git revision. The CLI also supports `npx --yes skills@1.9.0 install -a codex --frozen-lockfile` for lock-managed skill folders. Git also carries the notices and shared references. To remove a tracked skill, run `npx --yes skills@1.9.0 remove NAME -a codex -y`, then update this guide and remove any supporting files that have no remaining consumers. [Skills CLI install, update and removal](https://github.com/vercel-labs/skills/blob/main/docs/commands.md)

Skill prose is third-party input. Keep the task's authorization, data boundaries and repository conventions in force. Some upstream examples install global packages, run benchmarks, call external services, publish issues, attach authenticated browsers, or provision infrastructure. Use scratch data and isolated local sessions for exercises. Confirm the destination and authority for external actions and keep credentials, raw tokens, session IDs and Terraform state out of prompts and shared artifacts. Use the project lock and Git diff to review changes to executable files and instructions. `allowed-tools` in upstream metadata cannot grant Codex permissions.

## Installed inventory

Each row includes a sample Codex invocation. Context estimates are **small** for a short prompt or checklist, **medium** for a multi-step procedure, and **large** for a long procedure or one that pulls several references, diffs, or agents. The open files, commands, and delegated work determine the actual token cost. Use one relevant rule or checklist at a time. Installed supporting files live beside the skill or under `.agents/references/`, where Addy's relative paths resolve.

### Matt Pocock — requirements, domain model and test design

[Upstream collection](https://github.com/mattpocock/skills)

| Skill | Use and limits | Example |
| --- | --- | --- |
| `grill-with-docs` | Facilitates a design interview and captures agreed terms and durable decisions. Requires `grilling` and `domain-modeling`. Skip for a settled design or a quick question. Small entry point, medium combined context. Treat glossary and ADR edits as task changes. | “`$grill-with-docs` Work through session revocation and record the decisions I approve.” |
| `grilling` | Runs the interview in rounds and surfaces dependencies between decisions. Use when the human is available. Skip when acceptance criteria already resolve the decision. Small per round, potentially several turns. Addy's `interview-me` is an upstream alternative. | “`$grilling` Ask me which sessions should survive local logout.” |
| `domain-modeling` | Refines the vocabulary and records decisions using bundled formats. Use when concepts or boundaries are changing, such as session, credential and principal. Skip for code reading or a focused bug. Small to medium with glossary and ADRs. | “`$domain-modeling` Align the account, owner and session vocabulary with our browser-auth decisions.” |
| `tdd` | Guides one red-to-green behavior test at a time through public interfaces. It treats cleanup as review work. Requires the relevant project test runner. Skip for docs-only changes. Medium with test output. Use Addy's `test-driven-development` for the gated workflow. | “`$tdd` Drive owner-only session listing through Spring's public HTTP boundary.” |
| `improve-codebase-architecture` | Inspects module seams and testability, proposes improvements in an HTML report, and discusses one candidate. Requires source, the bundled report template and applicable design vocabulary. Skip for a narrow local cleanup. Large scan and report. pstack's `architect` is an upstream alternative for upfront design. | “`$improve-codebase-architecture` Inspect the Spring security boundaries and discuss one simpler test seam.” |

### Superpowers — debugging and verification

[Upstream collection by Jesse Vincent](https://github.com/obra/superpowers)

| Skill | Use and limits | Example |
| --- | --- | --- |
| `systematic-debugging` | Traces evidence across components, forms one hypothesis and checks it before fixing. Requires logs and appropriate local tests. Skip for a known mechanical fix. Medium to large during incidents. The bundled shell example runs npm tests and is for relevant disposable JavaScript fixtures. Addy's `debugging-and-error-recovery` is an upstream alternative. | “`$systematic-debugging` Trace why the Vite health request stopped reaching Spring using local responses and redacted logs.” |
| `verification-before-completion` | Requires fresh evidence before reporting a check as passed. Needs the applicable commands and their full exit status. Skip when the task makes no implementation or verification claim. Small instructions, variable test output. Addy's incremental verification overlaps. | “`$verification-before-completion` Run the documented frontend checks and report exactly what they establish.” |

### pstack — impact, measurement and teaching

[Upstream collection by Lauren Tan](https://github.com/backnotprop/pstack)

| Skill | Use and limits | Example |
| --- | --- | --- |
| `blast-radius` | Follows downstream callers, wire formats and stored data from an intended change. Verify the critical assumptions with focused project checks. Skip for isolated copy edits. Medium to large across modules. ECC's `change-impact` is an upstream alternative with broader release and rollback artifacts. | “`$blast-radius` Trace the old consumers of the login rate-limit response before we change Retry-After.” |
| `benchmark-checklist` | Challenges the measurement setup, limiter, variance and conclusion. Requires a measured or planned run. Skip for a qualitative investigation. Medium plus raw results. Use Addy's `performance-optimization` when the bottleneck still needs diagnosing. | “`$benchmark-checklist` Compare one-process and Redis-backed limiters against the same synthetic local workload and report error rates and p95.” |
| `teach` | Synthesizes runtime flow and decision history using `how` and `why`. Use for a code walkthrough or a completed feature, with no implementation request. Large when evidence spans commits and several files. Matt's `teach` is a different upstream curriculum and practice workflow. | “`$teach` Walk me through PR #2 and explain how the frontend connects to the backend today.” |
| `how` | Traces ownership and runtime flow in the code. The upstream workflow calls for a read-only subagent when available. Keep scope bounded and use only authorized delegation. Skip when the question is why a decision was made. Small entry point, variable delegated context. | “`$how` Trace what handles a browser session request from the controller to PostgreSQL.” |
| `why` | Looks up rationale in commits, PR threads, ADRs or other records and labels inference. Requires Git history and authorized PR access when available. Skip for pure runtime tracing. Small instructions, variable history. | “`$why` Explain the documented reason for storing sessions in PostgreSQL instead of Redis and flag any gap in the record.” |

### Addy Osmani — specification, implementation and review

[Upstream collection](https://github.com/addyosmani/agent-skills)

| Skill | Use and limits | Example |
| --- | --- | --- |
| `spec-driven-development` | Defines objectives, boundaries and evidence before implementation, with explicit human gates. For multi-capability work, map provider and consumer contracts using `api-and-interface-design`. Later phases use `planning-and-task-breakdown`, `incremental-implementation`, `test-driven-development` and `context-engineering`. Large. Skip for small changes with agreed acceptance criteria. Matt's `to-spec` publishes to an issue tracker and is omitted. | “`$spec-driven-development` Draft the JWT resource-server spec. Stop for review after issuer, audience, scope and cookie behavior are defined.” |
| `planning-and-task-breakdown` | Orders verifiable slices after spec approval. Uses the shared Definition of Done and needs known dependencies. Medium. Skip for one obvious change. Superpowers' `writing-plans` is an upstream alternative. | “`$planning-and-task-breakdown` Slice the approved JWT spec into issuer setup, endpoint contract and consumer checks.” |
| `incremental-implementation` | Builds and verifies small working slices against an agreed plan. Requires project checks and shared Definition of Done. Medium with command output. Skip for exploratory design. Matt's `implement` is an upstream alternative. | “`$incremental-implementation` Build the approved session listing slice and check it independently.” |
| `test-driven-development` | Uses red, green and refactor with checks for each transition. Requires a test runner. The shared examples are JS/TS, so use the project equivalents in Maven and Spring. Large. Skip for docs-only work. Matt's `tdd` is the lighter alternative. | “`$test-driven-development` Drive revoked-session denial through an integration test before changing the service.” |
| `api-and-interface-design` | Defines contracts, compatibility, errors and versioning. Use when a provider and consumer need a shared boundary. Large. Skip for private implementation details. Matt's domain skill can clarify vocabulary first when terms are unsettled. | “`$api-and-interface-design` Specify the session-list response and ownership error semantics for React and Spring.” |
| `context-engineering` | Selects rules, spec excerpts, entry points and logs, and creates restartable handoffs. Large procedure with a small intended downstream context. Skip for self-contained questions. pstack's context-window principle is an upstream alternative. | “`$context-engineering` Prepare a short handoff for Redis rate-limit outage behavior using the roadmap, relevant source and redacted test results.” |
| `code-review-and-quality` | Reviews correctness, readability, architecture, security and performance using diff and test evidence. Shared security and performance checklists are available. Large. Skip when only a narrow verification question is asked. `ponytail-review` offers a shorter pass. | “`$code-review-and-quality` Review the React and Spring session revocation change, with findings ordered by severity.” |
| `security-and-hardening` | Models threats and checks defensive controls in auth, inputs, storage and dependencies. Uses its local patterns and shared security checklist. Large. Use for code and configuration review with controlled fixtures. For dependency-only review, choose Trail of Bits below. | “`$security-and-hardening` Review the session and JWT chains for ownership, CSRF, issuer, audience and secure defaults. Cite code and tests.” |
| `performance-optimization` | Profiles first, changes a measured bottleneck, and compares the same workload. Use an appropriate profiler, load generator or query plan, plus the bundled patterns and shared checklist. Large. Skip when criteria and baseline are missing. Pair with `benchmark-checklist` for repeatability. | “`$performance-optimization` Profile the local session-list query and compare the same workload after one justified index change.” |
| `observability-and-instrumentation` | Defines questions and chooses logs, metrics, traces and alerts. Requires the project's telemetry or sanitized samples, plus the shared checklist. Large. Skip when evidence already answers a narrow question. `systematic-debugging` overlaps during incidents. | “`$observability-and-instrumentation` Propose low-cardinality signals for Redis errors, 429s and 503s without recording account or session identifiers.” |

### Simplicity and review

| Skill and upstream | Use and limits | Example |
| --- | --- | --- |
| `ponytail-review` · [Dietrich Gebert](https://github.com/DietrichGebert/ponytail) | A shorter review of correctness, safety, load, tests and unnecessary code. Needs connected source and diff only. Medium. Use Addy's review for a more formal multi-axis pass and security checklist. This standalone skill has no dependency on Ponytail's lifecycle hooks. | “`$ponytail-review` Check this JWT configuration PR for correctness and unnecessary wrappers.” |
| `karpathy-guidelines` · [Multica, based on Andrej Karpathy's observations](https://github.com/multica-ai/andrej-karpathy-skills) | Surfaces assumptions, keeps edits surgical and asks for verifiable results. No tooling dependencies. Small. Skip for trivial edits or where detailed design and test gates are needed. Ponytail's broader simplicity guidance overlaps. | “`$karpathy-guidelines` Simplify the dashboard loading state while preserving its existing data flow and tests.” |

### Vercel — discovery and React

[Skills CLI and Find Skills](https://github.com/vercel-labs/skills) · [Vercel Engineering agent skills](https://github.com/vercel-labs/agent-skills)

| Skill | Use and limits | Example |
| --- | --- | --- |
| `find-skills` | Searches for missing capabilities using Node and Skills CLI. Medium with result lists. Skip when a suitable project skill is installed. Registry ranking is a discovery aid. Check the owner and content before any proposed install. | “`$find-skills` Find candidates for Spring Boot API documentation. Return first-party sources and installation scope for review.” |
| `vercel-react-best-practices` | Reviews rendering, data fetching and bundles. Read applicable rule files. Medium when scoped, large if the compiled guide is loaded. LoginGuard uses Vite, so skip Next.js-only rules. Addy's performance skill is broader. | “`$vercel-react-best-practices` Review the session dashboard for avoidable refetches and rendering work using Vite-compatible rules.” |
| `vercel-composition-patterns` | Improves component interfaces and state ownership using bundled React rules. Small to medium. Skip when current props are straightforward. `frontend-design` concerns visual direction rather than component APIs. | “`$vercel-composition-patterns` Review a dashboard panel that is accumulating boolean props before introducing shared state.” |
| `web-design-guidelines` | Reviews UI source against a bundled, pinned interface checklist. Small entry point, medium checklist. Skip for non-UI changes. Pair with keyboard and browser checks for observed behavior. `frontend-design` covers visual design. | “`$web-design-guidelines` Review sign-in labels, loading feedback and keyboard focus.” |

### Design, PostgreSQL, Terraform, security tooling and browser testing

| Skill and upstream | Use and limits | Example |
| --- | --- | --- |
| `frontend-design` · [Anthropic](https://github.com/anthropics/skills/tree/main/skills/frontend-design) | Establishes visual direction for a new UI or redesign. No external tooling required. Medium and opinionated. Skip for a minor styling fix or when the design has been approved. Vercel's UI guidelines offer a review pass. | “`$frontend-design` Design the session dashboard's empty, expired and error states within the existing LoginGuard style.” |
| `supabase-postgres-best-practices` · [Supabase](https://github.com/supabase/agent-skills) | Guides PostgreSQL schema, migrations, security and query tuning. Pull relevant bundled rules and use the local PostgreSQL client or integration tests for evidence. Medium to large. Skip for unrelated app work and use the project's Flyway conventions. Addy's performance skill overlaps for queries. | “`$supabase-postgres-best-practices` Review the Flyway migration and the local plan for owner-scoped session listing.” |
| `terraform-style-guide` · [HashiCorp](https://github.com/hashicorp/agent-skills/tree/main/plugins/terraform) | Provides HCL layout, naming, configuration and security guidance. Uses bundled `SECURITY.md` and the project's Terraform version when running checks. Medium. Skip for live deployment decisions or Packer work. Addy's hardening skill overlaps on secure defaults. | “`$terraform-style-guide` Review the proposed AWS ALB and ECS module boundaries and secret references.” |
| `terraform-test` · [HashiCorp](https://github.com/hashicorp/agent-skills/tree/main/plugins/terraform) | Writes `.tftest.hcl` cases using assertions and mocked providers. Requires a compatible Terraform CLI when executing. Medium to large. Skip for formatting-only edits. Real apply-mode tests can allocate billable resources. Addy's TDD informs sequencing, while these tests exercise HCL contracts. | “`$terraform-test` Plan mock-provider assertions for private ECS tasks and the WAF association, with no live provisioning.” |
| `supply-chain-risk-auditor` · [Trail of Bits](https://github.com/trailofbits/skills/tree/main/plugins/supply-chain-risk-auditor) | Reviews resolved dependencies for advisories, upstream maintenance and install-script signals. The measured workflow uses uv and Python 3.11+. Its standard-library collector sends package identities and versions to external services and may use a local GitHub CLI credential for GitHub API queries. Use an authorized public fixture in a credential-free environment for practice. Evidence depends on supported lock formats and available services. Large. Skip for runtime auth review. | “`$supply-chain-risk-auditor` Review a public fixture of the frontend lockfile for install-script and advisory signals. Start with read-only inspection and list network requests before any script.” |
| `playwright-cli` · [Microsoft](https://github.com/microsoft/playwright-cli) | Drives browser smoke checks and can assist test authoring. Actual browser use needs the `@playwright/cli` tool and compatible browser. Medium with scoped snapshots, larger with traces. Use a fresh local profile and keep storage state and traces private. Skip when a faster component test proves the behavior. Vercel Agent Browser is an upstream alternative. | “`$playwright-cli` In a fresh local browser, verify that expiry clears the dashboard and presents the sign-in state.” |

### Tooling for later exercises

Playwright CLI can run on demand without changing the app manifest. The WSL setup checked the CLI version with the command below. Browser execution also needs an isolated browser profile and a compatible browser. Terraform exercises use the version declared for the eventual LoginGuard infrastructure, and the Trail of Bits audit uses its bundled Python sources and uv workflow. Install exercise-specific tools in the environment running the exercise and use mock providers or synthetic data where appropriate. [Playwright CLI setup](https://playwright.dev/docs/getting-started-cli) · [Terraform test](https://developer.hashicorp.com/terraform/cli/commands/test) · [uv](https://docs.astral.sh/uv/)

```bash
npm_config_ignore_scripts=true npm exec --yes --package=@playwright/cli@0.1.25 -- playwright-cli --version
```

## Engineering workflows

Pick a lead workflow by task risk and add a specialist only when it answers a separate question. These are examples to adapt at the relevant roadmap milestone.

| Task | Order and evidence |
| --- | --- |
| Requirements and architecture | For unclear session semantics, use `$grill-with-docs` to interview and agree on vocabulary and ownership. For a cross-boundary JWT or SSO change, start `$spec-driven-development` after the requirements are understood. Record accepted decisions in an ADR and use `$api-and-interface-design` where React or an adopting app depends on a Spring contract. |
| Backend feature | Confirm the public contract, then use `$tdd` to add one behavior at a time through public Spring interfaces. For the Redis limiter, start with the rate-limit response and separately verify atomicity and behavior across replicas. Finish with `$verification-before-completion` and the repository's Maven checks. |
| React feature | Use `$frontend-design` if visual direction is still open. Use `$vercel-composition-patterns` only if state or component APIs need redesign. Check rendering and data fetching with `$vercel-react-best-practices`, accessibility with `$web-design-guidelines`, and observed loading, error and expiry behavior with `$playwright-cli`. |
| Database design and optimization | Use `$supabase-postgres-best-practices` to review owner predicates, indexes and Flyway migrations. Compare plans using seeded local data. Bring in `$benchmark-checklist` for comparable latency and error measurements, and `$blast-radius` if existing data, deploy order or consumers change. |
| Authentication and security review | Use `$security-and-hardening` for a defensive review of session rotation, ownership, cookies, CSRF and JWT validation. Map each control to the code and a positive or negative fixture. Use `$blast-radius` if a cookie, claim or permission changes across consumers. Have a human review impact and recovery before a security-sensitive PR proceeds. |
| Test-driven development | Use `$tdd` for a focused owner-only session test. Use Addy's `$test-driven-development` instead when working through its approved plan. Observe a failing assertion for the intended behavior, make the smallest passing change and finish with fresh test output. |
| Production incident investigation | Start with the incident scope and authorized, redacted telemetry. Use `$systematic-debugging` to follow request evidence from ALB to Spring to Redis or PostgreSQL. Use `$observability-and-instrumentation` if existing signals cannot distinguish errors from throttles. Record timeline, evidence, unknowns and a verified mitigation. |
| Performance benchmarking | Use `$performance-optimization` to establish and profile a baseline. Then use `$benchmark-checklist` to control concurrency, warm-up, dataset, workload, errors and variance. For an independent Kafka exercise, compare consumer lag and processing latency against pinned synthetic workloads in the separate sandbox. |
| Refactoring and impact | Use `$blast-radius` before moving a Spring security boundary. Use `$improve-codebase-architecture` when several modules are involved and the seams need design. Protect the public behavior with focused tests and verify the diff against the original affected callers. |
| Infrastructure provisioning | Use `$terraform-style-guide` to review the AWS modules, explicit state ownership and sensitive outputs. Use `$terraform-test` for mocked/provider-free checks as appropriate. Bring sanitized plan evidence, expected cost, rollback and teardown to the human before any live apply. |
| Pull request review | Choose `$ponytail-review` for a focused review or `$code-review-and-quality` for a larger change. Read the spec and tests before the implementation. Add `$security-and-hardening` when the diff changes identity or authorization boundaries. Report evidence by file and behavior. |
| Learn from a codebase or PR | Use `$teach` for an end-to-end explanation or `$how` or `$why` for a single question. For PR #2, trace the frontend flow using the actual diff and cite why only if the history supports it. Then explain it back in your own words and predict what would break if the Vite route changed. |

**Everyday default.** State the outcome and acceptance check. Read the relevant entry point and tests. Use Matt's `$tdd` when behavior changes, then run the smallest check that proves it. Review a meaningful diff with `$ponytail-review`. For a small documentation or configuration change, the acceptance check can be enough.

**Complex or security-sensitive default.** Use Addy's spec-led approach. Agree on a spec and trust boundaries before work, plan independently verifiable slices, and implement with its incremental and test-driven skills. Use a domain or security specialist for a concrete question. Review the authorization matrix, compatibility and recovery steps with a human, then run the relevant checks before requesting review. Use pstack, Superpowers or other end-to-end methods in separate experiments where their different approach is the subject of the exercise.

## Methodology comparison

These judgments reflect the reviewed upstream workflow descriptions and this repository's constraints. The [roadmap experiments](ROADMAP.md#ai-assisted-software-engineering) give them a way to be tested.

| Collection | Philosophy and strengths | Tradeoffs and LoginGuard fit |
| --- | --- | --- |
| [Matt Pocock](https://github.com/mattpocock/skills) | Use precise domain language, interview the human, deepen module interfaces and drive changes through behavior tests. | Human review takes time. Publishing and triage skills assume a configured issue workflow. Strong fit for naming and state semantics in sessions, JWT and SSO, plus everyday backend TDD. |
| [Superpowers](https://github.com/obra/superpowers) | Enforces a design and plan before execution, disciplined debugging, test-first implementation and evidence before completion. Its plugin activates workflow guidance at session start. | Full sequencing and worktree/subagent steps add overhead for small fixes. Useful as an alternative lifecycle experiment or for the two standalone evidence skills installed here. |
| [pstack](https://github.com/backnotprop/pstack) | Offers focused prompts for architecture, real evidence, performance and explanations. Many are intentionally explicit-invocation skills. | Supporting tools, Git history and delegated context can make apparently small prompts expensive. Strong for caller impact, Redis measurements and walkthroughs of settled work. |
| [Addy Osmani](https://github.com/addyosmani/agent-skills) | Gates work from spec to plan, small implementation slices and multi-axis review. It treats context as a resource and supplies checklists. | Longer prompts, output conventions and JS-oriented examples add setup effort. Good for a cross-module auth change where requirements, compatibility and test evidence matter. |
| [gstack](https://github.com/garrytan/gstack) | Role-based product, design, engineering, QA and release stages, with browser automation and a generated runtime. | Broad tooling brings setup, hooks and browser/account boundaries. Upstream labels Codex CLI experimental. Consider an isolated comparison for product framing or dashboard QA after reviewing the harness. |
| [ECC](https://github.com/affaan-m/ECC) | Broad harness with skills, specialized agents, rules, hooks and platform adapters. Its Codex skill catalogue includes evidence-based change impact and evaluation. | Installation scope and capabilities differ by host. A full package adds a substantial review and startup-context burden. Its impact workflow refers to companion artifacts, while pstack's narrower analysis fits current LoginGuard needs. |

## Exclusions and name collisions

| Candidate | Resolution |
| --- | --- |
| `tdd` in Matt Pocock and pstack | Matt's `tdd` is installed for everyday behavior-driven red/green work. Keep pstack's version in a separate experimental worktree if comparing the two. |
| `teach` in Matt Pocock and pstack | pstack's code/PR walkthrough is installed with `how` and `why`. Matt's version creates a stateful teaching workspace and remains an alternative for longer studies. |
| `test-driven-development` in Superpowers and Addy Osmani | Addy's copy supports the installed spec workflow. Superpowers' stricter implementation workflow can be tested in isolation. |
| Multiple ways to review, debug or analyze impact | Select one lead skill. `ponytail-review` and `code-review-and-quality` have distinct names and different depth. `systematic-debugging` covers root-cause work. `blast-radius` covers downstream impact. |
| Matt Pocock `to-spec` and setup flows | `to-spec` expects issue tracker setup and publication. Addy's local spec workflow fills the requirement. |
| gstack and ECC full distributions | Reviewed both catalogues. Their closest useful roles overlap selected skills and native setup can modify user or harness configuration. Use a separate evaluation checkout for a future comparison. |
| Ponytail full plugin | The standalone review suffices for targeted experiments. Its always-on and mode-switching lifecycle integration is outside this setup. |
| [Vercel Agent Browser](https://github.com/vercel-labs/agent-browser) | The upstream skill is a stub that loads instructions from the associated CLI at runtime. Its broader browsing scope and installation overlap the selected Playwright workflow. |
| Additional [Trail of Bits](https://github.com/trailofbits/skills) skills | Selected the defensive supply-chain assessment. The full catalogue includes tools with additional runtime and data requirements and skills outside this project's defensive review scope. |
| Additional [HashiCorp](https://github.com/hashicorp/agent-skills) and [Microsoft](https://github.com/microsoft/playwright-cli) skills | Terraform style and testing cover current learning exercises. Provider development, Packer and the Playwright CLI repository's internal development skill are outside this project setup. |
| Full [Superpowers](https://github.com/obra/superpowers), [Vercel](https://github.com/vercel-labs/agent-skills), [Anthropic](https://github.com/anthropics/skills) and [Supabase](https://github.com/supabase/agent-skills) catalogues | Standalone selections match the roadmap. Plugin bootstraps, deployment skills, unrelated authoring skills and hosted Supabase integration are outside the current scope. |

Start with `$teach` on the existing frontend, `$grill-with-docs` on the upcoming session contract, or `$tdd` on its first behavior. Use `$find-skills` when you can describe a specific gap in the project set.
