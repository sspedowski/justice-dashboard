#!/usr/bin/env node

/**
 * Close Main Branch Pull Requests Script
 * 
 * This script closes all open pull requests targeting the main branch,
 * with options to exclude specific PRs and run in dry-run mode.
 * 
 * Usage: node scripts/close-main-prs-api.js [--dry-run] [--exclude-pr=<number>]
 */

const { execSync } = require('child_process');

// Configuration
const REPO_OWNER = 'sspedowski';
const REPO_NAME = 'justice-dashboard';
const TARGET_BRANCH = 'main';

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const excludePrArg = args.find(arg => arg.startsWith('--exclude-pr='));
const excludePrNumber = excludePrArg ? parseInt(excludePrArg.split('=')[1]) : null;

// Show help
if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Close Main Branch Pull Requests Script
=====================================

Usage: node scripts/close-main-prs-api.js [options]

Options:
  --dry-run              Show what would be closed without actually closing
  --exclude-pr=<number>  Exclude a specific PR number from being closed
  --help, -h             Show this help message

Examples:
  node scripts/close-main-prs-api.js --dry-run
  node scripts/close-main-prs-api.js --exclude-pr=12
  node scripts/close-main-prs-api.js

Note: This script requires 'gh' CLI tool to be installed and authenticated.
`);
    process.exit(0);
}

/**
 * Get current git branch
 */
function getCurrentBranch() {
    try {
        return execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    } catch (error) {
        console.warn('⚠️  Could not determine current branch');
        return null;
    }
}

/**
 * Get all open pull requests using gh CLI
 */
function getOpenPullRequests() {
    try {
        console.log('🔍 Fetching open pull requests...');
        const output = execSync('gh pr list --state open --json number,title,headRefName,baseRefName', { encoding: 'utf8' });
        return JSON.parse(output);
    } catch (error) {
        if (error.message.includes('gh: command not found')) {
            throw new Error('GitHub CLI (gh) is not installed. Please install it from https://cli.github.com/');
        }
        if (error.message.includes('authentication')) {
            throw new Error('GitHub CLI is not authenticated. Please run "gh auth login"');
        }
        throw new Error(`Failed to fetch pull requests: ${error.message}`);
    }
}

/**
 * Close a pull request using gh CLI
 */
function closePullRequest(prNumber, title) {
    console.log(`🔄 Closing PR #${prNumber}: ${title}`);
    
    if (isDryRun) {
        console.log(`   💡 DRY RUN: Would close PR #${prNumber}`);
        return true;
    }

    try {
        execSync(`gh pr close ${prNumber}`, { encoding: 'utf8' });
        console.log(`   ✅ Successfully closed PR #${prNumber}`);
        return true;
    } catch (error) {
        console.error(`   ❌ Failed to close PR #${prNumber}: ${error.message}`);
        return false;
    }
}

/**
 * Main function
 */
async function main() {
    console.log('🚀 Justice Dashboard PR Manager');
    console.log('================================');
    
    if (isDryRun) {
        console.log('💡 Running in DRY RUN mode - no PRs will actually be closed');
    }
    
    if (excludePrNumber) {
        console.log(`🚫 Excluding PR #${excludePrNumber} from closure`);
    }

    const currentBranch = getCurrentBranch();
    if (currentBranch) {
        console.log(`📍 Current branch: ${currentBranch}`);
    }

    try {
        // Get all open PRs
        const allPrs = getOpenPullRequests();
        console.log(`📊 Found ${allPrs.length} open pull request(s)`);

        // Filter PRs targeting main branch
        const mainBranchPrs = allPrs.filter(pr => pr.baseRefName === TARGET_BRANCH);
        console.log(`🎯 Found ${mainBranchPrs.length} pull request(s) targeting '${TARGET_BRANCH}' branch`);

        if (mainBranchPrs.length === 0) {
            console.log('✅ No pull requests targeting main branch found to close');
            return;
        }

        // List PRs that will be affected
        console.log('\n📋 Pull requests targeting main branch:');
        for (const pr of mainBranchPrs) {
            const isCurrentBranch = currentBranch && pr.headRefName === currentBranch;
            const isExcluded = excludePrNumber && pr.number === excludePrNumber;
            const status = isCurrentBranch ? ' (current branch - will skip)' : 
                          isExcluded ? ' (excluded)' : 
                          ' (will close)';
            console.log(`   • PR #${pr.number}: ${pr.title}${status}`);
        }

        // Close PRs
        console.log('\n🔄 Processing pull requests...');
        let closedCount = 0;
        let skippedCount = 0;
        let failedCount = 0;

        for (const pr of mainBranchPrs) {
            // Skip if it's the current branch
            if (currentBranch && pr.headRefName === currentBranch) {
                console.log(`⏭️  Skipping PR #${pr.number} (current working branch: ${currentBranch})`);
                skippedCount++;
                continue;
            }

            // Skip if explicitly excluded
            if (excludePrNumber && pr.number === excludePrNumber) {
                console.log(`⏭️  Skipping PR #${pr.number} (excluded by --exclude-pr flag)`);
                skippedCount++;
                continue;
            }

            const success = closePullRequest(pr.number, pr.title);
            if (success) {
                closedCount++;
            } else {
                failedCount++;
            }
        }

        // Summary
        console.log('\n📊 Summary:');
        console.log(`   ✅ ${closedCount} pull request(s) closed`);
        console.log(`   ⏭️  ${skippedCount} pull request(s) skipped`);
        if (failedCount > 0) {
            console.log(`   ❌ ${failedCount} pull request(s) failed to close`);
        }
        
        if (isDryRun) {
            console.log('\n💡 This was a dry run. To actually close PRs, run without --dry-run flag');
        }

    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
}

// Run the script
main().catch(error => {
    console.error(`💥 Unexpected error: ${error.message}`);
    process.exit(1);
});