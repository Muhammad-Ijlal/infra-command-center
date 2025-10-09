## Context

Guideline for naming Pull Request in project. Used by: `/generate-pr-summary` prompt

References:
- Jira and staging link schema: `@.cursor/docs/jira-and-staging-links-schema.md`

## Naming the PR

Anatomy: `Keyword` `$JIRA-TICKET` `[FeatureName]` `Short summary`

Example: `Add VE-9000 [Nimbus] New Nimbus manager added`

### Keyword

Key Word | Meaning
--- | --
Add | Create a capability e.g. feature, test, dependency.
Remove | Remove a capability e.g. feature, test, dependency.
Refactor | An update to existing code and/or refactoring.
Bugfix | Fix an issue e.g. bug, typo, accident, misstatement.
Bump | Increase the version of something e.g. dependency.
Build | Change only to the build process, tooling, or infra.
Document | A change to documentation only.
Localize | String and localization only related changes.
Revert | Reverting a previous commit.

### FeatureName 
- Short camel-cased name (1–4 words) of area/feature. Offer alternatives if unclear.

### $JIRA-TICKET
- Extracted from branch name (ve- or VE- prefix) → `VE-XXXX`. Use placeholder if missing.

### Short Summary
- Brief explanation of what the PR does.

## Merging the PR
- Use Squash & Merge policy.
