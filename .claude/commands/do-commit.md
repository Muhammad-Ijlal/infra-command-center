---
allowed-tools: Bash(git add:*), Bash(git commit:*), Bash(git status:*), Bash(git diff:*), Bash(git log:*)
description: Execute git commit using message from /generate-commit workflow
---

## Context

This command executes a git commit using the commit message generated and saved by the `/generate-commit` command.

## Task

Read the conversation history to find the commit message file created by `/generate-commit`, then execute the git commit.

### Steps

1. **Find commit message file**: Search conversation history for the most recent file saved in `/.ml-generated-assets/pending-commit-*.md`
2. **Read the file**: Load the commit message and metadata
3. **Validate staged changes**: Run `git status` to confirm there are staged files ready to commit
4. **Check for split recommendation**:
   - If `split-recommended: true` in the file metadata, remind user they should consider splitting commits
   - Ask: "The analysis recommended splitting this into multiple commits. Continue with single commit anyway? (y/n)"
5. **Review commit details**:
   - Display summary of what will be committed
   - If anything unusual is detected, notify the user:
     - Large number of files (>10)
     - Mixed file types that might indicate unrelated changes
     - Sensitive files (.env, credentials, keys, etc.)
     - Binary files or large files
6. **Execute commit**: Run `git commit` with the message from the file using HEREDOC format
7. **Verify success**: Run `git log -1` to show the created commit
8. **Clean up**: Delete the used commit message file from `/.ml-generated-assets/`

### Safety Checks

**IMPORTANT - Always check before committing:**

1. **Sensitive files**: If staged changes include files like `.env`, `credentials.json`, `.pem`, `.key`, etc.:
   - STOP and warn the user: "⚠️ Warning: Staged files contain potential secrets: [list files]"
   - Ask: "Are you sure you want to commit these files? (y/n)"
   - If no, suggest: `git reset HEAD <file>` to unstage

2. **Large commits**: If >10 files are staged:
   - Notify: "ℹ️ Large commit detected: {count} files staged"
   - Ask: "Continue with commit? (y/n)"

3. **No staged changes**: If no files are staged:
   - Error: "❌ No staged changes found. Please stage files with `git add` first."
   - Exit without committing

### Commit Execution

Use HEREDOC format for proper message formatting:

```bash
git commit -m "$(cat <<'EOF'
{commit message from file}
EOF
)"
```

### Success Message

After successful commit, display:
```
✅ Commit created successfully!

{show git log -1 --oneline}

Next steps:
- Run `git push` to push changes to remote
- Or continue with more commits
```

### Error Handling

If commit fails:
1. Show the error message
2. Suggest possible fixes based on the error:
   - Pre-commit hook failure: Show hook output and suggest fixes
   - Empty commit: Remind to stage files
   - Merge conflict: Suggest resolving conflicts first

### Examples

**Example 1: Successful commit**
```
Found commit message: /.ml-generated-assets/pending-commit-2025-01-15T10-30-00.md

Staged files:
- src/components/Button.tsx
- src/components/Button.test.tsx

Commit message:
feat(components): add new Button component with accessibility support

VE-1234

Continue with commit? (y/n)
```

**Example 2: Warning about sensitive files**
```
⚠️ Warning: Staged files contain potential secrets:
- .env
- config/credentials.json

Are you sure you want to commit these files? (y/n)
```

**Example 3: Split recommendation reminder**
```
ℹ️ The analysis recommended splitting this into multiple commits:
- Configuration files: .env.example, .gitignore
- Documentation: CLAUDE.md

Continue with single commit anyway? (y/n)
```
