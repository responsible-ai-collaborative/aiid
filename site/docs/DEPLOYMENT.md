# Deployment

## Netlify Setup

This guide walks you through the steps to set up a Netlify site for your project by importing an existing project from GitHub.

#### Prerequisites

- Ensure you have a GitHub account and your project is already pushed to a repository.
- Make sure you have a Netlify account. If not, sign up at [Netlify](https://www.netlify.com/).

#### Steps to Set Up

##### 1. Add New Site

- Go to your Netlify dashboard.
- Click on **Add New Site**.

##### 2. Import Existing Project

- Choose **Import Existing Project**.

##### 3. Deploy with GitHub

- Select **Deploy with GitHub** to connect your GitHub account.

##### 4. Select Repository

- Choose the repository where your project is located.

##### 5. Configure Deployment

- Under **Branch to Deploy**, select `main`. This setting doesn't matter for now.
- Leave all other settings as default.
- Click on **Deploy Site**.

##### 6. Site Configuration

###### Build and Deploy

- Navigate to **Site Configuration** > **Build & Deploy**.
- Under **Build Settings** > **Build Status**, find **Stopped Builds**.
- Click **Save**.

###### Site Details

- Go to **Site Configuration** > **Site Details**.
- Copy the `NETLIFY_SITE_ID`. This will be useful when setting up the GitHub environment.

## Prismic setup

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

#### Create Prismic/Netlify Hook

1. Login to your Netlify
2. Go to `Deploys`
3. Go to `Deploy settings`
4. Scroll to `Build Hooks`
5. Click `Add build hook`
6. Give it a name and assign a branch
7. Click save
8. Copy the generated URL
9. Go to your Prismic repository
10. Go to `Settings` > `Webhooks`
11. Create a new webhook and paste the URL in the URL field
12. In `Triggers` select `A document is published` and `A document is unpublished`
13. Click `Add this webhook`

### Deployment Workflows on GitHub Actions

We have integrated our testing and deployment processes with GitHub Actions. There are three primary workflows for deployment: Deploy Previews, Staging, and Production. The goal of these workflows is to continuously test and integrate changes in pull requests across environments.

#### 1) Deploy Previews Workflow

- **File:** [/.github/workflows/preview.yml](/.github/workflows/preview.yml)
- **Trigger:** This workflow is activated for pushes to pull requests that target the `staging` branch.
- **Process:** Executes both the integration tests and deploys the application to Netlify.
- **Post-Deployment:** Upon a successful deployment, the workflow automatically posts a comment on the pull request. This comment includes a link to the Netlify preview of the changes and a link to the Netlify deploy log.
- **Environment:** This workflow uses the `staging` GitHub environment.

#### 2) Staging Workflow

- **File:** [/.github/workflows/preview.yml](/.github/workflows/staging.yml)
- **Trigger:** Runs only on pushes to the `staging` branch.
- **Process:** Executes both the integration tests and deploys to Netlify.
- **Deployment Criteria:** If the tests fail, no deployment will be carried out.
- **Environment:** This workflow uses the `staging` GitHub environment.

#### 3) Production Workflow

- **File:** [/.github/workflows/preview.yml](/.github/workflows/production.yml)
- **Trigger:** Runs only on pushes to the `main` branch.
- **Process:** Executes both the integration tests and deploys to Netlify.
- **Deployment Criteria:** If the tests fail, no deployment will be carried out.
- **Environment:** This workflow uses the `production` GitHub environment.

#### GitHub Environment Configuration

All three workflows share a common set of environment variables, which need to be defined for each environment. (Currently, we have only two environments: `staging` and `production`.) These variables are categorized into secrets and standard variables, and are accessed via GitHub actions as such.

##### Secrets

- `ALGOLIA_ADMIN_KEY`
- `CLOUDFLARE_R2_ACCESS_KEY_ID`
- `CLOUDFLARE_R2_ACCOUNT_ID`
- `CLOUDFLARE_R2_BUCKET_NAME`
- `CLOUDFLARE_R2_SECRET_ACCESS_KEY`
- `CYPRESS_RECORD_KEY`
- `E2E_ADMIN_PASSWORD`
- `E2E_ADMIN_USERNAME`
- `GOOGLE_TRANSLATE_API_KEY`
- `MONGODB_CONNECTION_STRING`
- `MONGODB_MIGRATIONS_CONNECTION_STRING`
- `MONGODB_REPLICA_SET`
- `MONGODB_TRANSLATIONS_CONNECTION_STRING`
- `NETLIFY_AUTH_TOKEN`
- `PRISMIC_ACCESS_TOKEN`
- `REALM_API_PRIVATE_KEY`
- `REALM_GRAPHQL_API_KEY`
- `REALM_API_PUBLIC_KEY`
- `GATSBY_ROLLBAR_TOKEN`

##### Variables

- `CYPRESS_PROJECT_ID`
- `GATSBY_ALGOLIA_APP_ID`
- `GATSBY_ALGOLIA_SEARCH_KEY`
- `GATSBY_AVAILABLE_LANGUAGES`
- `GATSBY_CLOUDFLARE_R2_PUBLIC_BUCKET_URL`
- `GATSBY_PRISMIC_REPO_NAME`
- `GATSBY_REALM_APP_ID`
- `NETLIFY_SITE_ID`
- `REALM_API_APP_ID`
- `REALM_API_GROUP_ID`

## Algolia environment setup

Suppose the feature you are developing involves mutating the Algolia index (used in the Discover app). In that case, you'll have to create your own by signing up for Algolia here: https://www.algolia.com and following these steps:

- Create a new App (free tier will be enough)
- Create a new index called `instant_search`
- Go to https://incidentdatabase.ai/downloadIndex and save the `new_index.json` file
- Upload this file to your newly created index, by selecting `Use File` Algolia's UI
- Now go to your Algolia App settings, and click API Keys, using the values from there to update your `.env` file accordingly.

```
GATSBY_ALGOLIA_APP_ID=<YOUR APP ID>
GATSBY_ALGOLIA_SEARCH_KEY=<YOUR SEARCH KEY>
ALGOLIA_ADMIN_KEY=<YOUR ADMIN KEY>
```

Algolia index settings are uploaded on build time, so they will take effect after running:

```
gatsby build
```

Alternatively, you can update the settings without rebuilding if from `site/gatsby-site` you run:

```
node src/scripts/algolia-update.js
```

Restart Gatsby, and you should have a complete working environment!


## MongoDB setup

- Create a new MongoDB project (the free tier will be enough)
- Create a new Atlas cluster with the name: `AIIDDev`
    - Choose "Username and Password" as authentication method.
    - Choose "My Local Environment" as network access and add your current IP address.
    - If your IP is dynamic, add `0.0.0.0` to the list of IP addresses.

#### Replicating the Database
Download the latest database backup from https://incidentdatabase.ai/research/snapshots.

Extract the archive, then from the `mongodump` directory, run `mongorestore` (included in [MongoDB tools](https://www.mongodb.com/docs/database-tools/installation/installation)) to upload the database backup:

```
mongorestore mongodb+srv://<USER>:<PASSWORD>@aiiddev.<CLUSTER>.mongodb.net/aiidprod aiidprod
mongorestore mongodb+srv://<USER>:<PASSWORD>@aiiddev.<CLUSTER>.mongodb.net/translations translations
```

You can find the value for `<CLUSTER>` by going to your Atlas cluster's overview on cloud.mongodb.com, then selecting the "primary" shard labeled `aiiddev-shard-00-<XX>.<CLUSTER>.mongodb.net`.


## Cloudinary

[Cloudinary](https://www.cloudinary.com) is what we use to host and manage report images.
