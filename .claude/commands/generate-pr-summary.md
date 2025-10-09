---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*), Bash(gh *)
description: Create pull request title, description and follow-up for pull request specified in $ARGUMENTS
---

## Context  

(text wrapped in square brackets is llm instructions and should be replaced with PR info in described format)


- Link to PR: $ARGUMENTS 
- PR Template: @.claude/templates/pr-description-template.md 
- How to extract 

Command should generate PR title and description. 
Title - generate pr summary using guidielines from `@.claude/docs/pr-title-guidelines.md`
Description -  Description Template with  instructions `[]` replaced with relevant PR information

When processing an /prepare-pr-preview $ARGUMENTS command, use Decsription Template, apply variables and apply  instructions `[]`

### Variables:  

$JIRA-URL: link to jira ticket if branch name contain jira task number (ve- or VE-). Example: for branch `ve-1234/feature/test-stage-url-attached` value will be - https://volindo-software.atlassian.net/browse/VE-1234 

$STAGING-PREFIX: staging prefix is last part of branch name (after last slash). Example: for branch `ve-1234/feature/test-stage-url-attached` value will be test-stage-url-attached 

$STAGING-URL: https://{$STAGING-PREFIX}.app.bookorp.com/. Example: if $STAGING-PREFIX is `test-stage-url-attached` value will be https://test-stage-url-attached.app.bookorp.com/

## Task

Generate pull request title, description  based on changes in pull request

**IMPORTANT**: Don't comment, update or edit anything on github. You should provide answer in CLI for user in copy-ready format   


### Steps

1. **Read the template file**: Use the Read tool to get the exact content of @.github/pull_request_template.md
2. **Get current PR info**: Use `gh pr view --json number,title,body` to get the current PR details
3. **Analyze the changes**: Use `gh pr diff` to understand what changes were made in the PR
4. **Generate description**: 
Generate description using "Decsription Template" format and apply instructions `[]` 
4. **Generate pull request information**: Generate pull request title

### Arguments

$ARGUMENTS