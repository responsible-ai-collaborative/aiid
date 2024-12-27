# API

## Overview

The AIID API is built to facilitate interactions with the AI Incident Database.

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

## Structure

### Folders

The API is contained within the `server` directory. The following folders are present in the project:

- **fields/**: Contains the field definitions for the GraphQL root fields.
- **generated/**: Holds the generated GraphQL types derived from the schema using the GraphQL code generator CLI.
- **tests/**: Contains the test cases written using Jest.
- **types/**: Contains the base GraphQL types.

#### Important Files

- **`schema.ts`**: Exposes the graphql schema.
- **`netlify/functions/graphql.ts`**: Sets up the **GraphQL server** and exposes it as a **Netlify function**, loading the schema from `schema.ts`.

## Running Code Generation

To run the GraphQL code generation CLI to generate TypeScript typings from the schema, allowing statically typed Apollo client mutations and queries, and statically typed server code:

```sh
npm run codegen
```

## Email notifications

### Subscription types

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

### Sending Email Notifications

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
