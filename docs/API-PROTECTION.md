# API protection exercise

Deliver the local limiter as part of the Sessions + Rate limiting starter. The application team selects a route and a policy, adopts the default implementation, and runs the same checks in its own application. Finish the local checks before the AWS perimeter exercise. See the [roadmap](ROADMAP.md) for delivery milestones.

| Layer | Question | Evidence |
| --- | --- | --- |
| Single process | How should this endpoint behave at its limit? | A deterministic policy test and an HTTP test for 429, Retry-After and recovery. |
| Shared application state | Do two replicas enforce one configured allowance? | The same contract against two local app instances and Redis, plus a dependency-failure test. |
| Starter ZIP delivery | Can the edge serve cached ZIPs quickly and throttle excessive requests? | Cache-hit and cache-miss timings, a CloudFront WAF staging check, and a denied anonymous S3 read. |
| AWS application perimeter | Can the team observe and change a coarse HTTP traffic control independently of the app? | Terraform plan, regional WAF web ACL associated with the ALB, CloudWatch rule metrics and a staging rollback record. |
| Network and transport protection | Which DDoS risks does AWS mitigate, and which risks still need application design? | Architecture diagram and tabletop response record showing what was verified in configuration, what was observed in staging and what follows from AWS documentation. |

## 1. Define and test the local policy

Pick one sensitive route, initially local session login. Record the action counted, key, configurable threshold, window, expiry, response and owner. Evaluate per-account and source-IP rules separately using synthetic users. Account keys can inconvenience a targeted user and IP keys can group unrelated users behind one office address. Keep cooldowns bounded. Protect identifiers in logs and bound the number of counters and their lifetime.

Implement a fixed window first with an injected clock. Compare it on paper with a token bucket for the same burst near a window boundary. With small test limits, verify that two independent keys each receive their allowance, concurrent calls cannot over-admit within one window, and a rejected caller can try again after the advertised delay. Record the measured behavior and the policy a team is allowed to override. [HTTP 429 semantics](https://www.rfc-editor.org/rfc/rfc6585#section-4)

## 2. Repeat across two local instances

Point the two instances at isolated process-local counters first and observe the difference from the single-instance result. Move the same policy to Redis with an atomic increment-and-expiry operation and rerun the identical fixture. Assert the aggregate number admitted across both replicas and the expiration of the test key. Trust forwarded client identity only from configured infrastructure. Document how the real client address is derived at each hop.

For the login recipe, return a controlled 503 when its required counter store is unavailable. Preserve service for independently healthy routes according to their own policies. Restore Redis and verify recovery. Record the availability trade-off, timeouts and alert conditions. The default session recipe still stores sessions in PostgreSQL. [Redis counter and limiter patterns](https://redis.io/docs/latest/commands/incr/)

## 3. Add AWS perimeter controls

Use Terraform to associate a regional AWS WAF web ACL with the HTTPS ALB. Restrict app ingress to the load balancer. Scope a rate-based rule to the intended method and route, specify the aggregation key and evaluation window, and enable visibility with appropriate redaction. WAF estimates rates and can take time to apply or release a limit. Use the app's verified policy for account-specific decisions. [AWS WAF rate-based rule behavior](https://docs.aws.amazon.com/waf/latest/developerguide/waf-rule-statement-type-rate-based-caveats.html)

Start in Count mode in staging. Check legitimate login, an unrelated route and the app's own 429 behavior. To verify ACL coverage and Count/Block wiring with a few requests, use a temporary exact-match test rule for a harmless staging marker, observe the metric, briefly switch that test rule to Block, then restore/remove it. Record the actual WAF response and whether the request reached the app. This smoke test proves rule action and routing. Review the real rate rule's scope and metrics separately and label threshold behavior unmeasured unless observed. Tune before enforcing. A rule rollback returns it to Count and verifies normal traffic. [AWS testing and tuning guidance](https://docs.aws.amazon.com/waf/latest/developerguide/web-acl-testing.html)

## 4. Verify starter download performance and protection

Measure the [download release criteria](ROADMAP.md#non-functional-requirements) using a representative versioned ZIP. Use a cache key that includes the artifact version and omits request attributes that do not change the ZIP. Confirm that repeated requests can hit the cache and that an anonymous direct S3 request is denied. [CloudFront S3 origin access control](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html)

Scope a CloudFront WAF rate rule to ZIP downloads. Start in Count mode and check the effect on legitimate clients that share an IP. Use a low-volume block smoke test to confirm that the Web ACL covers a cached ZIP. Before release, exercise the rate rule itself in controlled staging with a bounded test threshold. Record when it starts throttling, whether an ordinary download succeeds during the test, and when the throttled client can download again. Record the test configuration and verify rollback to Count. Track cache hit rate, bytes served and requests blocked. Exercise the custom generator's rate and concurrency limits and confirm default ZIPs remain available. [AWS WAF rule scope](https://docs.aws.amazon.com/waf/latest/developerguide/waf-rule-scope-down-statements.html) · [Rate rule behavior](https://docs.aws.amazon.com/waf/latest/developerguide/waf-rule-statement-type-rate-based-caveats.html)

## 5. Practice DDoS readiness and handover

Shield Standard provides automatic baseline protection for common network- and transport-layer DDoS attacks. WAF handles HTTP request patterns, application limits control actions by account or scope, and capacity planning covers dependencies such as the database. Compare Shield Advanced as a design and cost study only. Keep high-volume traffic out of cloud exercises. Use a tabletop incident and routine low-volume staging requests for evidence. [AWS Shield Standard overview](https://docs.aws.amazon.com/waf/latest/developerguide/ddos-standard-summary.html)

In the tabletop, a dashboard reports elevated requests and login latency. Have the operator compare WAF counted/blocked requests, ALB target errors and latency, application 429/503 rates, Redis health and database connections. Identify where traffic first changes, who can tune the rule, how legitimate clients recover, when to roll back and how to escalate. Save a redacted metric snapshot, the decision and the recovery check. Document budget alerts, log retention and how to remove lab resources. Present this as readiness evidence and explicitly label any untested capacity assumptions.
