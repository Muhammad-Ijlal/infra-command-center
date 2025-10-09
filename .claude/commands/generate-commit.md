---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git diff:*), Bash(git log:*)
description: Generate clear and properly named commit message containing $JIRA-TICKET
---

## Context

This command generates a conventional commit message based on staged changes and current branch context.

### Commit Message Format

```
<type>(<scope>): <short description>

[optional body]

$JIRA-TICKET
```

### Commit Types
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `style`: Styling changes (UI/CSS)
- `chore`: Maintenance tasks
- `docs`: Documentation changes
- `test`: Test additions/modifications
- `perf`: Performance improvements

### Variables

**$JIRA-TICKET**: Extract JIRA ticket number from branch name (ve- or VE- prefix).
- Branch format: `ve-1234/feature/description` or `VE-1234/fix/description`
- Extracted format: `VE-1234`
- Example: Branch `ve-1724/feature/replace-current-carousel` → `VE-1724`

**$ARGUMENTS**: Optional. Allows user to specify commit type or additional context.

## Task

Generate a conventional commit message based on:
1. Current branch name (for JIRA ticket)
2. Staged changes analysis (for type, scope, and description)
3. Git diff (to understand what was changed)

**IMPORTANT**: Don't automatically commit. Save the commit message to a file and ask user for approval.

### Steps

1. **Get branch name**: Use `git branch --show-current` to extract $JIRA-TICKET
2. **Check staged changes**: Use `git status` to see what's staged
3. **Analyze changes**: Use `git diff --cached` to understand modifications
4. **Evaluate logical separation**: If staged changes contain **two or more logically different features/changes** (e.g., documentation + feature code, or two unrelated bug fixes), suggest splitting into multiple commits
   - Provide specific `git reset` commands to unstage files for each suggested commit
   - Explain the benefit of atomic commits for better git history
5. **Determine commit type**: Based on changes:
   - New files/features → `feat`
   - Bug fixes → `fix`
   - Code improvements → `refactor`
   - UI/styling changes → `style`
   - Tests → `test`
6. **Identify scope**: Determine affected component/area (e.g., `payment`, `search-results`, `hotel-page`)
7. **Generate message**: Create clear, concise description (max 72 chars for first line)
8. **Display commit message**: Show the generated message to the user
9. **Ask for approval**: Prompt user with Linux-style prompt: "Approve this commit message? (y/n)"
10. **Handle response**:
    - If **no**: Ask "What changes would you like to make to the commit message?"
    - If **yes**: Save commit message to `/.ml-generated-assets/pending-commit-{timestamp}.md` and instruct user to run `/do-commit`

### Commit Message File Format

The saved file should contain:
```
---
type: commit-message
timestamp: {ISO-8601-timestamp}
files: {list of staged files}
split-recommended: {true/false}
---

{commit message text}
```

### Output Format

```
<type>(<scope>): <description>

[Optional detailed explanation if changes are complex]

VE-XXXX
```

### Examples

**Example 1**: Styling change
```
style(DropDownEmployee): update text color for traveler and room count displays

VE-1768
```

**Example 2**: Bug fix
```
fix(search-results): enhance layout and styling of ResultsHeader component

VE-1781
```

**Example 3**: New feature
```
feat(payment): enhance payment status handling and add PROCESSING state

Implemented new PROCESSING payment state to better handle pending transactions
and improve user feedback during payment processing.

VE-1587
```

**Example 4**: Refactoring
```
refactor(hotel-page): clean up code formatting and improve gallery handling

VE-1724
```

### Arguments

$ARGUMENTS - Optional commit type override or additional context
