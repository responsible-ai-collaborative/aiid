#!/usr/bin/env tsx

import { Octokit } from '@octokit/rest';
import { execSync } from 'child_process';

async function commentOnPR(): Promise<void> {
  try {
    // Get arguments
    const [, , githubToken, deployOutput, commitSha] = process.argv;
    
    if (!githubToken || !deployOutput) {
      console.error('Usage: tsx comment-on-pr.ts <github-token> <deploy-output> [commit-sha]');
      process.exit(1);
    }

    // Parse deploy output
    let deployUrl: string | undefined;
    let deployLogs: string;
    
    try {
      const deployData = JSON.parse(deployOutput);
      deployUrl = deployData.deploy_url;
      deployLogs = deployData.logs || 'Log not available';
    } catch (parseError) {
      console.error('Error parsing Netlify deploy output as JSON:', parseError);
      
      // Try to extract URL with regex as a fallback
      const urlMatch = deployOutput.match(/https:\/\/[a-zA-Z0-9-]+--[a-zA-Z0-9-]+\.netlify\.app/);
      if (urlMatch) {
        deployUrl = urlMatch[0];
      } else {
        console.error('Could not extract deploy URL from output');
        process.exit(1);
      }
      
      deployLogs = 'Log parsing failed. Check workflow run for details.';
    }
    
    if (!deployUrl) {
      console.error('No deploy URL found');
      process.exit(1);
    }
    
    // Create comment message
    const comment = `🚀 Deployed to Netlify!\n\n✅ Build Log: \n${deployLogs}\n\n🔗 Preview URL: ${deployUrl}`;
    
    // Initialize Octokit
    const octokit = new Octokit({ auth: githubToken });
    
    // Get repository information from git
    const repoUrlMatch = execSync('git config --get remote.origin.url')
      .toString()
      .trim()
      .match(/github\.com[:/]([^/]+)\/([^/.]+)/);
      
    if (!repoUrlMatch) {
      console.error('Could not extract repository information from git config');
      process.exit(1);
    }
    
    const repoOwner = repoUrlMatch[1];
    const repoName = repoUrlMatch[2];
    
    // Use provided commit SHA or get current commit
    const sha = commitSha || execSync('git rev-parse HEAD').toString().trim();
    
    console.log(`Repository: ${repoOwner}/${repoName}`);
    console.log(`Commit SHA: ${sha}`);
    
    // Function to create a comment on a PR
    const createComment = async (prNumber: number): Promise<boolean> => {
      try {
        await octokit.issues.createComment({
          owner: repoOwner,
          repo: repoName,
          issue_number: prNumber,
          body: comment
        });
        console.log(`Successfully commented on PR #${prNumber}`);
        return true;
      } catch (commentError) {
        console.error(`Error commenting on PR #${prNumber}:`, commentError);
        return false;
      }
    };
    
    // Check if this is running in a GitHub Actions context with PR information
    const eventPath = process.env.GITHUB_EVENT_PATH;
    if (eventPath) {
      try {
        const event = require(eventPath);
        if (event.pull_request) {
          const prNumber = event.pull_request.number;
          console.log(`Found PR number from event context: ${prNumber}`);
          await createComment(prNumber);
          return;
        }
      } catch (error) {
        console.error('Error reading GitHub event file:', error);
      }
    }
    
    // Otherwise look for PRs associated with the commit
    console.log('Looking for PRs associated with commit:', sha);
    const { data: pullRequests } = await octokit.repos.listPullRequestsAssociatedWithCommit({
      owner: repoOwner,
      repo: repoName,
      commit_sha: sha
    });
    
    console.log(`Found ${pullRequests.length} PRs associated with this commit`);
    
    // Try to comment on the first open PR
    for (const pr of pullRequests) {
      if (pr.state === 'open') {
        console.log(`Attempting to comment on PR #${pr.number}`);
        if (await createComment(pr.number)) {
          return;
        }
      }
    }
    
    console.log('No open PRs found to comment on');
  } catch (error) {
    console.error('Error in PR comment script:', error);
    process.exit(1);
  }
}

commentOnPR(); 