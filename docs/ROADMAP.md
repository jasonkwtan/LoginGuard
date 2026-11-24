# LoginGuard roadmap

LoginGuard models an internal platform team helping application teams add authentication, enforce access rules and protect APIs. The measure of success is repeat delivery: can a second developer add a supported integration to an existing Spring Boot app, verify it in their own CI, and keep it working through an upgrade?

Use this roadmap as the source of truth for scope, sequencing, decisions and the next handoff. The [README](../README.md) owns local setup and check commands. ADR 0001 and the API protection exercise record the accepted architecture and detailed local-to-AWS experiments. They are currently separate local planning drafts.

## Current handoff

**Week 1 is in progress in the local development checkout.** The 23 November 2026 verification below describes that working tree, including pending changes. The React/Vite landing page calls anonymous `GET /api/health` through the dev proxy. The Spring security chain denies other requests by default. The [access tests](../backend/src/test/java/com/loginguard/loginguard/LoginguardApplicationTests.java) cover anonymous GET, denied POST and restricted Actuator access. The [migration test](../backend/src/test/java/com/loginguard/loginguard/DatabaseMigrationTests.java) checks Flyway and the PostgreSQL users table.

**Verification.** Local Maven verification passed all four tests against Compose PostgreSQL. Frontend lint and the production build passed. The workflow directory contains only a placeholder. Browser login, JWT, SSO and cloud protections are scheduled below.

**Next task.** Add the first GitHub Actions workflow for Maven verification with isolated PostgreSQL credentials and frontend lint/build from a clean checkout. Close the CI task when the workflow runs those checks successfully. Then define the protected account read, its owner and anonymous responses, and record manual integration effort for comparison with a second app. Runbook Search is a prospective adopter on its own schedule.

**Maintaining the handoff.** At the start of a task, compare this section with the working tree and recent checks. When work changes the milestone status, record the observed result, the check or decision that supports it, and the next unfinished step here. Keep setup commands in the README and link detailed decisions or experiments from the relevant milestone.

## Scope

**Core release.** Deliver three golden paths, a reusable authorization test suite, and an API protection exercise that progresses from one process to two replicas to AWS. The independent consumer app runs with the catalog offline. Each path offers **Try the flow**, **Add to my app** and **Verify in my app**. Share the versioned integration inputs between the demo and consumer to prevent drift.

| Golden path | What a team adopts | What its own CI proves |
| --- | --- | --- |
| Add session-based login | A cookie-based Spring Security flow, PostgreSQL-backed Spring Session, CSRF handling and account-scoped session management | Login rotates the session identifier. After selective revocation, only the revoked browser loses access on its next protected request. |
| Protect an API with JWTs | A bearer-only resource server with a trusted issuer, expected audience and required scopes | Valid access tokens work. Invalid credentials receive 401. Authenticated callers lacking permission receive 403. A browser cookie alone cannot authorize the API. |
| Add company SSO | An OIDC authorization-code client with provider configuration, local sessions and documented logout behavior | Two registered clients can use one provider login. Logging out of App A has the documented effect on App A, App B and the provider session. |

**Platform and app responsibilities.** The platform maintains recipe defaults, tested versions, sample migrations, verification tests, upgrade notes, security fixes and a support contact in the repository. Each app team owns its identities, secrets, provider registrations, business permissions, deployment and choice of limits. Document supported overrides and their tests. Begin with versioned recipes. Introduce a starter or generator when repeated manual work across apps justifies it.

**Learning scope.** Use Keycloak locally for JWT and SSO. PostgreSQL is the default session store. Redis first solves shared rate limiting. AWS WAF and Shield Standard are core learning topics. A Cognito user pool as a second provider, Redis-backed sessions, machine identities with client credentials, MFA/passkeys, recovery, and Kubernetes are follow-ups. Keep Kafka and RAG/LLMs in a separate project. A commercial hosted console is outside this release.

## Twelve-week delivery schedule

Budget 6–8 focused hours each week. Use three sittings of roughly two hours: build the smallest working slice, integrate it into a consumer, then verify and record the result. Use the remaining time for feedback and debugging. Weeks 4 and 5 deliberately precede the AWS work. If a gate slips, carry it forward and drop optional experiments first. A plan entry is a target, not a claim that the feature has shipped.

| Week | Build | Integrate or exercise | Evidence to close the week |
| --- | --- | --- | --- |
| 1 · Baseline and CI | Run the existing WSL checks. Add GitHub Actions for Maven verification with isolated PostgreSQL and frontend lint/build. | Sketch the browser, app, store and provider trust boundaries. Define one protected account page and one read-only API resource. | A clean checkout builds. CI runs the existing health and migration tests. Record current manual setup steps. |
| 2 · Browser sessions | Add seeded local test identities, login, protected account access and CSRF-protected logout. Use Spring Session JDBC and Flyway for the session tables. | Add accessible React sign-in and expiry states. Draw the request timeline from actual responses. | Test login, session rotation, missing CSRF token, expiry and logout. After logout a fresh API call gets 401 and the UI clears private data. |
| 3 · Authorization and first adoption | Implement owner-scoped session listing/revocation and a read-only audit role. Put decisions in the backend. | Build the first versioned session quickstart. Integrate it into a second minimal app with its own data and configuration. | Run the authorization matrix below. Compare manual App A setup with App B adoption. Record elapsed time, manual edits, questions and any help given. |
| 4 · Traditional rate limiting | Implement a bounded, thread-safe, single-process fixed-window limiter with configurable limits, expiry and an injectable clock. | Compare account and source-IP keys on login with synthetic local fixtures. Sketch token bucket behavior for the same burst and choose which contract to support. | Test below/at/over limit, concurrent requests, reset and boundary bursts. A throttled caller receives 429 and a meaningful Retry-After. |
| 5 · Shared limits | Run two local app instances. Replace the process-local counter with an atomic Redis increment-and-expiry operation behind the same policy. | Alternate requests between replicas. Exercise shared-IP users, expiry and store unavailability. Keep PostgreSQL as the session store. | The same tests pass across replicas. Document the observed single-process limitation, outage response, recovery and differences between 429 and 503. |
| 6 · JWT-protected API | Configure a local Keycloak issuer and a separate Spring Security resource-server chain. Map approved scopes to allowed operations. | Add a consumer endpoint and the verify step. Explain access versus ID tokens, token lifetime, expiry and the actual effect of logout. | Test signature, issuer, audience, expiry, wrong token type and insufficient scope. Confirm the existing session cannot satisfy this path. |
| 7 · Company SSO | Register separate OIDC clients for two apps. Use authorization code with PKCE S256, explicit redirect URIs and isolated cookies. | Map the provider identity to a local user by issuer and subject. Add safe callback handling and separate local logout from provider logout. | Verify sign-in across both apps and the response to a rejected callback. Demonstrate which sessions survive local logout. |
| 8 · Self-service verification | Finish the JWT and SSO quickstarts. For each path list prerequisites, file changes, secret references, overrides and expected positive/negative tests. | Have a developer use a tagged or pinned recipe in a clean consumer checkout. Test keyboard use, loading/failure states and replay without new auth requests. | All three consumer checks run independently of the portal. Record friction, fix one observed problem and repeat the affected step. Label a solo rehearsal as such. |
| 9 · Versioned delivery and AWS design | Build non-root images and a release manifest with digests. Establish a shared SemVer policy, Conventional Commits, changelog and compatibility table. | Plan Terraform for HTTPS ALB, private ECS tasks, RDS, secrets, CloudWatch and regional WAF. Decide how shared counters are supplied if running multiple replicas. Estimate recurring costs and review teardown. | Consumer CI passes against the release candidate. Review the Terraform plan, threat boundaries, budget and fallback version before provisioning. |
| 10 · Deploy the protected API | Deploy the demo with ECS Fargate and Terraform. Use short-lived GitHub Actions AWS credentials, least-privilege roles and backward-compatible migrations. | Route public traffic through the ALB. Associate the regional WAF web ACL, put the login rate rule in Count, and review a sanitized metric or test-rule log. | HTTPS smoke checks match local auth and authorization expectations. Record the deployed digest, ACL association and observable path from edge to application. |
| 11 · AWS defenses and recovery | Tune the rate rule, review benign traffic, and exercise Count-to-Block and rollback on staging. Document Shield Standard coverage and residual application risks. | Use the API protection exercise for a low-volume smoke check and a tabletop alert drill. Test ECS rollback with a compatible schema. | Save the rule configuration, redacted observations, alarm response and rollback result. Distinguish measured behavior from documented DDoS coverage. |
| 12 · Upgrade and handover | Upgrade one supported dependency or recipe version in the consumer. Run its existing checks and document the migration or rollback steps. | Repeat the adoption exercise, record limitations, publish release evidence when authorized, and exercise cloud teardown. | A second developer can follow a pinned path to a passing check. Report measured adoption time, manual steps, help needed and the scope of the checks. |

## Authorization contract

Authentication establishes who is calling. Authorization decides whether that caller may perform this action on this resource. Implement default-deny routing plus service-level policy and owner-scoped queries. Derive principal, roles and scopes from a verified server-side identity. For OIDC, explicitly map trusted claims into local permissions and deny unrecognized values. Keep client-side visibility and button states in sync with the server. [OWASP authorization guidance](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)

| Caller and action | Expected protected API result |
| --- | --- |
| Anonymous caller reads a private account | 401. Browser navigation may separately initiate sign-in. |
| Owner lists their sessions or revokes one with a valid CSRF token | List only their own entries. After revocation the next protected request with that session gets 401. Use opaque display handles. |
| Another signed-in user requests or revokes that session | Return the same 404 as an unknown handle. Verify the owner's session still works. |
| Ordinary user reads the restricted audit view | 403. An explicitly authorized audit reader can read redacted entries. This role grants no cross-account revocation. |
| API client has a valid token with read scope | Read succeeds. A write requiring a different scope gets 403. Ownership rules still apply to user-owned records. |
| A role is removed | Document and test when the change takes effect for stored sessions and already-issued tokens. Record the maximum stale-permission interval for the chosen configuration. |

Use isolated identities for owner, second user and audit reader. Test at both the HTTP and service/repository boundaries. Record privileged changes and outcomes using safe references. Define retention and who may read the audit trail.

## Architecture and security decisions

The demo runs as a React SPA and a Spring MVC modular monolith. Vite proxies local API calls. The AWS deployment uses same-origin HTTPS routing at the ALB, with private application tasks and data services. Flyway owns schemas. The consumer can live under `examples/` initially but must build in isolation. Bind all local-only controls to the demo configuration.

- **Browser.** Use HttpOnly cookies, Secure over HTTPS, an explicit SameSite policy, bounded idle and absolute lifetimes, session rotation on authentication and server-side revocation. Keep cookie-authenticated writes CSRF-protected. Use adaptive password hashing and generic failures for local credentials.
- **Tokens and SSO.** Use Spring Security for signature and protocol validation. Pin issuer and intended recipient, distinguish ID tokens from API access tokens, and test signing-key rotation. Keep client secrets server-side. Validate state and nonce as applicable. Document refresh and revocation support for the chosen provider. [OAuth security best current practice](https://www.rfc-editor.org/rfc/rfc9700) · [OIDC Core](https://openid.net/specs/openid-connect-core-1_0.html) · [Spring resource-server JWT reference](https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/jwt.html)
- **Frontend.** Use strict TypeScript and accessible forms. Separate input state from server state, clear private caches on logout, and provide a text equivalent for each diagram. Label illustrative steps and observed outcomes. A replay reads recorded, redacted events. Exclude raw tokens, credentials, cookies and session identifiers from the UI, logs and traces.
- **Delivery.** Use Maven verification, frontend lint/type/build checks, real PostgreSQL/Redis integration tests where used, a controlled issuer and browser tests. Promote the tested image digests. Use encrypted, versioned Terraform state with locking, restricted access and a teardown runbook. Document the source and rotation of secrets, the owner of each recipe, how to report issues, and the supported upgrade window before publishing.
- **Observability.** Track route-level request counts, denials, throttles, dependency failures and latency. Use low-cardinality metric labels and redact logs. Connect WAF, ALB and app observations during a drill. Capture assumptions, measurements and limitations under `docs/experiments/`.

## Scope decisions after the core release

| Candidate | When it earns a place |
| --- | --- |
| Redis-backed sessions | A consumer needs Redis for session storage. Run the same ownership and revocation suite as PostgreSQL. |
| Kubernetes | Once ECS and its protection checks work, use one local kind exercise to roll two replicas and verify that active sessions survive and revoked sessions stay denied. |
| Cognito user pool | Repeat the SSO or JWT consumer checks with a managed issuer and document provider differences. Add client credentials when a machine caller has its own requirement. |
| Additional identity and defense studies | Compare WorkOS AuthKit/Radar, Auth0, Cognito and Keycloak against implemented behavior. Study managed recovery, MFA, bot protection, pricing and operating responsibility before adding integrations. |

## AI-assisted Software Engineering

This is a parallel learning track. Pick an exercise when it supports the current milestone and record evidence under `docs/experiments/`. Progress is shown by what you can verify and explain. See the [agent skills guide](AGENT_SKILLS.md) for the installed set and example workflows.

| Objective | Practical evidence |
| --- | --- |
| Discover, install and author skills | Locate the official source for one capability. Review its instructions and dependencies, compare name and scope with installed skills, and install a pinned copy in an experiment branch. Author a small custom skill for verifying a LoginGuard integration. Test one prompt that should activate it and one that should not. |
| Curate context and repository instructions | Distinguish standing `AGENTS.md` guidance from task instructions. Split a long procedure into a short `SKILL.md` and on-demand references. Compare a focused packet of source, tests and redacted logs with a full-repository handoff. Record token use and missing facts. |
| Integrate tools with MCP | Try an authorized read-only documentation source. Inspect advertised tools, identity, permissions, data sent and returned. Verify one answer against the original documentation and note when direct source access was enough. |
| Delegate with subagents | Give two read-only agents separate questions about a session change, such as consumers and test coverage. Reconcile both outputs against the code. Compare total context and human review effort with a single-agent pass. |
| Keep humans in architecture decisions | Use a design interview to agree on session ownership or JWT validation boundaries. Compare two designs and record the accepted decision and tradeoffs in the existing ADR convention. |
| Automate testing and code review | Drive one owner-only behavior through a failing then passing Spring test. Review the diff against the authorization matrix. Have a human assess whether the checks would catch a plausible regression and sign off on auth-sensitive changes. |
| Inspect agent and supply-chain risks | Review one skill revision for external calls, embedded instructions, executable helpers and package lifecycle scripts. Test on a sanitized scratch checkout with no connected credentials. Record scope, provenance, approved tools and what remains unknown. |
| Evaluate agent effectiveness | Repeat the same issue with one method per run and a no-skill baseline. Keep the model, starting revision, prompt, fixtures, tools and permission scope constant. Score the resulting diff and what the human can explain afterward. |

### Comparative experiments

- **Requirements and domain design.** Compare Matt Pocock's interview with Addy's spec-first workflow on the same session-revocation brief. Review the resulting ownership model, edge cases, scope and evidence before any implementation.
- **Test-first implementation.** Compare Matt's TDD with Superpowers' TDD in separate worktrees on the same isolated rate-limit behavior. Use the same independent checks. Compare test strength, production complexity and how many corrections the human had to make.
- **Impact and review.** Compare pstack's caller tracing and ECC's impact approach on a synthetic JWT claim mapping or Flyway migration diff. Include known downstream consumers and a rollback constraint. For dashboard feedback, optionally compare the installed workflow with gstack's product/design framing in a separate reviewed sandbox.
- **Learning from a PR.** Compare pstack's teaching skill with a direct code-reading prompt for the same merged PR. Ask the human to explain the runtime flow, cite a design decision and predict one regression without rereading the answer.

Before each run, write the expected behaviors and prepare held-back checks. Score **correctness** by those checks, **maintainability** by readability and fit with existing conventions, **unnecessary complexity** by avoidable code or dependencies, and **test quality** by whether tests catch the intended failure. Record **token consumption** from available model statistics, including subagents when reported, and mark missing metrics as unavailable. Assess **human learning** with a short teach-back and note time spent correcting the agent. Keep code and test evidence for review. Repeat or rotate the order where practical because both the model and the human can improve with another attempt.
