# Deployment

This guide is intended to assist in setting up continuous integration using GitHub Actions, including building, testing, and deploying. If you require a different method, please [open an issue](https://github.com/responsible-ai-collaborative/aiid/issues/new).


## Fork the repository

To get started, fork the repository to your GitHub account.

## Netlify

### 1. Add a New Site

- Go to your Netlify dashboard.
- Click on **Add New Site**.

### 2. Import Existing Project

- Choose **Import Existing Project**.

### 3. Connect to GitHub

- Select **Deploy with GitHub** to connect your GitHub account.

### 4. Select Repository

- Choose the repository where your project is located.

### 5. Configure the Deployment

- Under **Branch to Deploy**, select `main`. This setting is not critical at this point.
- Leave all other settings as default.
- Click on **Deploy Site**.

### 6. Site Configuration

#### Build and Deploy

- Navigate to **Site Configuration** > **Build & Deploy**.
- Under **Build Settings** > **Build Status**, locate **Stopped Builds**.
- Click **Save**.

#### Site Details

- Go to **Site Configuration** > **Site Details**.
- Copy the Netlify site ID. This should be added to the GitHub environment variables as `NETLIFY_SITE_ID`.

#### Personal token

- Go to **User Settings** > **Applications**.
- Click on **New access token**.
- Name it, then click **Generate token**.
- Copy the generated token. This should be added to the GitHub environment secrets as `NETLIFY_AUTH_TOKEN`.

## Prismic

This project uses Prismic to dynamically fetch page content.

1. Sign up for a new [Prismic](https://prismic.io/) account or log in if you already have one.
2. In the `Create a new repository` section, choose `Something else`.
3. Name your repository and select `gatsby` from the technology dropdown.
4. Choose your plan (the free plan is sufficient for a single user).
5. Click `Create Repository`.
6. Create a new token in Settings > API & Security > Content API tab. Change Repository security to `Private API – Require an access token for any request`, create a new app, and save the permanent access token for future use.

### Adding the Prismic content types

#### Prismic Custom Types

You can find a list of all custom types in the `custom_types` folder.

#### How to create a new Custom Type

1. From the Prismic left menu, click on `Custom Types`.
2. Click `Create new custom type`.
3. Name it using the name of the corresponding JSON file in the `custom_types` folder.
4. Click `JSON editor`.
5. Paste the JSON content from the predefined custom type into the editor.
6. Click `Save`.

#### Adding Prismic documents

1. On the Prismic dashboard left menu, click on `Documents`.
2. Click `Create new`.
3. Fill in all the mandatory fields.
4. Click `Save`.
5. Remember, the new content won't be available on your page until it is published.
6. To publish, click `Publish`.

#### Prismic & Netlify Hook integration

> [!WARNING]
> This is outdated: [GitHub Issue #3306](https://github.com/responsible-ai-collaborative/aiid/issues/3306)

To make your recently published Prismic content available on your page, a Netlify build must be triggered. To do this, create a Netlify Build Hook.

#### Prismic environment variables

Add the following environment variables to Netlify:
- `GATSBY_PRISMIC_REPO_NAME=[name_of_your_repository]` (from step 3 in the Prismic Setup section)
- `PRISMIC_ACCESS_TOKEN=[your_prismic_access_token]` (from step 6 in the Prismic Setup section)

#### Create Prismic/Netlify Hook

> [!WARNING]
> This is outdated: [GitHub Issue #3306](https://github.com/responsible-ai-collaborative/aiid/issues/3306)

1. Log in to your Netlify account.
2. Navigate to `Deploys`.
3. Go to `Deploy settings`.
4. Scroll to `Build Hooks`.
5. Click `Add build hook`.
6. Name it and assign a branch.
7. Click `Save`.
8. Copy the generated URL.
9. Go to your Prismic repository.
10. Navigate to `Settings` > `Webhooks`.
11. Create a new webhook and paste the URL into the URL field.
12. In `Triggers`, select `A document is published` and `A document is unpublished` options.
13. Click `Add this webhook`.


## Algolia

- Create a new App. To handle a site with a similar number of records as our current production site, you'll need to enable the "Pay as you Go" plan.
- Create a new index called `instant_search`.
- Now go to your Algolia App settings, click on API Keys, and extract the following variables:

```
GATSBY_ALGOLIA_APP_ID
GATSBY_ALGOLIA_SEARCH_KEY
ALGOLIA_ADMIN_KEY
```

Algolia index settings are uploaded at build time as part of the GitHub Actions workflow.

Alternatively, you can update the settings and push the records without rebuilding by running the following command from the `site/gatsby-site` directory.

```
npm run algolia:push
```

## MongoDB

Any MongoDB database provider will work. Below are the instructions for setting up MongoDB Atlas:

- Create a new MongoDB project.
- Create a new Atlas cluster.
- Create a new database user and set the password.
- Whitelist the `0.0.0.0` IP address.

You can choose to have one user access the entire database or have multiple users with stricter permissions for different databases. The environment variables for each of these databases are straightforward.

```
MONGODB_CONNECTION_STRING
MONGODB_MIGRATIONS_CONNECTION_STRING
MONGODB_REPLICA_SET
MONGODB_TRANSLATIONS_CONNECTION_STRING
API_MONGODB_CONNECTION_STRING
```


>You need to add the `0.0.0.0` IP to the MongoDB whitelist because it is currently not possible to obtain the IP of the Netlify server hosting the API functions. Ensure you whitelist the IP of your Netlify server or any other necessary IP addresses.

## Cloudinary

[Cloudinary](https://www.cloudinary.com) is used to host and manage report images.

> [!WARNING]
> Not supported: https://github.com/responsible-ai-collaborative/aiid/issues/3305


## Mailersend

[Mailersend](https://www.mailersend.com) is used to send emails.

Create a new account to obtain the API key. This should be added to the GitHub secrets as `MAILERSEND_API_KEY`.

Additionally, set the following environment variables:

```
NOTIFICATIONS_SENDER= # The email address from which the emails will be sent
NOTIFICATIONS_SENDER_NAME= # The name of the sender
```

## Google APIs

### Google Maps

There is a visualization of the location of incidents on the map. To enable this feature, you need to create a Google Maps API key.

```
GOOGLE_MAPS_API_KEY=XXXXXXXXXXXX
```

## Google Translate

The system uses Google Translate to translate the content of the site. To enable this feature, you need to create a Google Translate API key.

```
GOOGLE_TRANSLATE_API_KEY=XXXXXXXXXXXX
```

Read more about the translation process in the [Internationalization Guide](i18N.md).

## Rollbar

This project uses [Rollbar](https://rollbar.com) for error logging for the whole site, including background processes.

The access token value from your Rollbar account > Projects > Your project > Project Access Tokens > post_server_item

And set two environment variables:

```
GATSBY_ROLLBAR_TOKEN
ROLLBAR_POST_SERVER_ITEM_ACCESS_TOKEN
```

> [!WARNING]  
> The `GATSBY_ROLLBAR_TOKEN` is used in the client-side code, while the `ROLLBAR_POST_SERVER_ITEM_ACCESS_TOKEN` is used in the server-side code. We recommend using different tokens for each.


## GitHub

### Deployment Workflows on GitHub Actions

There are three primary workflows for deployment: Deploy Previews, Staging, and Production. These workflows aim to continuously test and integrate changes in pull requests across various environments.

#### 1) Deploy Previews Workflow

- **File:** [/.github/workflows/preview.yml](/.github/workflows/preview.yml)
- **Trigger:** This workflow is activated for pushes to pull requests targeting the `staging` branch.
- **Process:** Executes integration tests and deploys the application to Netlify.
- **Post-Deployment:** Upon successful deployment, the workflow automatically posts a comment on the pull request. This comment includes a link to the Netlify preview of the changes and a link to the deployment logs.
- **Environment:** This workflow utilizes the `staging` GitHub environment.

#### 2) Staging Workflow

- **File:** [/.github/workflows/preview.yml](/.github/workflows/staging.yml)
- **Trigger:** This workflow runs only on pushes to the `staging` branch.
- **Process:** Executes integration tests and deploys to Netlify.
- **Deployment Criteria:** If the tests fail, deployment will not occur.
- **Environment:** This workflow utilizes the `staging` GitHub environment.

#### 3) Production Workflow

- **File:** [/.github/workflows/preview.yml](/.github/workflows/production.yml)
- **Trigger:** This workflow runs only on pushes to the `main` branch.
- **Process:** Executes integration tests and deploys to Netlify.
- **Deployment Criteria:** If the tests fail, deployment will not occur.
- **Environment:** This workflow utilizes the `production` GitHub environment.


All three workflows share a common set of environment variables, which need to be defined for each environment. (Currently, we have only two environments: `staging` and `production`.) These variables are categorized into secrets and standard variables and are accessed via GitHub Actions as needed.

Variables

```
CLOUDFLARE_R2_ACCOUNT_ID
CLOUDFLARE_R2_BUCKET_NAME
CYPRESS_PROJECT_ID
GATSBY_ALGOLIA_APP_ID
GATSBY_ALGOLIA_SEARCH_KEY
GATSBY_AVAILABLE_LANGUAGES
GATSBY_CLOUDFLARE_R2_PUBLIC_BUCKET_URL
GATSBY_PRISMIC_REPO_NAME
NETLIFY_SITE_ID
NOTIFICATIONS_SENDER
NOTIFICATIONS_SENDER_NAME
SITE_URL
TRANSLATE_DRY_RUN
TRANSLATE_SUBMISSION_DATE_START
```

Secrets:

```
ALGOLIA_ADMIN_KEY
API_MONGODB_CONNECTION_STRING
CLOUDFLARE_R2_ACCESS_KEY_ID
CLOUDFLARE_R2_ACCOUNT_ID
CLOUDFLARE_R2_BUCKET_NAME
CLOUDFLARE_R2_SECRET_ACCESS_KEY
CLOUDFLARE_R2_WRITE_ACCESS_KEY_ID
CLOUDFLARE_R2_WRITE_SECRET_ACCESS_KEY
CYPRESS_RECORD_KEY
GATSBY_ROLLBAR_TOKEN
GOOGLE_MAPS_API_KEY
GOOGLE_TRANSLATE_API_KEY
MAILERSEND_API_KEY
MONGODB_CONNECTION_STRING
MONGODB_MIGRATIONS_CONNECTION_STRING
MONGODB_REPLICA_SET
MONGODB_TRANSLATIONS_CONNECTION_STRING
NETLIFY_AUTH_TOKEN
PRISMIC_ACCESS_TOKEN
ROLLBAR_POST_SERVER_ITEM_ACCESS_TOKEN
```

GitHub should detect the workflows in the `.github/workflows` directory. Once you have set up the environment variables and secrets, you can push your changes to the repository. The workflows should then be triggered, and the site will be deployed to Netlify.
