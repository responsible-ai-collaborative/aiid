
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
   REALM_API_APP_ID=
   REALM_API_GROUP_ID=
   REALM_API_PRIVATE_KEY=
   REALM_API_PUBLIC_KEY=
   REALM_GRAPHQL_API_KEY=
   REALM_APP_ID=
   API_MONGODB_CONNECTION_STRING=mongodb://127.0.0.1:4110
   ROLLBAR_POST_SERVER_ITEM_ACCESS_TOKEN=
   GATSBY_REALM_APP_ID=
   GATSBY_ALGOLIA_APP_ID=
   GATSBY_ALGOLIA_SEARCH_KEY=
   ALGOLIA_ADMIN_KEY=
   MONGODB_CONNECTION_STRING=mongodb://127.0.0.1:4110
   MONGODB_REPLICA_SET=
   MONGODB_TRANSLATIONS_CONNECTION_STRING=mongodb://127.0.0.1:4110
   GOOGLE_MAPS_API_KEY=
   GATSBY_AVAILABLE_LANGUAGES=
   GOOGLE_TRANSLATE_API_KEY=
   GATSBY_ROLLBAR_TOKEN=
   CLOUDFLARE_R2_ACCOUNT_ID=
   CLOUDFLARE_R2_ACCESS_KEY_ID=
   CLOUDFLARE_R2_SECRET_ACCESS_KEY=
   CLOUDFLARE_R2_BUCKET_NAME=
   GATSBY_CLOUDFLARE_R2_PUBLIC_BUCKET_URL=
   ```

   Ensure that each variable is set correctly to match your development environment's requirements.

4. **Start a Memory Mongo Instance**

   To start a memory MongoDB instance, run the following command:

   ```bash
   npm run start:memory-mongo
   ```

5. **Install Netlify CLI**

   Ensure that you have the Netlify CLI installed globally on your machine. If not, install it using npm:

   ```bash
   npm install -g netlify-cli
   ```

6. **Start Gatsby and Netlify Development Server**

   Finally, start the Gatsby development server along with Netlify dev using:

   ```bash
   npm run start
   ```

Follow these steps to get your local environment up and running for development with the AIID project. Make sure to replace the placeholder values in the `.env` file with your actual credentials to ensure proper functionality.
