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

- **AI Briefing**: Users that are subscribed to `ai-briefing` will receive weekly notifications that include new incidents created in the past week, new blog posts and site updates published in the last week.
``` 
{
  "userId": "63320ce63ec803072c9f529c",
  "type": "ai-briefing"
}
```

These subscription types are also documented in [subscriptions.js](..//gatsby-site/src/utils/subscriptions.js) file.

### Sending Email Notifications

[MailerSend](https://www.mailersend.com/) is used to send email notifications.

Notifications for the **New Incident**, **Incident**, **Entities** and **Submission Promoted** subscription types are all sent when the next site build finishes. This is because we have to wait until the new/updated Incident page is generated and accessible. When a relevant Incident is created or updated (or a submission is promoted), a pending notification item is saved into the `notifications` DB collection with `processed=false`.

As part of the site build process, the `site/gatsby-site/src/scripts/process-notifications.ts` script processes every pending notification (`processed=false`) of these types in a single pass:

1. It loads all pending notifications and batch-fetches the incidents, reports, entities and subscriptions they reference.
2. It builds **one digest per recipient**, grouping that user's matching notifications into up to four sections (see the table below).
3. It marks the included notifications as `processed=true` (with `sentDate=[now]`) **before** sending, then sends every digest in a **single MailerSend bulk send** (automatically split into chunks of 500 recipients). If the send fails, the notifications are reverted to `processed=false` so the next build retries them.

This means a user who matches several notifications in the same build now receives **one** consolidated email instead of one email per notification type. All digests share the single `server/emails/templates/Notifications.ts` template, and each section only renders when it has items:

| Section | Built from notification type(s) | Recipients |
| --- | --- | --- |
| **New Incidents** | `new-incidents` | `new-incidents` subscribers |
| **Entity Updates** | `entity` | `entity` subscribers of the affected entity |
| **Updates to Incidents You Follow** | `new-report-incident`, `incident-updated` | `incident` subscribers of that incident |
| **Your Approved Submissions** | `submission-promoted` | the user who made the submission |

Email notifications for the **AI Briefing** are sent once a week, on Sunday at 15:00 UTC, and are triggered by a separate GitHub action using their own template. For more information refer to the [AI Briefing email](./BRIEFING.md) doc.

#### Key files

- **Core logic:** `site/gatsby-site/src/scripts/process-notifications.ts`
- **Email template:** `site/gatsby-site/server/emails/templates/Notifications.ts`
- **Bulk send helper:** `site/gatsby-site/server/emails/index.ts` (`sendBulkEmails`)
- **GitHub Action:** `./.github/workflows/process-notifications.yml`
- **Tests:** `site/gatsby-site/server/tests/notifications.spec.ts`

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

- **AI Briefing**

  ```
  {
    "type": "ai-briefing",
    "incident_id": 374,
    "processed": false
  }

## User Roles

All site users have one or more roles assigned to them. The role determines what actions the user can take on the site.

As soon as a user is signed in, the system assigns a `subscriber` role by default. Role assignment is handled manually by the site administrators.

**The roles are:**

| User Role                         | Permissions                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `subscriber`                      | This is the default role assigned to all users. It allows the user to subscribe to new incidents, specific incidents, entities, and anything else that is subscribeable.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `submitter`                       | This role allows the user to submit new incidents under their user account.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `incident_editor`                 | This role allows the user to:<br>- Edit and clone incidents<br>- See the live incident data. The live data is the data that is currently stored in the database. Keep in mind that incident pages are generated on each build, so if a user edits an incident, the change will be only visible if the live data options is activated until the next build finishes.<br>- Add, edit, approve and delete incident variants<br>- View and submit incident candidates<br>- Restore previous versions of incidents and reports.<br>- Approve and reject new submissions. Which involves converting a submission into an incident or report (create incident or report and linked notifications), or deleting the submission |
| `taxonomy_editor`                 | This role allows the user to edit all taxonomies.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `taxonomy_editor_{taxonomy_name}` | This role allows the user to edit a specific taxonomy. ie: `taxonomy_editor_csetv1` role allows the user to edit the `CSETv1` taxonomy.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `admin`                           | This role has full access to the site, including the ability to edit users' roles.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
