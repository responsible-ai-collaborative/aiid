# Artificial Intelligence Incident Database (AIID)

[![Gitter](https://badges.gitter.im/incidentdatabase/community.svg)](https://gitter.im/incidentdatabase/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge) [![Netlify Status](https://api.netlify.com/api/v1/badges/9eb0dda2-916c-46f9-a0bd-9ddab3879c6e/deploy-status)](https://app.netlify.com/sites/aiid/deploys)

Information about the goals and organization of the AI Incident Database can be found on the [production website](https://incidentdatabase.ai/). This page concentrates on onboarding for the following types of contributions to the database,

1. Contribute **changes** to the current AI Incident Database.
2. Contribute a **new summary** to the AI Incident Database. A "summary" is a programmatically generated summary of the database contents. Examples are available [here](https://incidentdatabase.ai/summaries).
3. Contribute a **new taxonomy** to the AI Incident Datatabase. Details on taxonomies are available in the arXiv paper.
4. Contribute a **new application** facilitating a new use case for the database.

In most cases unless you are contributing quick fixes, we recommend opening an issue before contributing in any of these areas.

[You can see the live site here](https://incidentdatabase.ai/)

## Contributing Changes

Anyone can contribute code to the project. The system is being built as a "do-ocracy", meaning those who "do" have influence over the development of the code.

The steps for contributing changes are the following,

1. Create a fork of the repository.
2. Open a feature branch from whichever branch you would like to change, `git checkout -b feature-cool-new-thing`.
3. Make your changes, commit them, then push them remote.
4. Open a pull request to the `master` branch.
5. Update the pull request based on the review.
6. See the pull request get pulled. :)

Please make sure your code is well organized and commented before opening the pull request.

## Site Architecture

The site has three components that all be considered "serverless," meaning there is no dynamic backend templating the application or responding to API requests. The components include,

1. Web host. This is the web server hosting the Gatsby-based web application. The site is hosted in production on [Netlify](https://www.netlify.com/).
2. Index. The [Algolia](https://www.algolia.com) search index.
3. Database. The [Atlas MongoDB service](https://cloud.mongodb.com) exposed via [MongoDB Realm](https://www.mongodb.com/realm). Atlas provides the storage, and Realm supports the web API with user account provisioning. This database does not currently automatically populate the search index, but periodic dumps will be made from this database to Algolia. The full database can support documents and details that are either unsupported by Algolia, or would be too expensive to host there.

More details are available in the `Production System` information below. We recommend most people forego setting up a development environment with their own Index and Database. You should instead concentrate on setting up a Gatsby development site.

## Gatsby Site

**Setup the application:**

1. Clone this repository, `git clone git@github.com:PartnershipOnAI/aiid.git`
2. Install all the dependencies associated with [Gatbsy development](https://www.gatsbyjs.com/tutorial/part-zero/) to your machine.
3. From inside the `site/gatsby-site/` directory, issue `gatsby develop`. Visit `http://localhost:8000`

Now when you modify pages in the Gatsby site, you can see the build update in the terminal and the UI updated in the browser.

**Style guide:**

1. `ESLint` and `Prettier` has been configured to help enforcing code styles. Configuration details can be found on `.eslintrc.json` and `.prettierrc`.
2. [Husky](https://github.com/typicode/husky#readme) and [lint-staged](https://github.com/okonet/lint-staged) are installed and `pre-commit` hook added to check lint/prettier issues on staged files and fix them automatically before making commit.
3. `format` and `lint` scripts can be used manually to fix style issues.

**Where to find things:**

The Gatsby front end manages a growing collection of web applications, including,

* Navigational pages: Content in the `site/gatsby-site/content` directory are part of the Gatsby site's navigational structure and automatically built
* Apps: The apps that are presently listed [on the website](https://incidentdatabase.ai/about_apps) can live either as static web applications separate from the Gatsby app (see the "Discover" app below), or in the Gatsby app scripting environment. The current apps of the Gatsby environment are found in `site/gatsby-site/pages/apps`.
* Summaries: Summaries are apps that are summarizing the dataset. These can be found at `site/gatsby-site/pages/summaries`
* Citations: pages in the `/cite/INCIDENT_ID` route give a suggested citation for the incident record along with basic summary information for the associated incident reports. These pages are programatically generated and typeset according to the template in `site/gatsby-site/src/templates/cite.js`.

## Discover App Structure

The AIID began its life as the `Discover` application. There are two modes of operation for the app: normal user and admin user. The admin user is identified by a `admin_key=` URL parameter, which serves to authenticate the user into the MongoDB database.

## Production System

### Netlify

The site is hosted by [Netlify](https://www.netlify.com/) and is integrated into GitHub to generate previews of all code states. This allows for seamless previewing of the application. However, the preview domains do not match the whitelisted domains known by the MongoDB service, so not all functionality is expected to work in the build previews without whitelisting the domain preview.

**Builds:** Builds are presently run at least every 3 hours automatically by a GitHub action. They are also run on merge requests from forks. The site deploys from the master branch automatically if the build succeeds.

### MongoDB Database

See [mongo.md](mongo.md)

### Algolia

[Algolia](https://www.algolia.com/) is the instant search provider interfaced in the [Discover](https://incidentdatabase.ai/about_apps/1-discover) application. It is presently manually when new incident reports are ingested into the database.

### Cloudinary

[Cloudinary](https://www.cloudinary.com/) is what we use to host and manage report images.

## Setting up a development environment

Depending on what feature you are working on, there will be different systems you'll need to set up after you've forked and cloned this repository:

### Basic setup
Get a Gatsby environment working. Most of the time, you'll only need to run:

```
npm i -g gatsby-cli
```
Create a `.env` file under `site/gatsby-site` with the following contents:

```
GATSBY_REALM_APP_ID=aiidstitch2-vsdrv
MONGODB_CONNECTION_STRING=mongodb+srv://readonlyuser:gfz2JXY1SDmworgw@aiiddev.6zxh5.mongodb.net
MONGODB_REPLICA_SET=aiiddev-shard-00-02.6zxh5.mongodb.net,aiiddev-shard-00-01.6zxh5.mongodb.net,aiiddev-shard-00-00.6zxh5.mongodb.net

GATSBY_ALGOLIA_APP_ID=JD5JCVZEVS
GATSBY_ALGOLIA_SEARCH_KEY=c5e99d93261645721a1765fe4414389c
```
In the same folder, install dependencies using `npm` (do not use `yarn`, it will ignore the `package-lock.json` file):

`npm i`

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
- Create a new Realm App. The name should be `AIIDStitch2`. Realm will give it an id like `aiidstitch2-xxxxx`
- Create a new database user with admin access and another user with read-only permissions

#### Replicating the Database
Download the latest database backup from https://incidentdatabase.ai/research/snapshots

Then, run `mongorestore` (included in MongoDB tools) using the admin user created in the step above to upload the database backup:

```
mongorestore mongodb+srv://<USER>:<PASSWORD>@aiiddev.<CLUSTER>.mongodb.net/aiidprod aiidprod`
```
#### Deploy the Realm App

Install the `realm-cli` and follow the login process: https://docs.mongodb.com/realm/cli/

```
npm i -g mongodb-realm-cli
```
Once authenticated, you can deploy the realm app by going to `site/realm` of this repo and running:

```
 realm-cli push --remote=aiidstitch2-<YOUR-NEW-APP-ID>
```

Finally, update the previously created `.env`:

```
GATSBY_REALM_APP_ID =`aiidstitch2-xxxxx`
MONGODB_CONNECTION_STRING=mongodb+srv://<username>:<password>@aiiddev.<CLUSTER>.mongodb.net
MONGODB_REPLICA_SET=<CLUSTER>-shard-00-00.6zxh5.mongodb.net,aiiddev-shard-00-01.<CLUSTER>.mongodb.net,aiiddev-shard-00-02.<CLUSTER>.mongodb.net
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

Algolia index settings are uploaded on build time, so you'll have to do that at least once from your local env:
```
gatsby build
```

Restart Gatsby, and you should have a complete working environment!

## License

The codebase currently carries an GNU Affero General Public License and all contributions to the project falls under the license. Contributors disclaim all rights to their contributions. Please reach out to discuss the license terms if they are causing you any issues. We selected the GNU Affero license to encourage contributing back to the project, but the license itself provides the community wide latitude in working with this codebase.

Copyright 2021 Sean McGregor

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

## Contact

For inquiries, you are encouraged to open an issue on this repository or visit the [contact page](https://incidentdatabase.ai/contact).
 