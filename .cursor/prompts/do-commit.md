---
summary: Execute git commit using a provided message
---

## Context
Use a previously generated commit message (from `/generate-commit`) to commit staged changes safely.

## Task
Validate staged files, show a summary and risks, then commit using the provided message.

### Safety Checks
- Warn if sensitive files staged (.env, credentials, keys, *.pem, *.key)
- Warn if >10 files staged
- Abort if no staged changes

### Suggested Flow
1. Show staged files: `git status`
2. If warnings apply, display them and ask the user to confirm
3. Commit with message (user pastes message or references generated one)
4. Show last commit: `git log -1 --oneline`

### Commit Execution Example
```
git commit -m "$(cat <<'EOF'
{commit message}
EOF
)"
```
