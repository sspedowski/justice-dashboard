#!/usr/bin/env node

/**
 * Script to close all open pull requests targeting the main branch
 * Usage: node scripts/close-main-prs.js [--dry-run] [--exclude-pr=<pr_number>]
 */

const https = require('https');
const { execSync } = require('child_process');

// Configuration
const REPO_OWNER = 'sspedowski';
const REPO_NAME = 'justice-dashboard';
const TARGET_BRANCH = 'main';

// Command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const excludePrArg = args.find(arg => arg.startsWith('--exclude-pr='));
const excludePrNumber = excludePrArg ? parseInt(excludePrArg.split('=')[1]) : null;

// Get GitHub token from environment
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;

if (!GITHUB_TOKEN) {
    console.error('❌ Error: GitHub token not found. Please set GITHUB_TOKEN or GH_TOKEN environment variable.');
    console.error('   You can create a token at: https://github.com/settings/tokens');
    process.exit(1);
}

/**
 * Make a GitHub API request
 */
function makeGitHubRequest(path, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.github.com',
            port: 443,
            path: path,
            method: method,
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'User-Agent': 'justice-dashboard-pr-manager',
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            }
        };

        const req = https.request(options, (res) => {
            let responseData = '';

            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(responseData);
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve(jsonData);
                    } else {
                        reject(new Error(`GitHub API error: ${res.statusCode} - ${jsonData.message}`));
                    }
                } catch (e) {
                    reject(new Error(`Failed to parse response: ${e.message}`));
                }
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        if (data) {
            req.write(JSON.stringify(data));
        }

        req.end();
    });
}

/**
 * Get all open pull requests
 */
async function getOpenPullRequests() {
    console.log('🔍 Fetching open pull requests...');
    try {
        const prs = await makeGitHubRequest(`/repos/${REPO_OWNER}/${REPO_NAME}/pulls?state=open&per_page=100`);
        return prs;
    } catch (error) {
        throw new Error(`Failed to fetch pull requests: ${error.message}`);
    }
}

/**
 * Close a pull request
 */
async function closePullRequest(prNumber, title) {
    console.log(`🔄 Closing PR #${prNumber}: ${title}`);
    
    if (isDryRun) {
        console.log(`   💡 DRY RUN: Would close PR #${prNumber}`);
        return;
    }

    try {
        await makeGitHubRequest(`/repos/${REPO_OWNER}/${REPO_NAME}/pulls/${prNumber}`, 'PATCH', {
            state: 'closed'
        });
        console.log(`   ✅ Successfully closed PR #${prNumber}`);
    } catch (error) {
        console.error(`   ❌ Failed to close PR #${prNumber}: ${error.message}`);
        throw error;
    }
}

/**
 * Get current branch to avoid closing the PR for the current working branch
 */
function getCurrentBranch() {
    try {
        const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
        return branch;
    } catch (error) {
        console.warn('⚠️  Could not determine current branch');
        return null;
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
        const allPrs = await getOpenPullRequests();
        console.log(`📊 Found ${allPrs.length} open pull request(s)`);

        // Filter PRs targeting main branch
        const mainBranchPrs = allPrs.filter(pr => pr.base.ref === TARGET_BRANCH);
        console.log(`🎯 Found ${mainBranchPrs.length} pull request(s) targeting '${TARGET_BRANCH}' branch`);

        if (mainBranchPrs.length === 0) {
            console.log('✅ No pull requests targeting main branch found to close');
            return;
        }

        // List PRs that will be affected
        console.log('\n📋 Pull requests targeting main branch:');
        for (const pr of mainBranchPrs) {
            const isCurrentBranch = currentBranch && pr.head.ref === currentBranch;
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

        for (const pr of mainBranchPrs) {
            // Skip if it's the current branch
            if (currentBranch && pr.head.ref === currentBranch) {
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

            try {
                await closePullRequest(pr.number, pr.title);
                closedCount++;
            } catch (error) {
                console.error(`❌ Failed to close PR #${pr.number}: ${error.message}`);
            }
        }

        // Summary
        console.log('\n📊 Summary:');
        console.log(`   ✅ ${closedCount} pull request(s) closed`);
        console.log(`   ⏭️  ${skippedCount} pull request(s) skipped`);
        
        if (isDryRun) {
            console.log('\n💡 This was a dry run. To actually close PRs, run without --dry-run flag');
        }

    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
}

// Show usage help
if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage: node scripts/close-main-prs.js [options]

Options:
  --dry-run              Show what would be closed without actually closing
  --exclude-pr=<number>  Exclude a specific PR number from being closed
  --help, -h             Show this help message

Environment Variables:
  GITHUB_TOKEN or GH_TOKEN  GitHub personal access token (required)

Examples:
  node scripts/close-main-prs.js --dry-run
  node scripts/close-main-prs.js --exclude-pr=12
  GITHUB_TOKEN=your_token node scripts/close-main-prs.js
`);
    process.exit(0);
}

// Run the script
main().catch(error => {
    console.error(`💥 Unexpected error: ${error.message}`);
    process.exit(1);
});