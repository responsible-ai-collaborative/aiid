const axios = require("axios");

exports.handler = async (event: any) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const PRISMIC_SECRET = process.env.PRISMIC_SECRET;
    if (!PRISMIC_SECRET || PRISMIC_SECRET === '') {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Server misconfiguration: PRISMIC_SECRET is not set." }),
      };
    }
    // Parse Prismic webhook payload
    const body = JSON.parse(event.body);
    const headers = event.headers;

    // Check if the secret from Prismic matches
    if (!body.secret || body.secret !== PRISMIC_SECRET) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Unauthorized: Invalid secret" }),
      };
    }

    // Define GitHub repository details
    const GITHUB_OWNER = process.env.GITHUB_OWNER;
    const GITHUB_REPO = process.env.GITHUB_REPO;
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const environments = [{ name: "staging", branch: "staging" }, { name: "production", branch: "main" }];

    // Parse the 'environment' field from the webhook payload
    const environment = headers.environment;

    // Validate the 'environment' field
    const validEnvironments = environments.map(env => env.name);
    if (!validEnvironments.includes(environment)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid environment specified" }),
      };
    }

    // Find the corresponding environment configuration, defaults to staging if no environment is specified
    const targetEnvironment = environments.find(env => env.name === environment) || environments[0];

    console.log(`Triggering GitHub Action for ${environment} environment...`);

    // Trigger GitHub repository_dispatch for the specified environment
    await axios.post(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/actions/workflows/${targetEnvironment.name}.yml/dispatches`,
      {
        inputs: {
          "skip-cache": true,
        },
        ref: targetEnvironment.branch,
      },
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.everest-preview+json",
        },
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ success: "GitHub Action triggered successfully!" }),
    };
  } catch (error: any) {
    console.error("Error triggering GitHub Action:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to trigger GitHub Action." }),
    };
  }
};
