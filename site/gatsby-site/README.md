<p align="center">
  <a href="https://incidentdatabase.ai#gh-light-mode-only">
    <img src="./static/logos/Blue_AIID.svg" height="100">
  </a>
  <a href="https://incidentdatabase.ai#gh-dark-mode-only">
    <img src="./static/logos/White_AIID.svg" height="100">
  </a>
</p>

<h1 align="center">
 Artificial Intelligence Incident Database
</h1>

## Setting Up a Basic Development Environment

Once you have cloned the repository, to set up a local development environment for the AIID project, follow these steps:

1. **Navigate to the Gatsby Site Directory**

   Open your terminal and navigate to the `site/gatsby-site` directory:

   ```bash
   cd site/gatsby-site
   ```

2. **Install Dependencies**

   Run the following command to install all necessary dependencies:

   ```bash
   npm install
   ```

3. **Configure the Environment Variables**

   Create a `.env` file in the root of the `gatsby-site` directory. Add the following environment variables to the file, replacing the placeholders with your actual credentials:

   ```env
   # Mongo database

   # MongoDB connection string
   API_MONGODB_CONNECTION_STRING=mongodb://127.0.0.1:4110  
   # MongoDB connection string
   MONGODB_CONNECTION_STRING=mongodb://127.0.0.1:4110 
   # MONGODB_REPLICA_SET= # Name of the MongoDB replica set for high availability
   # MongoDB connection string for the translations database
   MONGODB_TRANSLATIONS_CONNECTION_STRING=mongodb://127.0.0.1:4110 
   MONGODB_MIGRATIONS_CONNECTION_STRING=mongodb://127.0.0.1:4110

   # Rollbar

   # Token for sending error reports to Rollbar from the server
   ROLLBAR_POST_SERVER_ITEM_ACCESS_TOKEN=dummy  
   # Token for Rollbar error tracking in the Gatsby frontend
   GATSBY_ROLLBAR_TOKEN=dummy  

   # Algolia

   # Application ID for Algolia search integration in the Gatsby app
   GATSBY_ALGOLIA_APP_ID=JD5JCVZEVS  
   # Public search key for Algolia, used in the Gatsby frontend
   GATSBY_ALGOLIA_SEARCH_KEY=c5e99d93261645721a1765fe4414389c  
   # Admin key for managing the Algolia index
   ALGOLIA_ADMIN_KEY=dummy

   # Translations

   # List of languages available for the Gatsby app (e.g., en, es, fr)
   GATSBY_AVAILABLE_LANGUAGES=en,es 
   # API key for accessing Google Translate services
   GOOGLE_TRANSLATE_API_KEY=dummy  

   # Cloudflare R2 storage

   # Account ID for Cloudflare R2 storage service
   CLOUDFLARE_R2_ACCOUNT_ID=  
   # Access key ID for Cloudflare R2 storage
   CLOUDFLARE_R2_ACCESS_KEY_ID=  
   # Secret access key for Cloudflare R2 storage
   CLOUDFLARE_R2_SECRET_ACCESS_KEY=  
   # Name of the Cloudflare R2 bucket for storage
   CLOUDFLARE_R2_BUCKET_NAME=  
   # Public URL for accessing the Cloudflare R2 bucket from the Gatsby app
   GATSBY_CLOUDFLARE_R2_PUBLIC_BUCKET_URL=

   # Email notifications

   # API key for MailerSend email service or dummy value if you don't plan to send emails
   MAILERSEND_API_KEY=dummy
   # Name of the sender for email notifications
   NOTIFICATIONS_SENDER_NAME=AIID Notifications
   # Email address of the sender for email notifications
   NOTIFICATIONS_SENDER=notifications@incidentdatabase.ai

   # Prismic

   # Access token for Prismic API
   PRISMIC_ACCESS_TOKEN=MC5aSjFfa0JFQUFDQUFiOURr.77-977-977-977-977-977-9NgI8PU7vv70rKu-_ve-_ve-_ve-_ve-_ve-_vUlN77-9Q2fvv71O77-977-9Y--_ve-_vQ 
   # Name of the Prismic repository
   GATSBY_PRISMIC_REPO_NAME=aiidstaging 

   # Auth

   NEXTAUTH_URL=http://localhost:8000
   NEXTAUTH_SECRET=678x1irXYWeiOqTwCv1awvkAUbO9eHa5xzQEYhxhMms=

   # Other

   # API key for accessing Google Maps services
   GOOGLE_MAPS_API_KEY=
   GATSBY_SITE_URL=http://localhost:8000
   SITE_URL=http://localhost:8000
   # List of page creator functions to skip during build
   SKIP_PAGE_CREATOR=createBackupsPage 
   ```

4. **Start a Memory MongoDB Instance**

   To start a memory MongoDB instance, run the following command:

   ```bash
   npm run start:memory-mongo
   ```

   This command will start a MongoDB instance in memory, which is useful for local development and testing. The instance will be available at `mongodb://localhost:4110`. This is an ephemeral instance that will be destroyed when the process is terminated. It is seeded with some initial data to facilitate development. The seed data is stored in the `playwright/seeds` directory.

5. **Start the Gatsby and Netlify Development Server**

   Finally, start the Gatsby development server along with Netlify dev using:

   ```bash
   npm run start
   ```

The project is now running locally and can be accessed at `http://localhost:8000`, and the API is available at `http://localhost:8000/api/graphql`.

6. **Implementing a New Feature**

Both the Gatsby frontend and the API are running in development mode, allowing you to make changes and see them reflected in real-time.

## Setting Up a Development Environment with Production Data

To set up a local development environment with production data, follow the steps from the previous section, but instead of using the memory MongoDB instance with seed data, you will need to import a recent backup of the production database into it or use an existing MongoDB instance with the production data.

1. Download a recent backup of the production database from the Cloudflare R2 bucket. The backup file should be named `aiid-backup-<timestamp>.tar.gz` and can be found at https://incidentdatabase.ai/research/snapshots/

2. Extract the backup file and import the data into your MongoDB instance. In this example, we'll use the memory MongoDB instance:

   ```bash
   mongorestore mongodb://127.0.0.1:4110/aiidprod ./aiidprod/ --noOptionsRestore --drop
   mongorestore mongodb://127.0.0.1:4110/translations ./translations/ --noOptionsRestore --drop
   ```

3. Start the Gatsby and Netlify Development Server:

   ```bash
   npm run start
   ```

The project is now running locally with production data and can be accessed at `http://localhost:8000`.

4. (Optional) Push to Your Own Algolia Index

If the feature you are developing requires changes to the Algolia index, you can push the changes to your own Algolia index by setting the `ALGOLIA_ADMIN_KEY` environment variable to your own Algolia admin key and running the following command:

```bash
# For development with free tier, set ALGOLIA_SUBSET=true in your .env file
npm run algolia-update
```

Note: For development purposes, you can use Algolia's free tier by setting `ALGOLIA_SUBSET=true` in your `.env` file. This will limit the number of records pushed to Algolia to stay within the free tier limits.

5. (Optional) Pushing to Your Own Cloudflare R2 Bucket, Prismic, and Other Services

Please refer to the [Deployment Guide](../docs/DEPLOYMENT.md) for more information on how to set up these services.

## Running Tests

### Playwright End to End Tests

To run Playwright end-to-end tests locally:

```sh
npm run test:e2e
```

It is recommended to use the Playwright extension for VS Code to enhance your testing experience.


### Jest API Tests

To run Jest API tests locally:

```sh
npm run test:api
```

It is recommended to install the Jest extension for VS Code to enhance your testing experience.


## Running Code Generation

To run the GraphQL code generation CLI to generate TypeScript typings from the schema, allowing statically typed Apollo client mutations and queries, and statically typed server code:

```sh
npm run codegen
```

Running this command is only necessary after making changes to the GraphQL schema or queries.

## Additional Configuration

### Using Magic Links for Local Authentication

During local development, you can use the magic links utility script to simulate the authentication flow without setting up email services. This is particularly useful for testing and debugging authentication features.

The script generates magic login links that would normally be sent via email.

Usage:

```bash
npm run magic-link <email> [callbackUrl] 
```

Examples:

```
# Generate a magic link that redirects to homepage after login
npm run magic-link user@example.com /

# Generate a magic link that redirects to incidents page
npm run magic-link user@example.com /apps/discover

# Generate a magic link for admin testing
npm run magic-link admin@example.com /admin/dashboard
```

### Faster Development Builds

When building the site, some steps can take a while to run. This can be inconvenient if you're working on a feature that isn't related to the slowest steps in the build process. To avoid this problem, you can set the environment variable `SKIP_PAGE_CREATOR` to a comma-separated list of page-creator functions found in [`gatsby-node`](https://github.com/responsible-ai-collaborative/aiid/blob/main/site/gatsby-site/gatsby-node.js) that should be skipped. These include: `createMdxPages`, `createCitationPages`, `createWordCountsPages`, `createBackupsPage`, `createTaxonomyPages`, `createDownloadIndexPage`, `createDuplicatePages`, `createTsneVisualizationPage`, and `createEntitiesPages`. For instance, to run a development build skipping the creation of the TSNE (spatial) visualization and citation pages, you would run:

Example:

```bash
SKIP_PAGE_CREATOR=createTsneVisualizationPage,createCitationPages npm run start
```

In general, skipping the TSNE visualization has the most significant reduction in build time. You can also reduce the time to build the TSNE visualization by setting the `TSNE_NITER` environment variable to a value lower than the default `1000`. A value of `100` produces visually acceptable results in about 1/10th the build time.


### Restoring Production database to Staging

There is a GitHub Workflow "Restore Prod DB into Staging" that can be triggered manually to dump and restore Production database into Staging database (both `aiidprod` and `translations` databases)
Go to [Actions](https://github.com/responsible-ai-collaborative/aiid/actions) > `Restore Prod DB into Staging` > `Run Workflow` dropdown > `Run Workflow`

To enable this workflow these [GitHub secrets](https://github.com/responsible-ai-collaborative/aiid/settings/secrets/actions) should be added:

```
DB_PRODUCTION_CONNECTION_STRING=[Production connection string with readonly user credentials. ie: mongodb+srv://[DB readonly user]:[DB user password]@aiiddev-xxxxxx.gcp.mongodb.net]
DB_STAGING_CONNECTION_STRING=[Staging connection string with admin user credentials. ie: mongodb+srv://[DB admin user]:[DB user password]@aiiddev-xxxxxx.gcp.mongodb.net]

NETLIFY_BUILD_STAGING_URL=[Netlify Staging build hook. This value is on https://app.netlify.com/sites/staging-aiid/settings/deploys#continuous-deployment]
```

### Using a Reduced Dataset for GitHub Runners

To work with a smaller subset of the database (useful for GitHub Actions free runners or local development), you can use the `restore-mongodb.ts` script to create a reduced dataset containing only specific incidents and their related reports.

The script allows you to specify which incidents to include, and it will automatically include all related incidents (similar and dissimilar) and their associated reports.

Usage:

```bash
npm run restore-mongodb -- --sourceUrl=SOURCE_MONGODB_URL --destinationUrl=DESTINATION_MONGODB_URL --databases=aiidprod,translations --incidentIds=ID1,ID2,ID3
```

For deploying on a free GitHub runner, you can use the following command that includes a specific set of incident IDs, classification namespaces, and report numbers:

```bash
npm run restore-mongodb -- --sourceUrl=<SOURCE_MONGODB_URL> --destinationUrl=<DESTINATION_MONGODB_URL> --incidentIds=23,1967,1551,835,1470,1118,1773,1509,1245,679,1606,1374,1065,1543,1505,1468,1539,1420,101,12,368,1427,392,595,1235,45,620,519 --classificationNamespaces=CSETv1 --reportNumbers=2302
```

The script will:
1. Find all the specified incidents
2. Include all related incidents (those marked as similar or dissimilar)
3. Include all reports associated with these incidents
4. Copy all the data to the destination database

You can also specify additional options:
- `--classificationNamespaces=NAMESPACE`: Include only specific classification namespaces
- `--reportNumbers=NUMBER`: Include specific report numbers

You can also run this in dry-run mode to see what would be copied without making changes with the `--dryRun` flag.

## Further Reading

For more information on the project structure, how to deploy the project, and other useful information, refer to the [Project Documentation](../docs/README.md), [Frontend Documentation](../docs/FRONTEND.md), and [API Documentation](../docs/API.md).

## Deployment

For a detailed guide on deploying the project, refer to the [Deployment Guide](../docs/DEPLOYMENT.md).
