#!/usr/bin/env tsx

import { Octokit } from '@octokit/rest';
import * as fs from 'fs';

async function commentOnPR(): Promise<void> {
  // Get arguments - only need deployOutput now
  const [, , deployOutput] = process.argv;
  
  if (!deployOutput) {
    console.error('Usage: tsx comment-on-pr.ts <deploy-output>');
    return;
  }

  // Get token from environment
  const githubToken = process.env.GITHUB_TOKEN;
  if (!githubToken) {
    console.error('GITHUB_TOKEN environment variable is required');
    return;
  }

  // Get event path from environment
  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (!eventPath) {
    console.error('GITHUB_EVENT_PATH environment variable is required');
    return;
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
      return;
    }
    
    deployLogs = 'Log parsing failed. Check workflow run for details.';
  }
  
  if (!deployUrl) {
    console.error('No deploy URL found');
    return;
  }
  
  // Create comment message
  const comment = `🚀 Deployed to Netlify!\n\n✅ Build Log: \n${deployLogs}\n\n🔗 Preview URL: ${deployUrl}`;
  
  // Initialize Octokit
  const octokit = new Octokit({ auth: githubToken });
  
  // Get repository info from GitHub environment variables
  const repoOwner = process.env.GITHUB_REPOSITORY?.split('/')[0];
  const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1];
  
  if (!repoOwner || !repoName) {
    console.error('Could not determine repository owner and name from GITHUB_REPOSITORY env var');
    return;
  }
  
  // Read PR info from event file
  if (!fs.existsSync(eventPath)) {
    console.error(`Event file not found at: ${eventPath}`);
    return;
  }
    try {
    const eventContent = fs.readFileSync(eventPath, 'utf8');
    const event = JSON.parse(eventContent);
    
    if (event.pull_request) {
      const prNumber = event.pull_request.number;
      console.log(`Found PR #${prNumber}, creating comment`);
      
      await octokit.issues.createComment({
        owner: repoOwner,
        repo: repoName,
        issue_number: prNumber,
        body: comment
      });
      
      console.log(`Successfully commented on PR #${prNumber}`);
    } else {
      console.log('No pull_request found in event file');
    }
  } catch (error) {
    console.error('Error working with event file:', error);
  }
}

// Only run the function if this script is executed directly
if (require.main === module) {
  commentOnPR();
}