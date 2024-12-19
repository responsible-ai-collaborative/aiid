## Setting Up a Local Development Environment

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

3. **Configure Environment Variables**

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
   MAILERSEND_API_KEY= # API key for MailerSend email service
   NOTIFICATIONS_SENDER_NAME= # Name of the sender for email notifications
   NOTIFICATIONS_SENDER= # Email address of the sender for email notifications
   SITE_URL=http://localhost:8000
   ```

   Ensure that each variable is set correctly to match your development environment's requirements.

4. **Start a Memory Mongo Instance**

   To start a memory MongoDB instance, run the following command:

   ```bash
   npm run start:memory-mongo
   ```

5. **Start Gatsby and Netlify Development Server**

   Finally, start the Gatsby development server along with Netlify dev using:

   ```bash
   npm run start
   ```

Follow these steps to get your local environment up and running for development with the AIID project. Make sure to replace the placeholder values in the `.env` file with your actual credentials to ensure proper functionality.

## AIID API 

### Overview

The AIID API is built to facilitate interactions with the AI Incident Database. It is implemented as a collection of serverless functions that are composed ("stitched") into a singular GraphQL endpoint.

1. **Access the Apollo Explorer**

   Navigate to `http://localhost:8000/graphql` in your web browser. The Apollo Explorer instance should be displayed, allowing you to introspect and run queries against the API.

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

### Expected Response

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
- 
### Running Tests

To run Jest tests locally:

```sh
npm run test:api
```

It is recommended to install the Jest extension for VS Code to enhance the testing experience.

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