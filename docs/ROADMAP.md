# LoginGuard roadmap

LoginGuard is the primary build. It starts as a Spring Boot security lab and becomes a platform that generates runnable Spring Boot starter apps. The adoption test is whether another developer can run a versioned starter, verify it in their own CI, and upgrade it. Runbook Search is the follow-on project and a prospective adopter.

Use this roadmap as the source of truth for scope, sequencing, decisions and the next handoff. The [README](../README.md) owns local setup and check commands. The [API protection exercise](API-PROTECTION.md) supplies the detailed local-to-AWS experiments.

## Current handoff

**Foundation starting point.** The application baseline at `000543e` has the React/Vite landing page, Spring Boot context test and [PostgreSQL migration test](../backend/src/test/java/com/loginguard/loginguard/DatabaseMigrationTests.java).

**Verification.** The 25 November checkout review confirmed placeholders under `.github/workflows/` and `infrastructure/`. A passing GitHub Actions run is pending.

**Next task.** Add and verify the first GitHub Actions workflow from a clean checkout. Run Maven verification against isolated PostgreSQL and run the React lint and production build checks with the locked toolchain. Record the passing run URL in the handoff. Then build and verify the health endpoint, deny-by-default security and Vite proxy before starting session login.

**Release decision.** The [first public release](#first-public-release) ships one preset in one AWS region. Fast ZIP downloads, effective download rate limiting, and a verified starter upgrade and rollback are release gates.

**Maintaining the handoff.** At the start of a task, compare this section with the working tree and recent checks. When work changes the milestone status, record the observed result, the check or decision that supports it, and the next unfinished step here. Keep setup commands in the README and link detailed decisions or experiments from the relevant milestone.

## Engineering practices

Use the [skills registry](AGENT_SKILLS.md) for a repeatable workflow from design and acceptance criteria through verification and review. Keep the developer's decisions, changes and evidence visible in each PR. The long-term software factory goal is to automate steps once the manual workflow is repeatable and has clear inputs, checks and approval points. Start with repository guidance, pinned skills and documented checks.

## Delivery milestones

| Milestone | Build | Evidence to close it |
| --- | --- | --- |
| 1. Verify the foundation | Add GitHub Actions for Maven verification with isolated PostgreSQL and for React lint and the production build using the locked Java and Node versions. Build the health endpoint, deny-by-default security and Vite proxy as a small follow-up. | A successful workflow run from a clean checkout runs the context and migration tests and both frontend checks. After the health slice, verify anonymous health access, denial of other requests and reachability from the React landing page. |
| 2. Build the first golden path | Add session login, protected account access, CSRF-protected logout and owner-scoped session listing and revocation. Store sessions in PostgreSQL using Spring Session JDBC and Flyway. Start rate limiting in-process, then use Redis to share the allowance across two app instances. | Verify session rotation, expiry, anonymous access, logout, CSRF and selective revocation. Run the same rate-limit contract locally and across two replicas, including recovery. See the [API protection exercise](API-PROTECTION.md). |
| 3. Ship a runnable ZIP | Compose **Sessions + Rate limiting** from templates at the same Git revision as the lab. CI pre-builds and tests every supported combination. Include editable source, setup instructions, example configuration, migrations, tests, Compose and CI configuration. Keep secrets out of the ZIP. Record the preset, source revision, artifact version and SHA-256 in a release manifest. | Extract the ZIP in a clean directory, build and start the app, and run its integration checks independently of the catalog. In a small standalone consumer, pin one release candidate, apply the documented upgrade to the next candidate, and rerun the consumer's own checks. |
| 4. Deploy to AWS | Publish the exact ZIP bytes that passed CI and the release manifest to S3. Serve the catalog through CloudFront and run the Spring Boot generator on ECS Fargate in one region. The generator uses the pinned base ZIP for validated customization such as project name. | Download a published ZIP, verify its checksum against the tested artifact, and run it. Verify customization and invalid-input handling. Promote the catalog only after checking that referenced artifacts are present and match the manifest. In staging, roll the catalog back to the previous tested version and verify that its ZIP is served while versioned artifacts remain intact. Pass the [download performance and abuse protection checks](#non-functional-requirements) before public release. |

The platform maintains templates, supported combinations and overrides, tested dependency versions, migrations, verification tests, upgrade notes and security fixes. Each app team owns its identities, secrets, provider registrations, business permissions, deployment and choice of limits. Use local Keycloak for the JWT and SSO exercises. The [API protection exercise](API-PROTECTION.md) covers the AWS perimeter checks and Shield Standard readiness.

## First public release

Ship one supported preset, **Sessions + Rate limiting**, with versioned ZIP downloads and validated custom generation in one AWS region. Milestones 1–4 and the download requirements define the release gates. Follow-up work includes JWT-protected APIs, company SSO, the read-only audit view, and Runbook Search adoption. Run the active-active experiment with the stateless generator after the single-region release and record observed failover, artifact replication lag and rollback.

## Golden paths

| Golden path | What its tests prove |
| --- | --- |
| Sessions + Rate limiting | Login rotates the session identifier. After selective revocation, only the revoked browser loses access on its next protected request. Two instances enforce one allowance and a throttled request receives 429 with Retry-After. |
| JWT-protected API | A token with the expected signature, issuer, audience and scope works. Invalid credentials receive 401. Authenticated callers lacking permission receive 403. A browser cookie alone cannot authorize the API. |
| Company SSO | Two OIDC clients can use one provider login. The authorization-code flow uses PKCE S256 and separate client registrations and cookies. Logging out of one app has the documented effect on both apps and the provider session. |

## Non-functional requirements

| Requirement | Design | Release evidence |
| --- | --- | --- |
| Fast starter downloads | Pre-build default ZIPs in CI and serve immutable, versioned artifacts from CloudFront's cache. Reserve ECS generation for custom requests. | Measure p95 time to first byte and time to complete a representative ZIP download on cache hits and misses. Record ZIP size, client location and network conditions. Set targets from the staging baseline and verify them before public release. Track custom generation latency separately. |
| Download abuse protection | Apply a download-specific AWS WAF rate rule at CloudFront so cached requests are covered. Keep the S3 bucket private with CloudFront origin access control. Give custom generation its own rate limit and concurrency cap to bound expensive work. | In controlled staging, verify that the configured rate rule actually throttles requests for a cached ZIP, ordinary downloads still succeed, and throttled clients recover after their request rate drops. Verify that anonymous direct S3 reads are denied and that the generator rejects excess requests and recovers. Track throttles and bytes served. |

## Runbook Search

Runbook Search explores permission-aware search, Kafka, distributed systems and RAG. The WSL checkout contained a README and roadmap as of 25 November 2026. Application code and CI are still pending. It can adopt a LoginGuard starter once the first ZIP passes, then record how long setup took, which manual changes it needed, and whether its own checks pass after an upgrade.

1. **Prove correctness.** Start with two teams and two runbooks. Use Kafka to index revisions. Test that late or duplicate events cannot restore old or deleted content, and that access revocation takes effect while the index lags. Compare direct publishing with a transactional outbox and Debezium.
2. **Compare retrieval and answers.** Start with full-text search. Compare vector and hybrid retrieval and RAG on the same cases. Measure citation accuracy, access isolation, latency and cost.
3. **Test deployment boundaries.** Measure whether the query API and indexer benefit from independent deployments and scaling. Exercise rollout and recovery locally on Kubernetes. Helm and a short-lived EKS deployment are follow-ups.

## Authorization contract

Authentication establishes who is calling. Authorization decides whether that caller may perform this action on this resource. Implement default-deny routing plus service-level policy and owner-scoped queries. Derive principal, roles and scopes from a verified server-side identity. For OIDC, explicitly map trusted claims into local permissions and deny unrecognized values. Keep client-side visibility and button states in sync with the server. [OWASP authorization guidance](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)

| Caller and action | Expected protected API result |
| --- | --- |
| Anonymous caller reads a private account | 401. Browser navigation may separately initiate sign-in. |
| Owner lists their sessions or revokes one with a valid CSRF token | List only their own entries. After revocation the next protected request with that session gets 401. Use opaque display handles. |
| Another signed-in user requests or revokes that session | Return the same 404 as an unknown handle. Verify the owner's session still works. |
| Ordinary user reads the restricted audit view (follow-up) | 403. An explicitly authorized audit reader can read redacted entries. This role grants no cross-account revocation. |
| API client has a valid token with read scope (JWT follow-up) | Read succeeds. A write requiring a different scope gets 403. Ownership rules still apply to user-owned records. |
| A role is removed (role-based access follow-up) | Document and test when the change takes effect for stored sessions and already-issued tokens. Record the maximum stale-permission interval for the chosen configuration. |

Use isolated owner and second-user identities for the first release. Add a separate audit-reader identity when building the audit view. Test at both the HTTP and service/repository boundaries. Record privileged changes and outcomes using safe references. Define retention and who may read the audit trail.

## Architecture and security decisions

The demo uses a React SPA and a Spring MVC modular monolith. Use Vite to proxy local API calls and Flyway to manage schemas. CloudFront serves the catalog and S3 stores versioned starter artifacts. The generator runs on ECS Fargate and remains stateless. Generated apps build and run in isolation. Bind all local-only controls to the demo configuration.

- **Browser.** Use HttpOnly cookies, Secure over HTTPS, an explicit SameSite policy, bounded idle and absolute lifetimes, session rotation on authentication and server-side revocation. Keep cookie-authenticated writes CSRF-protected. Use adaptive password hashing and generic failures for local credentials.
- **Tokens and SSO.** Use Spring Security for signature and protocol validation. Pin issuer and intended recipient, distinguish ID tokens from API access tokens, and test signing-key rotation. Keep client secrets server-side. Validate state and nonce as applicable. Document refresh and revocation support for the chosen provider. [OAuth security best current practice](https://www.rfc-editor.org/rfc/rfc9700) · [OIDC Core](https://openid.net/specs/openid-connect-core-1_0.html) · [Spring resource-server JWT reference](https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/jwt.html)
- **Frontend.** Use strict TypeScript and accessible forms. Separate input state from server state, clear private caches on logout, and provide a text equivalent for each diagram. Label illustrative steps and observed outcomes. A replay reads recorded, redacted events. Exclude raw tokens, credentials, cookies and session identifiers from the UI, logs and traces.
- **Delivery.** Use Maven verification, frontend lint/type/build checks, real PostgreSQL/Redis integration tests where used, a controlled issuer and browser tests. Promote the tested image digests. Use encrypted, versioned Terraform state with locking, restricted access and a teardown runbook. Document the source and rotation of secrets, the owner of each recipe, how to report issues, and the supported upgrade window before publishing.
- **Observability.** Track route-level request counts, denials, throttles, dependency failures and latency. Use low-cardinality metric labels and redact logs. Connect WAF, ALB and app observations during a drill. Capture assumptions, measurements and limitations under `docs/experiments/`.

## Scope decisions after the core release

| Candidate | When it earns a place |
| --- | --- |
| Redis-backed sessions | A consumer needs Redis for session storage. Run the same ownership and revocation suite as PostgreSQL. |
| Cognito user pool | Repeat the SSO or JWT consumer checks with a managed issuer and document provider differences. Add client credentials when a machine caller has its own requirement. |
| Additional identity and defense studies | Compare WorkOS AuthKit/Radar, Auth0, Cognito and Keycloak against implemented behavior. Study managed recovery, MFA, bot protection, pricing and operating responsibility before adding integrations. |
