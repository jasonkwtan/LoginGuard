# LoginGuard agent skills

Choose a skill when the task calls for its workflow. Use the project’s setup and verification commands for LoginGuard work. [Repository instructions](../AGENTS.md) · [Development checks](../README.md#development)

| Skill | When to use it |
| --- | --- |
| [`grilling`](../.agents/skills/grilling/SKILL.md) | Stress-test a plan or decision with focused questions. |
| [`grill-with-docs`](../.agents/skills/grill-with-docs/SKILL.md) | Work through a design with the existing project docs and capture decisions as they emerge. |
| [`domain-modeling`](../.agents/skills/domain-modeling/SKILL.md) | Clarify project terminology or record a decision in a glossary or ADR. |
| [`to-spec`](../.agents/skills/to-spec/SKILL.md) | Turn an agreed design into a spec for the configured issue tracker. |
| [`tdd`](../.agents/skills/tdd/SKILL.md) | Implement a behavior change test-first through its public interface. |
| [`diagnosing-bugs`](../.agents/skills/diagnosing-bugs/SKILL.md) | Build a repeatable check for a bug or performance regression and diagnose its cause. |
| [`code-review`](../.agents/skills/code-review/SKILL.md) | Review changes against the project’s standards and the originating spec. |
| [`research`](../.agents/skills/research/SKILL.md) | Investigate a question using primary sources and record the findings. |
| [`ponytail`](../.agents/skills/ponytail/SKILL.md) | Keep a code change as small as the task allows. |
| [`create-verification-skill`](../.agents/skills/create-verification-skill/SKILL.md) | Create a repeatable way to verify the running app through its normal interfaces. |
| [`maintain-verification-skill`](../.agents/skills/maintain-verification-skill/SKILL.md) | Check that an existing verification skill still matches the app and repair drift. |
| [`setup-matt-pocock-skills`](../.agents/skills/setup-matt-pocock-skills/SKILL.md) | Configure the issue tracker, triage labels, and domain documentation before using workflows that require them. |

The project skills live in [`.agents/skills`](../.agents/skills/). Update the installed files, upstream pins and content hashes, and applicable license notices together when changing the set. [Lockfile](../skills-lock.json) · [License notices](../.agents/THIRD_PARTY_NOTICES.md)
