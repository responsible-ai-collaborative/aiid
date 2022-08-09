# Artificial Intelligence Incident Database (AIID)

[![Netlify Status](https://api.netlify.com/api/v1/badges/9eb0dda2-916c-46f9-a0bd-9ddab3879c6e/deploy-status)](https://app.netlify.com/sites/aiid/deploys)

Information about the goals and organization of the AI Incident Database can be found on the [production website](https://incidentdatabase.ai/). This page concentrates on onboarding for the following types of contributions to the database,

1. Contribute **changes** to the current AI Incident Database.
2. Contribute a **new summary** to the AI Incident Database. A "summary" is a programmatically generated summary of the database contents. Examples are available [here](https://incidentdatabase.ai/summaries).
3. Contribute a **new taxonomy** to the AI Incident Database. Details on taxonomies are available in the arXiv paper.
4. Contribute a **new application** facilitating a new use case for the database.

## Project Communications

In most cases unless you are contributing quick fixes, we recommend opening an issue before contributing to the project. You can also [Contact](https://incidentdatabase.ai/contact) us for an invitation to the project's Slack installation. Lurking is encouraged. Finally, for major announcements you can join the [announcements-only mailing list](https://groups.google.com/g/incidentsdb).

## Contributing Changes

Anyone can contribute code to the project. The system is being built as a "do-ocracy", meaning those who "do" have influence over the development of the code.

The steps for contributing changes are the following,

1. Create a fork of the repository.
2. Clone the fork to your local environment.
3. Open a feature branch from whichever branch you would like to change. This is typically the master branch, so you can do `git checkout master` then `git checkout -b feature-cool-new-thing`.
4. Make your changes, commit them, then push them remote.
5. Open a pull request to the `master` branch.
6. Update the pull request based on the review.
7. See the pull request get pulled. :)

Please make sure your code is well organized and commented before opening the pull request.

## PR labeling strategy

On a daily basis, all PRs should be labeled with one of the review process tags:
- `PR: Needs Review`
- `PR: Work Needed`
- `PR: Mergeable`

The person opening the PR should create it in a draft status until the work is finished, then she/he should click on "Ready for review" button and apply the `PR: Needs Review` label and assign it to someone as a reviewer as soon the PR is ready to be reviewed.

For more information on how to create built-in draft pull requests, please refer to the [GitHub blog](https://github.blog/2019-02-14-introducing-draft-pull-requests/).

The reviewer can change the PR label to `PR: Mergeable` or `PR: Work Needed` if the PR needs more work and assign it back to the corresponding developer.

Please respond to review requests in a timely manner, or indicate if another reviewer would be better. Code review is everyone’s responsibility.

When something is mergeable, then someone else (not the implementer or reviewer) can merge it to staging. They can optionally do a final review.

After merge to staging, the code quality is everyone’s responsibility.

## Site Architecture

| ![AIID project arquitecture](https://user-images.githubusercontent.com/6564809/181833549-794c3fd0-a324-4d97-9294-da4e7a4a6cc6.png) |
|:--:|
| *Site architecture diagram. This is the link to view and edit the diagram on [Diagrams.net](https://drive.google.com/file/d/1kHT1EFrBjxGZOWewS0uUrOZ2QflqYUnA/view?usp=sharing)* |

The site has three components that all be considered "serverless," meaning there is no dynamic backend templating the application or responding to API requests. The components include,

1. Web host. This is the web server hosting the Gatsby-based web application. The site is hosted in production on [Netlify](https://www.netlify.com/).
2. Index. The [Algolia](https://www.algolia.com) search index.
3. Database. The [Atlas MongoDB service](https://cloud.mongodb.com) exposed via [MongoDB Realm](https://www.mongodb.com/realm). Atlas provides the storage, and Realm supports the web API with user account provisioning. This database does not currently automatically populate the search index, but periodic dumps will be made from this database to Algolia. The full database can support documents and details that are either unsupported by Algolia, or would be too expensive to host there.

More details are available in the `Production System` information below. We recommend most people forego setting up a development environment with their own Index and Database. You should instead concentrate on setting up a Gatsby development site.

**Style guide:**

1. `ESLint` and `Prettier` has been configured to help enforcing code styles. Configuration details can be found on `.eslintrc.json` and `.prettierrc`.
2. [Husky](https://github.com/typicode/husky#readme) and [lint-staged](https://github.com/okonet/lint-staged) are installed and `pre-commit` hook added to check lint/prettier issues on staged files and fix them automatically before making commit.
3. `format` and `lint` scripts can be used manually to fix style issues.

## Production System

### Netlify

The site is hosted by [Netlify](https://www.netlify.com) and is integrated into GitHub to generate previews of all code states. This allows for seamless previewing of the application. However, the preview domains do not match the whitelisted domains known by the MongoDB service, so not all functionality is expected to work in the build previews without whitelisting the domain preview.

**Builds:** Builds are presently run at least every 12 hours automatically by a GitHub action. They are also run on merge requests from forks. The site deploys from the master branch automatically if the build succeeds.

### MongoDB Database

See [mongo.md](mongo.md)

### Algolia

[Algolia](https://www.algolia.com) is the instant search provider interfaced in the [Discover](https://incidentdatabase.ai/about_apps/1-discover) application. It is presently manually when new incident reports are ingested into the database.

### Cloudinary

[Cloudinary](https://www.cloudinary.com) is what we use to host and manage report images.

## Setting up a development environment

Depending on what feature you are working on, there will be different systems you'll need to set up after you've forked and cloned this repository:

### Basic setup
Get a Gatsby environment working. Most of the time, you'll only need to run:

```
npm install --global gatsby-cli
```
Create a `.env` file under `site/gatsby-site` with the following contents:

```
GATSBY_REALM_APP_ID=aiidstitch2-vsdrv
MONGODB_CONNECTION_STRING=mongodb+srv://readonlyuser:gfz2JXY1SDmworgw@aiiddev.6zxh5.mongodb.net
MONGODB_REPLICA_SET=aiiddev-shard-00-02.6zxh5.mongodb.net,aiiddev-shard-00-01.6zxh5.mongodb.net,aiiddev-shard-00-00.6zxh5.mongodb.net

GATSBY_ALGOLIA_APP_ID=JD5JCVZEVS
GATSBY_ALGOLIA_SEARCH_KEY=c5e99d93261645721a1765fe4414389c
GATSBY_AVAILABLE_LANGUAGES=en,es
MONGODB_TRANSLATIONS_CONNECTION_STRING=[to be updated in MongoDB setup section]
```
In the same folder, install dependencies using `npm` (do not use `yarn`, it will ignore the `package-lock.json` file):

```
npm install
```

You are ready to start a local copy of the project:

```
gatsby develop
```
You should have a local copy of the project running on https://localhost:8000.

The values you placed into the env file are all associated with a staging environment that is periodically rebuilt from the production environment. While this helps you get setup more quickly, if you will be making changing to the backend you will need your own development backend that you can control, modify, and potentially break.

### MongoDB setup

If the feature you are working on includes structural changes to the MongoDB database or Realm functions, you'll need to create your own project by going to https://cloud.mongodb.com and following these steps:
- Create a new MongoDB project (the free tier will be enough)
- Create a new Atlas cluster with the name: `AIIDDev`
    - Choose "Username and Password" as authentication method.
    - Choose "My Local Environment" as network access and add your current IP address. If your IP is dynamic, add `0.0.0.0` to the list of IP addresses.
- Create a new Realm App. The name should be `AIIDStitch2`. Realm will give it an id like `aiidstitch2-<REALM_APP_ID>`
- Create a new database user with admin access and another user with read-only permissions

#### Replicating the Database
Download the latest database backup from https://incidentdatabase.ai/research/snapshots.

Extract the archive, then from the `mongodump` directory, run `mongorestore` (included in [MongoDB tools](https://www.mongodb.com/docs/database-tools/installation/installation)) using the admin user created in the step above to upload the database backup:

```
mongorestore mongodb+srv://<USER>:<PASSWORD>@aiiddev.<CLUSTER>.mongodb.net/aiidprod aiidprod
```

You can find the value for `<CLUSTER>` by going to your Atlas cluster's overview on cloud.mongodb.com, then selecting the "primary" shard labeled `aiiddev-shard-00-<XX>.<CLUSTER>.mongodb.net`.

#### Deploy the Realm App

Install the `realm-cli` and follow the login process: https://docs.mongodb.com/realm/cli/realm-cli-login

```
npm install --global mongodb-realm-cli
```
Once authenticated, you can deploy the realm app by going to `site/realm` of this repo and running:

```
 realm-cli push --remote=aiidstitch2-<REALM_APP_ID>
```

Finally, update the previously created `.env`:

```
GATSBY_REALM_APP_ID=aiidstitch2-<REALM_APP_ID>
MONGODB_CONNECTION_STRING=mongodb+srv://<username>:<password>@aiiddev.<CLUSTER>.mongodb.net
MONGODB_REPLICA_SET=aiiddev-shard-00-00.<CLUSTER>.mongodb.net,aiiddev-shard-00-01.<CLUSTER>.mongodb.net,aiiddev-shard-00-02.<CLUSTER>.mongodb.net
```
Restart Gatsby, and your local app should fetch data from your MongoDB environment!

### Algolia environment setup
Suppose the feature you are developing involves mutating the Algolia index (used in the Discover app). In that case, you'll have to create your own by signing up for Algolia here: https://www.algolia.com and following these steps:

- Create a new App (free tier will be enough)
- Create a new index called `instant_search`
- Go to https://incidentdatabase.ai/downloadIndex and save the `new_index.json` file
- Upload this file to your newly created index, by selecting `Use File` Algolia's UI
- Now go to your Algolia App settings, and click API Keys, using the values from there to update your `.env` file accordingly.

```
GATSBY_ALGOLIA_APP_ID=<YOUR APP ID>
GATSBY_ALGOLIA_SEARCH_KEY=<YOUR SEARCH KEY>
ALGOLIA_ADMIN_KEY=<YOUR ADMIN KEY>
```

Algolia index settings are uploaded on build time, so they will take effect after running:

```
gatsby build
```

Alternatively, you can update the settings without rebuilding if from `site/gatsby-site` you run:

```
node src/scripts/algolia-update.js
```

Restart Gatsby, and you should have a complete working environment!

### Translation Process

The translation process runs on Gatsby's `postBuild` event and consists of 3 steps:

-1 Get the list of languages, which is pulled from the /src/components/i18n/languages.js using the `GATSBY_AVAILABLE_LANGUAGES` environment variable as a filter:
```
GATSBY_AVAILABLE_LANGUAGES=en,es,it,af
```
-2 Translate each incident report to each language, and save the translated reports to a `translations` database under a collection for each language:
```
translations 
    |-- incident_reports_en
    |   |-- { title, text, report_number }
    |   |-- { title, text, report_number }
    |
    |--incident_report_es
    |   |-- { title, text, report_number }
        |-- { title, text, report_number }
```
To access this database, a user with read/write permissions needs to be provided through the following environment variable:

```
MONGODB_TRANSLATIONS_CONNECTION_STRING=mongodb+srv://<user>:<password>@aiiddev.<host>.mongodb.net
```

You can use the same value than defined on the MongoDB Setup environment variable ```MONGODB_CONNECTION_STRING```

-3 Generate an Algolia index from each translated collection and upload them to Algolia. Each index has the following naming format:
```
instant_search-{language code}
```
After the first run, the following applies for subsequent runs:
Translations of report fields load from the existing `translations/incident_reports_{language}/{doc}` document, and if not found, then the Translate API is hit.
Algolia indexes are replaced every time the process runs


#### UI Translations

Https://react.i18next.com handles UI translations. To find missing keys enable debugging by setting the following environment variable:

```
GATSBY_I18N_DEBUG=true
```

### Cost

The translate API charges ~20USD per million characters and can translate to 111 languages.

At the time of writing, there are 1336 Incident Reports, each report consisting of ~4000 characters, with a total sum of ~5 million characters.

Considering the pricing above, translating all ingested reports to one language will cost `(5 million / 1 million) * $20 = ~$100`, and translating all incident reports to all languages `$100 * 111= ~$11k`.

The translation process defaults to a **dry run** mode that prepends a string to every translated text instead of hitting Google's API.

Therefore, Translated texts in this mode will look like: `translated-{language}-YouTube to crack down on inappropriate content masked as kids’ cartoons`

The dry run is disabled through an environment variable as follows:

```
TRANSLATE_DRY_RUN=false
```

### Geocoding
If the feature you are working on depends on Google's Geocoding API, please add the following environment variable with the appropriate value to your .env file.

```
GOOGLE_MAPS_API_KEY=XXXXXXXXXXXX
```

## Deployment Setup

Deployment of the site consists of two parts: deployment of the backend related features that runs as a Github Action and deployment of the frontend related features that runs on Netlify:

### Netlify
The Netlify build process runs every time a push is made to an open PR or `master` or `develop`.
To correctly set up  this process, the following environment variables need to be created using Netlify's build settings UI:

```
ALGOLIA_ADMIN_KEY=
AWS_LAMBDA_JS_RUNTIME=nodejs14.x # required to run the Gatsby v4
GATSBY_ALGOLIA_APP_ID=
GATSBY_ALGOLIA_SEARCH_KEY=
GATSBY_REALM_APP_ID=
MONGODB_CONNECTION_STRING=
MONGODB_REPLICA_SET=
```
### Github Actions
Two workflows take care of deploying the Realm app to both `production` and `staging` environments, defined in `realm-production.yml` and `realm-staging.yml`. Each workflow looks for environment variables defined in a Github Environment named `production` and `staging`. 

These environments must contain the following variables:
```
GATSBY_REALM_APP_ID=
REALM_API_PRIVATE_KEY=
REALM_API_PUBLIC_KEY=
```

### Testing

For integration testing, we use Cypress. You can run the desktop app continuously as part of your development environment or run it on demand in headless mode.

First, add two new environment variables:

```
E2E_ADMIN_USERNAME=
E2E_ADMIN_PASSWORD=
```
As their names imply, they should be an existing user's credentials with the `admin` role.

To use the desktop version, run:
```
npm run test:e2e
```

And to run it in continuous integration (headless) mode:
```
test:e2e:ci
```

## Adding new Taxonomies

### To add new taxonomies, follow these steps:
Let's say you want to add the `CTECH` Taxonomy.

1. Create a new MongoDB collection using the lowercased Taxonomy name: ctech.

2. Define the appropriate rules, relationships, and schema for this new collection. Specifically, a schema that specifies the fields of the taxonomy. An example for the fictional `ctech` schema is below. You can optionally populate the schema and use the MongoDB Realm API to generate the schema programmatically.

`/site/realm/data_sources/mongodb-atlas/aiidprod/ctech/schema.json`

```
{
    "properties": {
        "_id": {
            "bsonType": "objectId"
        },
        "classifications": {
            "bsonType": "object",
            "properties": {
                "taxonomy field 1": {
                    "bsonType": "bool"
                },
                "taxonomy field 2": {
                    "bsonType": "string"
                },
                "Publish": {
                    "bsonType": "bool"
                }
            }
        },
        "incident_id": {
            "bsonType": "int"
        },
        "namespace": {
            "bsonType": "string"
        },
        "notes": {
            "bsonType": "string"
        }
    },
    "title": "ctech"
}
```

3. Add the new document to the `taxa` collection, that lists the taxonomy fields. This annotates the classifications found in the new collection and determines properties of their display in the user interface.

```
{
    "_id": {
        "$oid": "61f158f4c19c105af2f3d6af"
    },
    "namespace": "ctech",
    "weight": {
        "$numberInt": "50"
    },
    "description": "# What are these resources?\n\nThe following resources have been associated with incidents in the database to provide tools and processes to persons and companies looking for best practices in the prevention or mitigation of similar incidents in the future.",
    "field_list": [
        {
            "short_name": "taxonomy field 1",
            "long_name": "taxonomy field 1",
            "short_description": "Lorem ipsum...",
            "long_description": "__Lorem ipsum__",
            "display_type": "bool",
            "mongo_type": "bool",
            "default": null,
            "placeholder": null,
            "permitted_values": null,
            "weight": {
                "$numberInt": "70"
            },
            "instant_facet": true,
            "required": false
        },
        {
            "short_name": "Publish",
            "display_type": "bool",
            "mongo_type": "bool"
        }
    ]
}
```

4. Update `createCitiationPages.js` to have it pull the new taxonomy definitions. The relevant lines are:

    - /site/gatsby-site/page-creators/createCitiationPages.js#L125
    - /site/gatsby-site/page-creators/createCitiationPages.js#L180

5. Restart Gatsby

Restarting Gatsby should make the new taxonomy available on the citation pages, so you can visit /cite/1 to see a form for editing the taxonomy. Please note that you will need to be logged in to a user account on the application to see the form.

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

## Public GraphQL endpoint
The site exposes a read-only GraphQL endpoint at `/api/graphql`, which is a reflection of the Realm's auto-generated endpoint.

### GraphiQL
The `graphiQL` UI is avaiable at:
https://incidentdatabase.ai/api/graphql

### Sample request

The endpoint can be queried using any GraphQL client, but for example, if using Apollo:

```
    import { ApolloClient, HttpLink, InMemoryCache, gql } from '@apollo/client';

    const client = new ApolloClient({
        link: new HttpLink({
            uri: `https://incidentdatabase.ai/api/graphql`,
        }),
        cache: new InMemoryCache()
    });

    client.query({query: gql`{
        reports {
          title
          report_number
        }
    }`}).then(result => console.log(result));

```

### Configuration

The endpoint is implemented as a Gatsby function. In the context where this function runs (Netlify or your local Node), an environment variable to an Realm API Key with query introspection permission needs to be set:

```
REALM_GRAPHQL_API_KEY=xxxxxxxxxx
```
About Realm API Keys: https://www.mongodb.com/docs/realm/authentication/api-key/

## Facebook login integration

To allow users to login with Facebook, you will need to add the following configuration to your Atlas App Service.

Add these app values following the instructions in the [Atlas App Services documentation](https://www.mongodb.com/docs/atlas/app-services/values-and-secrets/define-a-value/).

```
facebookAppId = [Facebook App ID]
facebookRedirectUri = [Facebook Authentication redirect URI, see coment below]
```

Facebook Authentication redirect URI is the URL that the user will be redirected to after successfully authenticating with Facebook. It should point to `/logincallback` page. For Production the URI is `https://incidentdatabase.ai/logincallback`

Also add the following secret value to your Atlas App Service following the instructions in the [Atlas App Services documentation](https://www.mongodb.com/docs/atlas/app-services/values-and-secrets/define-and-manage-secrets/).

```
facebookAppSecret = [Facebook App Secret]
```

About Facebook Authentication: https://www.mongodb.com/docs/realm/web/authenticate/#facebook-authentication

## Contact

For inquiries, you are encouraged to open an issue on this repository or visit the [contact page](https://incidentdatabase.ai/contact).
 
