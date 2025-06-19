# Prismic setup

This project uses Prismic to fetch page content. You can still run the project without setting a Prismic account.

1. Sign up for a new [Prismic](https://prismic.io/) account or log in to your account if you already have one
2. In `Create a new repository` section choose `Something else`
3. Give your repository a name and choose `gatsby` in the technology dropdown
4. Choose your plan (if you only need one user, the free plan is enough)
5. Click `Create repository`
6. Create a new token in Settings > API & Security > Content API tab > Change Repository security to `Private API – Require an access token for any request` > Create new app > Permanent access tokens > Save value for later

### Adding the Prismic content types

#### Prismic Custom Types
You can find the list of all custom types in the folder `custom_types`

#### How to create a new Custom Type
1. From the prismic left menu click `Custom Types`
2. Click `Create new custom type`
3. Give it a name (name of the json in custom_types folder)
4. Click `JSON editor`
5. Paste the JSON content from the predefined custom types inside the json
6. Click `Save`

#### Adding Prismic documents

1. On the Prismic dashboard left menu click `Documents`
2. Click `Create new`
3. Fill in all the mandatory fields
4. Click `Save`
5. Keep in mind that the new content won't be available on your page until you Publish it.
6. In order to publish it, click `Publish`

#### Prismic & Netlify Hook integration

In order for your recently published Prismic content to be available on your page, a Netlify build needs to be triggered.
In order to do this, you need to create a Netlify Build Hook.

#### Prismic environment variables

Add the following environment variable on Netlify: 
`GATSBY_PRISMIC_REPO_NAME=[name_of_your_repository]` (step 3 from Prismic Setup section)
`PRISMIC_ACCESS_TOKEN=[you_prismic_access_token]` (step 6 from Prismic Setup section)

# Prismic github action webhook

## Environment Variables

The following environment variables are required for the proper functioning of the Prismic Deploy workflow:

| Variable         | Description                                   | Example                           |
|-------------------|-----------------------------------------------|-----------------------------------|
| `GITHUB_OWNER`   | The GitHub username or organization name.     | `responsible-ai-collaborative`                       |
| `GITHUB_REPO`    | The name of the GitHub repository.            | `aiid`                           |
| `GITHUB_TOKEN`   | A GitHub Personal Access Token (PAT) with `workflow` and `repo` scopes. | `ghp_XXXXXXXXXXXXXXXXXXXXXX`     |
| `PRISMIC_SECRET` | The secret shared with Prismic for webhook authentication. | `prismic_webhook_secret_123`     |

---

## Setting Up Environment Variables

### **1. `GITHUB_OWNER`**
This is your GitHub username or the name of your organization.

- **Example**: If your repository is `https://github.com/responsible-ai-collaborative/aiid`, your `GITHUB_OWNER` is `responsible-ai-collaborative`.

---

### **2. `GITHUB_REPO`**
This is the name of your GitHub repository.

- **Example**: If your repository is `https://github.com/responsible-ai-collaborative/aiid`, your `GITHUB_REPO` is `aiid`.

---

### **3. `GITHUB_TOKEN`**
This is a GitHub Personal Access Token (PAT) used to trigger GitHub Actions via the API.

#### Steps to Create a GitHub Personal Access Token:
1. Go to [GitHub Personal Access Tokens](https://github.com/settings/tokens).
2. Click **Generate new token** (or **Generate new token (classic)** if you're using the classic token system).
3. Set the following scopes:
   - `workflow` (to trigger GitHub workflows).
   - `repo` (for private repositories, if applicable).
4. Click **Generate token** and copy the token. You **won’t be able to see it again**, so save it securely.

- **Example**: `ghp_XXXXXXXXXXXXXXXXXXXXXX`

#### Where to Set `GITHUB_TOKEN`:
- Add it as an environment variable in your deployment system (e.g., Netlify, AWS Lambda, Vercel, etc.).

---

### **4. `PRISMIC_SECRET`**
This is a secret used to authenticate the webhook requests sent from Prismic to your middleware.

#### Steps to Set Up `PRISMIC_SECRET`:
1. Generate a secure random secret using a tool or command

Add this value to:

- The Prismic Webhook Secret field in the Prismic dashboard:
  - Go to Settings > Webhooks in your Prismic repository.
  - Create a new Webhook
  - In `URL` add `https://[your-netlify-url]/.netlify/functions/prismicWebhook`
  - Add the secret under Secret.
  - Add a Custom Header with key `environment` and values `staging` or `production`. `staging` will re-deploy your staging environment and `production` your production environment.
- The environment variables in your middleware hosting service (e.g., Netlify).
- Example: prismic_webhook_secret_123

### Example: Adding Variables in Netlify
1. Go to your Netlify Dashboard > Site Settings > Environment Variables.
2. Add the following variables with their respective values:
  - GITHUB_OWNER
  - GITHUB_REPO
  - GITHUB_TOKEN
  - PRISMIC_SECRET
3. Save the changes.