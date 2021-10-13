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
    - You need to have git LFS installed, and if not granted access to Netlify Large Media, please set ` GIT_LFS_SKIP_SMUDGE=1` before cloning, and when pushing, use `yarn lint && yarn format && git push --no-verify` to skip Netlify's pre-commit hook.
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

The AIID began its life as the `Discover` application, which means it has much of the functionality that is in the process of shifting to the enclosing Gatsby application. This particular app is "old school," in the sense that it has no build or rendering pipeline. The code you see is the code you get in the client. There are two modes of operation for the app: normal user and admin user. The admin user is identified by a `admin_key=` URL parameter, which serves to authenticate the user into the MongoDB database. A valuable coding contribution to the site would be to move any functionality from the Discover app that is not related to instant/faceted search and put it into the Gatsby application.

You can find the discover application in its own scripting environment at `site/gatsby-site/static/discover`.

## Production System

### Netlify

The site is hosted by [Netlify](https://www.netlify.com/) and is integrated into GitHub to generate previews of all code states. This allows for seamless previewing of the application. However, the preview domains do not match the whitelisted domains known by the MongoDB service, so not all functionality is expected to work in the build previews without whitelisting the domain preview.

**Builds:** Builds are presently run at least every 3 hours automatically by a GitHub action. They are also run on merge requests from forks. The site deploys from the master branch automatically if the build succeeds.

**Git LFS:** Images in the `site/gatsby-site/static/large_media/report_banners` directory are Git LFS images, which means they are not checked into the repository directly, but they are posted to Netlify when you push to GitHub. Note that this means the images will not, by default, be checked out and hosted in your development.

### MongoDB Database

See [mongo.md](mongo.md)

### Algolia

[Algolia](https://www.algolia.com/) is the instant search provider interfaced in the [Discover](https://incidentdatabase.ai/about_apps/1-discover) application. It is presently manually when new incident reports are ingested into the database.

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
 