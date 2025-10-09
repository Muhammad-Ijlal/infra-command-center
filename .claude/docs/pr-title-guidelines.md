## Context

Guideline for naming Pull Request in project. Used by: `/generate-pr-summary` command

References:
- How to extract Jira issue and staging URLs for current project: `@.claude/docs/project-links-schema.md`

## Naming the PR

The name of a PR is important, because it will eventually become the commit that shows up in `master`. Here are the guidelines for how to name a PR.

Anatomy of a PR name:

`Keyword` `$JIRA-TICKET` `[FeatureName]` `Short summary`

For example:
- `Add VE-9000 [Nimbus] New Nimbus manager added`

### Keyword

The keyword should be the first thing in the name, to let everyone know what kind of change the PR is. Here is a table of the standard keywords, and what they mean:

Key Word | Meaning
--- | --
Add | Create a capability e.g. feature, test, dependency.
Remove | Remove a capability e.g. feature, test, dependency.
Refactor | An update to existing code and/or refactoring.
Bugfix | Fix an issue e.g. bug, typo, accident, misstatement.
Bump | Increase the version of something e.g. dependency.
Build | Change *only* to the build process, tooling, or infra.
Document | A change to documentation *only*.
Localize | String and localization only related changes.
Revert | Reverting a previous commit.

> **Discussion**: Why the standard GitHub `Fixes`/`Fix` keyword is not used? Simply put, these two keywords close tickets. However, we want to prevent tickets from being closed - rather, those tickets should follow our process and be moved to QA. As such, we use `Bugfix` instead.


### FeatureName 

A short-form version of the feature you're working on, or, alternatively the location you're making changes. It should be camel-cased 1-2-3-4 words length. Serves as an easy, at a glance, indicator of what the PR is touching. Think carefuly which Feature Name describe PR most clearly. Suggest several options for user if you are not sure about clear naming

### $JIRA-TICKET
Variable: $JIRA-TICKET. Extracted from branch name (if branch named properly) or VE-XXXX
It is formatted as: `VE-XXXX` where XXXX is the ticket number from JIRA. Note: we should use the format prefix `VE-`. We use the JIRA number as a standard because JIRA is the source of truth. While contributors might use the GitHub number for issue, when we merge their tickets, we should still enter the appropriate JIRA ticket ID.

> **Contributor Note**: Given that contributors don't have access to JIRA ticket numbers, it's fine to leave your Issue Number as `VE-XXXX` or as `VE-YYYY`, where `YYYY` is the GitHub ticket number, and a reviewer will update the required information when going over the PR. Alternatively, for those who are proactive, you can hover over the "Issue is synchronized with JIRA task" in the GitHub issue and you'll see the link with the JIRA number. Either way is acceptable.


### Short Summary

This is a short summary of what your commit is doing.

## Merging the PR

Trivto uses a `Squash & Merge` policy which results in your entire PR being a single commit on the `master` commit history. This, individual commit names are not important, but they're helpful for context.