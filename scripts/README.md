# Pull Request Management Scripts

This directory contains scripts for managing pull requests in the Justice Dashboard repository.

## Scripts

### 1. `close-main-prs-api.js` (Recommended)
**Production-ready script using GitHub CLI**

Closes all open pull requests targeting the main branch with proper safety checks and error handling.

#### Prerequisites
- GitHub CLI (`gh`) must be installed and authenticated
- Install: `curl -fsSL https://cli.github.com/install.sh | sh`
- Authenticate: `gh auth login`

#### Usage
```bash
# Dry run (recommended first)
npm run close-prs:dry-run

# Actually close PRs
npm run close-prs

# Exclude specific PR
node scripts/close-main-prs-api.js --exclude-pr=12

# Show help
node scripts/close-main-prs-api.js --help
```

#### Features
- ✅ Automatically detects and skips current working branch
- ✅ Option to exclude specific PRs from closure
- ✅ Dry-run mode to preview actions
- ✅ Comprehensive error handling and logging
- ✅ Uses official GitHub CLI for reliability

### 2. `close-main-prs.js`
**Token-based script using GitHub REST API**

Alternative script that uses GitHub personal access token for environments where GitHub CLI is not available.

#### Prerequisites
- GitHub personal access token with `repo` scope
- Set environment variable: `GITHUB_TOKEN=your_token_here`

#### Usage
```bash
# Dry run
GITHUB_TOKEN=your_token node scripts/close-main-prs.js --dry-run

# Actually close PRs
GITHUB_TOKEN=your_token node scripts/close-main-prs.js
```

### 3. `close-main-prs-tool.js`
**Demonstration version**

Shows what PRs would be affected without requiring authentication. Useful for testing and demonstration.

## Safety Features

All scripts include these safety measures:

1. **Current Branch Protection**: Automatically skips PRs from the current working branch
2. **Dry Run Mode**: Preview actions without making changes
3. **Explicit Exclusions**: Option to exclude specific PRs
4. **Comprehensive Logging**: Clear output showing what actions are taken
5. **Error Handling**: Graceful handling of API errors and network issues

## Common Use Cases

### Repository Cleanup
Close all old PRs targeting main branch:
```bash
npm run close-prs:dry-run  # Preview
npm run close-prs          # Execute
```

### Selective Cleanup
Close all PRs except one specific PR:
```bash
node scripts/close-main-prs-api.js --exclude-pr=5 --dry-run
```

### Automated Workflows
Can be integrated into GitHub Actions or other CI/CD pipelines for automated repository maintenance.

## Example Output

```
🚀 Justice Dashboard PR Manager
================================
💡 Running in DRY RUN mode - no PRs will actually be closed
📍 Current branch: copilot/fix-084bf47e-41b4-46c3-aa03-3bc16057d4ab
🔍 Fetching open pull requests...
📊 Found 4 open pull request(s)
🎯 Found 3 pull request(s) targeting 'main' branch

📋 Pull requests targeting main branch:
   • PR #9: Rescue/cleanup (will close)
   • PR #2: Fix clearOldData reference error (will close)
   • PR #1: Fix README bullet and newline (will close)

📊 Summary:
   ✅ 3 pull request(s) would be closed
   ⏭️  0 pull request(s) would be skipped
```

## Best Practices

1. **Always run dry-run first** to preview what will be closed
2. **Check the current branch** before running to ensure you're not on a branch with an open PR
3. **Consider excluding important PRs** that shouldn't be closed automatically
4. **Review the output carefully** before confirming actions
5. **Test with GitHub CLI authentication** before using in production

## Troubleshooting

### "gh: command not found"
Install GitHub CLI from https://cli.github.com/

### "authentication failed"
Run `gh auth login` to authenticate with GitHub

### "Failed to fetch pull requests"
Check your internet connection and GitHub CLI authentication

### Script shows wrong PRs
Ensure you're in the correct repository directory and that your GitHub CLI is configured for the right account