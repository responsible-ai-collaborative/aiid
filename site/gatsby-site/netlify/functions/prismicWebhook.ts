const axios = require("axios");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const PRISMIC_SECRET = process.env.PRISMIC_SECRET;
    // Parse Prismic webhook payload
    const body = JSON.parse(event.body);

    // Check if the secret from Prismic matches
    if (body.secret !== PRISMIC_SECRET) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Unauthorized: Invalid secret" }),
      };
    }

    // Define GitHub repository details
    const GITHUB_OWNER = process.env.GITHUB_OWNER;
    const GITHUB_REPO = process.env.GITHUB_REPO;
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const branches = ["main", "staging"];

    console.log("Triggering GitHub Action...");

    // Trigger GitHub repository_dispatch for each branch
    for (const branch of branches) {
      await axios.post(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/actions/workflows/prismic-deploy.yml/dispatches`,
        {
          inputs: {
            "netlify-alias": `prismic-${branch}-deploy`,
            environment: branch,
            "skip-cache": true,
          },
          ref: branch,
        },
        {
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github.everest-preview+json",
          },
        }
      );
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: "GitHub Action triggered successfully!" }),
    };
  } catch (error) {
    console.error("Error triggering GitHub Action:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to trigger GitHub Action." }),
    };
  }
};
