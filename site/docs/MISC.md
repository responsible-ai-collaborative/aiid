## Geocoding

If the feature you are working on depends on Google's Geocoding API, please add the following environment variable with the appropriate value to your .env file.

```
GOOGLE_MAPS_API_KEY=XXXXXXXXXXXX
```

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

### Error logging

This project uses [Rollbar](https://rollbar.com) for error logging for the whole site, including background processes.

To log the errors a Realm secret value should be set:

```
rollbarAccessToken: [The access token value from your Rollbar account > Projects > Your project > Project Access Tokens > post_server_item]
```

In addition to that, this env variable should be set as well:

```
GATSBY_ROLLBAR_TOKEN: [The access token value from your Rollbar account > Projects > Your project > Project Access Tokens > post_server_item]
```

### Restoring Production database to Staging

There is a GitHub Workflow "Restore Prod DB into Staging" that can be triggered manually to dump and restore Production database into Staging database (both `aiidprod` and `translations` databases)
Go to [Actions](https://github.com/responsible-ai-collaborative/aiid/actions) > `Restore Prod DB into Staging` > `Run Workflow` dropdown > `Run Workflow`

To enable this workflow these [GitHub secrets](https://github.com/responsible-ai-collaborative/aiid/settings/secrets/actions) should be added:

```
DB_PRODUCTION_CONNECTION_STRING=[Production connection string with readonly user credentials. ie: mongodb+srv://[DB readonly user]:[DB user password]@aiiddev-xxxxxx.gcp.mongodb.net]
DB_STAGING_CONNECTION_STRING=[Staging connection string with admin user credentials. ie: mongodb+srv://[DB admin user]:[DB user password]@aiiddev-xxxxxx.gcp.mongodb.net]

NETLIFY_BUILD_STAGING_URL=[Netlify Staging build hook. This value is on https://app.netlify.com/sites/staging-aiid/settings/deploys#continuous-deployment]
```

#### Additional Configuration

When building the site, some steps can take a while to run. This can be inconvenient when you are working on a feature unrelated to the steps taking the most time in the build process. To avoid this problem, you can set the environment variable `SKIP_PAGE_CREATOR` to a comma-separated list of page-creator functions found in [`gatsby-node`](https://github.com/responsible-ai-collaborative/aiid/blob/main/site/gatsby-site/gatsby-node.js) that should be skipped. These include: `createMdxPages`, `createCitationPages`, `createWordCountsPages`, `createBackupsPage`, `createTaxonomyPages`, `createDownloadIndexPage`, `createDuplicatePages`, `createTsneVisualizationPage`, and `createEntitiesPages`. For instance, to run a development build skipping the creation of the TSNE (spatial) visualization and citation pages, you would run:

```bash
SKIP_PAGE_CREATOR=createTsneVisualizationPage,createCitiationPages gatsby develop
```

In general, skipping the TSNE visualization has the most significant reduction in build time.
