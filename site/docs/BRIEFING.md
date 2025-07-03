# AI Incident Briefing Notification

This document outlines the process for generating and sending the weekly AI Incident Briefing email to subscribers.

## What It Is

The AI Incident Briefing is a weekly automated email digest sent to users who have subscribed to receive updates. It summarizes the latest activity on the AI Incident Database, including new incidents, blog posts, and platform updates from the past week.

## How It's Built

The briefing process runs a script and triggers a GitHub Actions workflow.

### 1. Trigger

The process is triggered weekly by a scheduled GitHub Action.

- **Schedule:** Runs every Sunday at 15:00 UTC.
- **Workflows:**
  - `.github/workflows/briefing-staging.yml` for the staging environment.
  - `.github/workflows/briefing-production.yml` for the production environment.
- **Manual Trigger:** The workflows can also be dispatched manually through the GitHub UI.

These workflows call a reusable workflow, `.github/workflows/process-briefing-notifications.yml`, which executes the core logic.

### 2. Core Script

The main script responsible for the entire process is `site/gatsby-site/src/scripts/process-briefing-notifications.ts`.

Here's a step-by-step breakdown of what the script does:

1.  **Fetch Notifications:** It queries the MongoDB `notifications` collection for new, unprocessed notifications with the type `ai-briefing`. These notifications are created when a new incident is submitted.

2.  **Fetch Subscribers:** It retrieves the list of users who have subscribed to the `ai-briefing` from the `subscriptions` collection.

3.  **Fetch Content:**
    *   **Incidents:** For each new incident notification, it fetches detailed data from the `incidents`, `reports`, and `entities` collections in the `aiidprod` database. This includes the incident title, description, date, and any associated entities (developers, deployers, harmed parties and implicated AI systems). It also looks for the first report's image to display in the email.
    *   **Blog Posts:** It uses the Prismic client to fetch any new blog posts published in the last 7 days.
    *   **Updates:** It fetches any new platform updates from the "update" custom type in Prismic that have been published in the last 7 days.

4.  **Assemble Email:** The script compiles all the fetched data (incidents, blog posts, updates) into a single object.

5.  **Send Email:**
    *   If there is content to send and there are subscribers, it calls the `sendBulkEmails` function.
    *   This function uses the email template located at `site/gatsby-site/server/emails/templates/AIIncidentBriefing.ts` to generate the final HTML for the email.
    *   It sends the email to all subscribers using a bulk email service (e.g., MailerSend).

6.  **Update Status:** After the emails have been sent (or if there was nothing to send), the script marks the initial notifications as `processed: true` in the database to prevent them from being sent again.

### Error Handling

- If the email sending process fails, the script is designed to catch the error and revert the `processed` status of the notifications. This ensures that a failed run can be retried without skipping any incidents.
- The script logs errors to the console and uses a reporter for more persistent error tracking.

## Key Files

-   **Core Logic:** `site/gatsby-site/src/scripts/process-briefing-notifications.ts`
-   **GitHub Actions:**
    -   `./.github/workflows/process-briefing-notifications.yml` (Reusable workflow)
    -   `./.github/workflows/briefing-staging.yml`
    -   `./.github/workflows/briefing-production.yml`
-   **Email Template:** `site/gatsby-site/server/emails/templates/AIIncidentBriefing.ts`
-   **Tests:** `site/gatsby-site/server/tests/process-briefing-notifications.spec.ts`

## Subscribing to the Briefing

Users with `admin` or `incident_editor` roles can subscribe to the AI Incident Briefing through their account page.

-   **UI Component:** The subscription option is managed by the `UserSubscriptions` component, located at `site/gatsby-site/src/components/UserSubscriptions.js`.
-   **How it Works:** This component provides a toggle switch labeled "Receive AI Incident Briefing". When a user enables this toggle, a record is created in the `subscriptions` collection in MongoDB with the type `ai-briefing` and the user's ID. This adds them to the mailing list for the next scheduled briefing.
