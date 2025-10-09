---
summary: Generate clear, conventional commit message including $JIRA-TICKET
---

## Context
This prompt helps create a conventional commit message based on staged changes and branch context.

### Commit Message Format
```
<type>(<scope>): <short description>

[optional body]

$JIRA-TICKET
```

### Types
- feat, fix, refactor, style, chore, docs, test, perf

### Variables
- $JIRA-TICKET: Extract from branch name (ve- or VE-), e.g., ve-1724/... → VE-1724
- $ARGUMENTS: Optional override/details from user

## Task
Analyze staged changes and branch to generate a commit message. Do not commit; just output the message and splitting suggestions if needed.

### Steps
1. Get branch name: `git branch --show-current` and extract $JIRA-TICKET
2. Check staged changes: `git status`
3. Analyze diff: `git diff --cached`
4. Suggest splitting if unrelated logical changes are found (list files per logical group)
5. Determine type/scope
6. Generate ≤72-char first line
7. Output message and ask for approval

### Output
```
<type>(<scope>): <description>

[Optional details if complex]

VE-XXXX
```
