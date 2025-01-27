# Prismic github action webhook

## Environment Variables

The following environment variables are required for the proper functioning of the Prismic Deploy workflow:

| Variable         | Description                                   | Example                           |
|-------------------|-----------------------------------------------|-----------------------------------|
| `GITHUB_OWNER`   | The GitHub username or organization name.     | `clari182`                       |
| `GITHUB_REPO`    | The name of the GitHub repository.            | `aiid`                           |
| `GITHUB_TOKEN`   | A GitHub Personal Access Token (PAT) with `workflow` and `repo` scopes. | `ghp_XXXXXXXXXXXXXXXXXXXXXX`     |
| `PRISMIC_SECRET` | The secret shared with Prismic for webhook authentication. | `prismic_webhook_secret_123`     |

---

## Setting Up Environment Variables

### **1. `GITHUB_OWNER`**
This is your GitHub username or the name of your organization.

- **Example**: If your repository is `https://github.com/clari182/aiid`, your `GITHUB_OWNER` is `clari182`.

---

### **2. `GITHUB_REPO`**
This is the name of your GitHub repository.

- **Example**: If your repository is `https://github.com/clari182/aiid`, your `GITHUB_REPO` is `aiid`.

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
  - Add the secret under Secret.
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