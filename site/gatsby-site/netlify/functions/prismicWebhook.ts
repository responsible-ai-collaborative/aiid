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
    const environments = [{ name: "production", branch: "main" }, { name: "staging", branch: "staging" }];

    console.log("Triggering GitHub Action...");

    // Trigger GitHub repository_dispatch for each environnment
    for (const environment of environments) {
      await axios.post(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/actions/workflows/${environment.name}.yml/dispatches`,
        {
          inputs: {
            "netlify-alias": `prismic-${environment.name}-deploy`,
            environment: environment.name,
            "skip-cache": true,
          },
          ref: environment.branch,
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
