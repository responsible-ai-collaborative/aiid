# AIID API Documentation

## Overview

The AIID API is built to facilitate interactions with the AI Incident Database. 


# Getting Started with the stand-alone AIID API

## Prerequisites

- Ensure you are using Node.js version >= 20.

## Setup

1. **Set Environment Variables**

   Create a `.env` file in the root of your project directory and add the following environment variables:

   ```env
   REALM_API_APP_ID=
   REALM_API_GROUP_ID=
   REALM_API_PRIVATE_KEY=
   REALM_API_PUBLIC_KEY=
   REALM_GRAPHQL_API_KEY=
   REALM_APP_ID=
   API_MONGODB_CONNECTION_STRING=mongodb://127.0.0.1:4110/
   ROLLBAR_POST_SERVER_ITEM_ACCESS_TOKEN=
   ```

2. **Start an In-Memory MongoDB Instance**

   To start an in-memory MongoDB server, which is useful for development to avoid setting up a MongoDB database:

   ```sh
   npm run start:memory-mongo
   ```

   This starts a seeded database with example `incidents`, `reports`, etc.

3. **Start the API Server**

   To start a standalone API server that runs by default at `localhost:4000`:

   ```sh
   npm run start:api
   ```

4. **Access the Apollo Explorer**

   Navigate to `http://localhost:4000` in your web browser. The Apollo Explorer instance should be displayed, allowing you to introspect and run queries against the API.

## Performing Queries

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


## Project Structure

### Folders

- **fields/**: Contains the field definitions for the GraphQL root fields.
- **generated/**: Holds the generated GraphQL types derived from the schema using the GraphQL code generator CLI.
- **tests/**: Contains the test cases written using Jest.
- **types/**: Contains the base GraphQL types.

### Important Files

- `remote.ts`: Contains the remote GraphQL schema.
- `local.ts`: Contains the local GraphQL schema.
- `schema.ts`: Combines both remote and local schemas into the final schema.

## Running the API

### Starting the API Server

To start a standalone API server that runs by default at `localhost:4000` and offers an Apollo Explorer instance for introspection and running queries:

```sh
npm run start:api
```

**This server is only used to facilitate development, and has no effect when working with `gatsby develop`.**


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

### Developing with In-Memory MongoDB

To start an in-memory MongoDB server, which is useful for development to avoid setting up a MongoDB database:

```sh
npm run start:memory-mongo
```

## Schema and API Stitching

During the migration from Atlas to our API, we stitch two GraphQL schemas: one from Atlas and one local. These schemas can be found in the `remote.ts` and `local.ts` files respectively. The final combined schema is found in `schema.ts`.
