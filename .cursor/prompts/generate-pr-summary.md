---
summary: Generate PR title and description based on current PR changes
---

## Context  
- Link to PR: $ARGUMENTS 
- PR Template: @.cursor/templates/pr-description-template.md 
- Naming guidance: @.cursor/docs/pr-title-guidelines.md
- Links schema: @.cursor/docs/jira-and-staging-links-schema.md

## Variables  
- $JIRA-URL: from branch ve-/VE- prefix → https://volindo-software.atlassian.net/browse/VE-XXXX
- $STAGING-PREFIX: last segment of branch
- $STAGING-URL: https://{$STAGING-PREFIX}.app.bookorp.com/

## Task
Generate a PR title and description using the template and guidelines. Do not modify GitHub; output content for copy-paste.

## Steps
1. Read template: @.cursor/templates/pr-description-template.md
2. Get PR info: `gh pr view --json number,title,body`
3. Inspect diff: `gh pr diff`
4. Fill template: replace variables and bracketed instructions with PR-specific info
5. Produce a concise, standards-compliant title

## Output
- Title on one line
- Description following the template, with variables applied
