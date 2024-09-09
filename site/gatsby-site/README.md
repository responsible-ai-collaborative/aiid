
### Setting Up a Local Development Environment

To set up a local development environment for the AIID project, follow these steps:

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
