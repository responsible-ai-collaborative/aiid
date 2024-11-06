## Setting Up a Local Development Environment

Once you have cloned the repository, to set up a local development environment for the AIID project, follow these steps:

### 1. **Navigate to the Gatsby Site Directory and Install Dependencies**

   Open your terminal and navigate to the `site/gatsby-site` directory:

   ```bash
   cd site/gatsby-site
   ```

   Run the following command to install all necessary dependencies:

   ```bash
   npm install
   ```

### 2. **Configure Environment Variables**

   Create a `.env` file in the root of the `gatsby-site` directory. Add the following environment variables to the file, replacing the placeholders with your actual credentials:

   ```env
   REALM_API_APP_ID=  # Application ID for MongoDB Realm API
   REALM_API_GROUP_ID=  # Group ID for MongoDB Realm API
   REALM_API_PRIVATE_KEY=  # Private key for accessing the MongoDB Realm API
   REALM_API_PUBLIC_KEY=  # Public key for accessing the MongoDB Realm API
   REALM_GRAPHQL_API_KEY=  # API key for accessing the Realm GraphQL API
   REALM_APP_ID=  # App ID used to access MongoDB Realm services
   API_MONGODB_CONNECTION_STRING=mongodb://127.0.0.1:4110  # MongoDB connection string
   ROLLBAR_POST_SERVER_ITEM_ACCESS_TOKEN=  # Token for sending error reports to Rollbar from the server
   GATSBY_REALM_APP_ID=  # Application ID used in the Gatsby frontend for MongoDB Realm, same as REALM_APP_ID
   GATSBY_ALGOLIA_APP_ID=  # Application ID for Algolia search integration in the Gatsby app
   GATSBY_ALGOLIA_SEARCH_KEY=  # Public search key for Algolia, used in the Gatsby frontend
   ALGOLIA_ADMIN_KEY=  # Admin key for managing the Algolia index
   MONGODB_CONNECTION_STRING=mongodb://127.0.0.1:4110  # MongoDB connection string
   MONGODB_REPLICA_SET=  # Name of the MongoDB replica set for high availability
   MONGODB_TRANSLATIONS_CONNECTION_STRING=mongodb://127.0.0.1:4110  # MongoDB connection string for the translations database
   GOOGLE_MAPS_API_KEY=  # API key for accessing Google Maps services
   GATSBY_AVAILABLE_LANGUAGES=  # List of languages available for the Gatsby app (e.g., en, es, fr)
   GOOGLE_TRANSLATE_API_KEY=  # API key for accessing Google Translate services
   GATSBY_ROLLBAR_TOKEN=  # Token for Rollbar error tracking in the Gatsby frontend
   CLOUDFLARE_R2_ACCOUNT_ID=  # Account ID for Cloudflare R2 storage service
   CLOUDFLARE_R2_ACCESS_KEY_ID=  # Access key ID for Cloudflare R2 storage
   CLOUDFLARE_R2_SECRET_ACCESS_KEY=  # Secret access key for Cloudflare R2 storage
   CLOUDFLARE_R2_BUCKET_NAME=  # Name of the Cloudflare R2 bucket for storage
   GATSBY_CLOUDFLARE_R2_PUBLIC_BUCKET_URL=  # Public URL for accessing the Cloudflare R2 bucket from the Gatsby app
   MAILERSEND_API_KEY= # API key for MailerSend email service or dummy value if you don't plan to send emails
   NOTIFICATIONS_SENDER_NAME=AIID Notifications # Name of the sender for email notifications
   NOTIFICATIONS_SENDER=notifications@incidentdatabase.ai # Email address of the sender for email notifications
   SITE_URL=http://localhost:8000
   ```

   Ensure that each variable is set correctly to match your development environment's requirements.


### 3. **Start a Memory Mongo Instance**

   To start a memory MongoDB instance, run the following command:

   ```bash
   npm run start:memory-mongo
   ```

### 4. **Start Gatsby and Netlify Development Server**

   Finally, start the Gatsby development server along with Netlify dev using:

   ```bash
   npm run start
   ```

Follow these steps to get your local environment up and running for development with the AIID project. Make sure to replace the placeholder values in the `.env` file with your actual credentials to ensure proper functionality.


## AIID Frontend

### Overview

The AIID frontend is built using Gatsby, a static site generator that allows for fast, optimized websites. The frontend is designed to provide a user-friendly interface for browsing incidents, submitting new incidents, and viewing incident details.

### Tailwind CSS & Flowbite

This project uses [Tailwind CSS](https://tailwindcss.com/) framework with its class syntax. 
More specifically, we base our components on [Flowbite React](https://flowbite-react.com/) and [Flowbite](https://flowbite.com/) which is built on top of TailwindCSS.

### Steps for developing

In order to keep styling consistency on the site, we follow a set of steps when developing. This is also to make the development process more agile and simple.

1. Develop your component using [Flowbite React components](https://flowbite-react.com/)
2. If your components is not fully contemplated by Flowbite react, check [Flowbite components](https://flowbite.com/#components) and use the provided HTMLs.
3. If you need to improve styling, use only Tailwind CSS classes.

**Examples**
If you want to place a new [Flowbite React button](https://flowbite-react.com/buttons):

```javascript
import { Button } from 'flowbite-react';

const YourComponent = () => {
    return <Button color='success'>New button</Button>
}

```

If you want to customize a [Flowbite button](https://flowbite.com/docs/components/buttons/):

```javascript
const YourComponent = () => {
    return <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Default</button>
}
```

## AIID API 

### Overview

The AIID API is built to facilitate interactions with the AI Incident Database. It is implemented as a collection of serverless functions that are composed ("stitched") into a singular GraphQL endpoint.

The GraphQL API can be accessed and tested in two ways:

- Production endpoint: `https://incidentdatabase.ai/api/graphql`  
- Local development endpoint: `http://localhost:8000/api/graphql`

Both URLs support interactive exploration through Apollo Explorer, allowing you to visually build and test GraphQL queries and mutations.

### Performing Queries

Here is an example query you can run in the Apollo Explorer to retrieve incidents:

```graphql
query {
  incident {
    incident_id
    title
  }
}
```

The query should return a response similar to this:

```json
{
  "data": {
    "incident": {
      "incident_id": 1,
      "title": "Incident 1"
    }
  }
}
```

### Project Structure

#### Folders

The API is contained within the `server` directory. The following folders are present in the project:

- **fields/**: Contains the field definitions for the GraphQL root fields.
- **generated/**: Holds the generated GraphQL types derived from the schema using the GraphQL code generator CLI.
- **tests/**: Contains the test cases written using Jest.
- **types/**: Contains the base GraphQL types.

#### Important Files

- **`remote.ts`**: Handles the auto-generated MongoDB Atlas schema, ignoring fields that have migrated to the local GraphQL schema.  
- **`local.ts`**: Handles the local GraphQL schema, where migrated fields from the remote schema are added. These fields are ignored in `remote.ts`.  
- **`schema.ts`**: Combines the remote and local schemas into the final schema using **schema stitching** from GraphQL Tools.
- **`netlify/functions/graphql.ts`**: Sets up the **GraphQL server** and exposes it as a **Netlify function**, loading the schema from `schema.ts`.

### Running Code Generation

To run the GraphQL code generation CLI to generate TypeScript typings from the schema, allowing statically typed Apollo client mutations and queries, and statically typed server code:

```sh
npm run codegen
```

### Schema and API Stitching

> [!IMPORTANT]
The API previously relied on the MongoDB Atlas Realm GraphQL API to fetch data, [but now that it has been deprecated](https://www.mongodb.com/developer/products/atlas/deprecating-mongodb-atlas-graphql-hosting-services/), we have migrated to a new API that we implement in this codebase. During the migration from Realm to our API, we stitch two GraphQL schemas: the auto-generated one from Atlas and the one defined in this codebase. These schemas can be found in the `remote.ts` and `local.ts` files respectively. The migration process involves progressively transferring GraphQL fields and functionality from the remote schema to the local one. The final combined schema is found in `schema.ts`.

### Email notifications

#### Subscription types

- **All**: This subscription type is not defined yet.
    ```
    {
        "userId": "63320ce63ec803072c9f529c"
        "type": "all",
    }
    ```
- **Incident**: Users with this subscription type will be notified when the incident associated is updated. This subscription type needs an incident_id value associated.
    ```
    {
        "userId": "63320ce63ec803072c9f529c"
        "type": "incident",
        "incident_id": 10,
    }
    ```
- **New Incident**: Users with this subscription type will be notified when a new Incident is created. The notification will be sent after finish the next site build when the Incident page is actually created.
    ```
    {
        "userId": "63320ce63ec803072c9f529c"
        "type": "new-incidents",
    }
    ```
- **Entities**: Users can subscribe to a specific Entity. The user with this subscription type will be notified when a new Incident associated with an specific Entity is created or when an existing Incident is updated to be associated with that Entity.
    ```
    {
        "userId": "63320ce63ec803072c9f529c",
        "type": "entity"
        "entityId": "openai",
    }
    ```
- **Submission Promoted**: Users that submit a new Incident Report are automatically subscribed to its promotion. Once the submission has been approved by an editor, the user will receive an email informing that the submission is now an incident/issue/report.
    ```
    {
        "userId": "63320ce63ec803072c9f529c",
        "type": "submission-promoted"
    }
    ```

These subscription types are also documented in [subscriptions.js](site/gatsby-site/src/utils/subscriptions.js) file.

#### Sending Email Notifications

[MailerSend](https://www.mailersend.com/) is used to send email notifications.

Email notifications to New Incidents (subscription type **New Incident**), Incident updates (subscription type **Incident**) and Submission Promoted (subscription type **Submission Promoted**) are sent when the next build finishes. This is because we have to wait until the new Incident page is generated and accessible.
When a new Incident is created or updates, a pending notification item is saved into the `notifications` DB collection with `processed=false` field.
And finally, as part of the site build process, we processed all pending notifications (`processed=false`), send the emails to all recipients, and update the items with `processed=true` and `sentDate=[now]`.

#### Notifications collection definition

- **Incident Updated**
    ```
    {
        "type": "incident-updated",
        "incident_id": 374,
        "processed": false
    }
    ```
- **New Incident Report**
    ```
    {
        "type": "new-report-incident",
        "incident_id": 374,
        "report_number": 2172,
        "processed": false
    }
    ```
- **New Incident**
    ```
    {
        "type": "new-incidents",
        "incident_id": 374,
        "processed": false
    }
    ```
- **Entities**
    ```
    {
        "type": "entity",
        "incident_id": 374,
        "entity_id": "openai",
        "isUpdate": true,
        "processed": false
    }
    ```
- **Submission Promoted**
    ```
    {
        "type": "submission-promoted",
        "incident_id": 374,
        "processed": false
    }
    ```


## Testing

### E2E Testing

We use Playwright for end-to-end testing. You can either run the tests against the local development environment or against a local build of the site.

#### Local Development Environment

First make sure you you've followed the steps to set up the local development environment for the AIID project. 

Make sure you have a local mongo instance running:

```sh
npm run start:memory-mongo
```

Then, start the Gatsby and Netlify development server:

```sh
npm run start
```

Finally, run the Playwright tests:

```sh
npm run test:e2e
```

Running tests this way will allow you to make changes to the site and see the results of the tests in real time.

#### Local Build

First, start a memory MongoDB instance:

```sh
npm run start:memory-mongo
```

Then, build the Gatsby site:

```sh
npm run build
```

Then, start the Gatsby and Netlify development server:

```sh
npm run start
```

Finally, run the Playwright tests:

```sh
npm run test:e2e
```

Running tests this way will allow you to test the site as it would be deployed to production.

#### VS Code Extension

It is recommended to install the [Playwright extension](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright) for VS Code to enhance the testing experience. It allows you to run tests directly from the editor, view test results, and debug tests.

> [!NOTE]
> Make sure to have `/site/gatsby-site` as the root folder in vscode to run the tests.


### API

We use Jest for API testing. It does not have any dependencies on the local development environment, so you can run the tests at any time:

```sh
npm run test:api
```

#### VS Code Extension

It is recommended to install the [Jest extension](https://marketplace.visualstudio.com/items?itemName=Orta.vscode-jest) for VS Code to enhance the testing experience. It allows you to run tests directly from the editor, view test results, and debug tests.

> [!NOTE]
> Make sure to have `/site/gatsby-site` as the root folder in vscode to run the tests.

## Database Migrations
Migration files are stored in the `/site/gatsby-size/migrations` folder and their executions are logged in the `migrations` collection.

### Configuration
Please add a connection string with read/write permissions to the mongo database:
```
MONGODB_MIGRATIONS_CONNECTION_STRING=
```
### Execution
Migrations run automatically as part of Gatsby's `onPreBootstrap` event, but it is also possible to run them from the command line for debugging or testing purposes:

To run all pending migrations:
```
node migrator up
```
To run a specific migration:
```
node migrator up --name 2022.02.18T16.29.14.increment-report-number.js
```
### Adding a new migration
To add a new migration, execute the following command and define the `up` and `down` processes as pertinent.
```
node migrator create --name increment-report-number.js --folder migrations
```

Execution is taken care of by the [umzug](https://github.com/sequelize/umzug) package. Please refer to its documentation for more information.


