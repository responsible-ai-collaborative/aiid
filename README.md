<p align="center">
  <a href="https://incidentdatabase.ai#gh-light-mode-only">
    <img src="./site/gatsby-site/static/logos/Blue_AIID.svg" height="100">
  </a>
  <a href="https://incidentdatabase.ai#gh-dark-mode-only">
    <img src="./site/gatsby-site/static/logos/White_AIID.svg" height="100">
  </a>
</p>

<h1 align="center">
 Artificial Intelligence Incident Database
</h1>

<p align="center">
  <a href="https://github.com/responsible-ai-collaborative/aiid/actions/workflows/production.yml"><img src="https://github.com/responsible-ai-collaborative/aiid/actions/workflows/production.yml/badge.svg?branch=main"></a>
  &nbsp;
  <a href="https://github.com/responsible-ai-collaborative/aiid/actions/workflows/staging.yml"><img src="https://github.com/responsible-ai-collaborative/aiid/actions/workflows/staging.yml/badge.svg?branch=staging"></a>
  &nbsp;
  <a href="https://github.com/responsible-ai-collaborative/aiid/actions/workflows/translate-production.yml"><img src="https://github.com/responsible-ai-collaborative/aiid/actions/workflows/translate-production.yml/badge.svg?branch=main"></a>
  &nbsp;
  <a href="https://github.com/responsible-ai-collaborative/aiid/actions/workflows/db-backup.yml"><img src="https://github.com/responsible-ai-collaborative/aiid/actions/workflows/db-backup.yml/badge.svg?branch=main"></a>
  &nbsp;
  <a href="https://codecov.io/gh/responsible-ai-collaborative/aiid"><img src="https://codecov.io/gh/responsible-ai-collaborative/aiid/graph/badge.svg?token=SKMVE2G1GU"></a>
  &nbsp;
  <a href="https://forms.gle/v7UHJvEkYSJQ7jHj7"><img src="https://img.shields.io/badge/Join%20the%20RAIC%20Slack!-purple?logo=slack&"></a>
</p>

Information about the goals and organization of the AI Incident Database can be found on the [production website](https://incidentdatabase.ai/). This page concentrates on onboarding for the following types of contributions to the database,

<!-- we should expand on this -->

1. Contribute **changes** to the current AI Incident Database.
2. Contribute a **new summary** to the AI Incident Database. A "summary" is a programmatically generated summary of the database contents. Examples are available [here](https://incidentdatabase.ai/summaries).
3. Contribute a **new taxonomy** to the AI Incident Database. Details on taxonomies are available in the arXiv paper.
4. Contribute a **new application** facilitating a new use case for the database.

## Project Communications

In most cases unless you are contributing quick fixes, we recommend opening an issue before contributing to the project. You can also [Contact](https://incidentdatabase.ai/contact) us for an invitation to the project's Slack installation. Lurking is encouraged. Finally, for major announcements you can join the [announcements-only mailing list](https://groups.google.com/g/incidentsdb).

## AIID Engineering Process

The AI Incident Database is an open source project inviting contributions from the global community. Anyone with code changes that advance the change thesis of making the world better in the future by remembering the negative outcomes of the past are welcome to submit pull requests. To ensure that submitted changes are likely to be accepted, we recommend becoming familiar with the manner in which we organize our work items and open an issue on GitHub.

The process of completing work through GitHub issues at the highest level is:
`Create Issue` -> `Assign Issue` -> `Review and Publish`

Labels help streamline the process and ensure issues do not get lost or neglected. Label [descriptions are on GitHub](https://github.com/responsible-ai-collaborative/aiid/labels). The following describes when/how to use a label.

### Create Issue

1. Consider if the issue is an Initiative, Epic, or Story. All engineering issues aside from Bugs should fall in one of these categories and be assigned a label. Other types of issues (ex: Data Editor-related) may not have this label.

![](https://user-images.githubusercontent.com/25443411/188503602-9c93c699-5008-495f-8684-a1f18e82afea.png)

2. Apply a descriptor label (when applicable):

![](https://user-images.githubusercontent.com/25443411/188503793-039496b3-0256-4643-9dbd-e077b0dd3024.png)

### Assign Issue

Add the label `Current Backlog` to trigger assigning a contributor. Either the assigner or the contributor adds the issue’s priority and effort labels.

![](https://user-images.githubusercontent.com/25443411/188503632-e27a4b6e-549e-4bbf-ad9c-2e123a2df75e.png)

### Pull Request (PR) Review: Draft, Assign, and Publish

Once the issue has a deliverable output(s), use the Pull Request process to have the contribution reviewed and accepted.

The person opening the PR should create it in a draft status until the work is finished, then they should click on "Ready for review" button and assign it to someone as a reviewer as soon the PR is ready to be reviewed.

#### Assigning a reviewer

In general, PR reviews can be assigned to any member of the [@responsible-ai-collaboraite/aiid-dev](https://github.com/orgs/responsible-ai-collaborative/teams/aiid-dev) team, or to the team alias itself.
**Don't be shy!** Above all, contributors and reviewers should assume good intentions. As such, reviewers are also encouraged to re-assign PR reviews based on familiarity and time constraints.

When something is mergeable, then someone else with maintainer permissions (not the implementer or reviewer) can merge it to staging. They can optionally do a final review.

After merging to staging, the code quality is everyone’s responsibility.

For more information on how to create built-in draft pull requests, please refer to the [GitHub blog](https://github.blog/2019-02-14-introducing-draft-pull-requests/).

## Contributing Changes

Anyone can contribute code to the project. The system is being built as a "do-ocracy", meaning those who "do" have influence over the development of the code.

The steps for contributing changes are the following,

1. Create a fork of the repository.
2. Clone the fork to your local environment.
3. Open a feature branch from whichever branch you would like to change. This is typically the `staging` branch, so you can do `git checkout staging` then `git checkout -b feature-cool-new-thing`.
4. Make your changes, commit them, then push them remote.
5. Open a pull request to the `staging` branch.
6. Update the pull request based on the review.
7. See the pull request get pulled. :)

Please make sure your code is well organized and commented before opening the pull request.

## Site Architecture

The site architecture consists of these main components:

1. **Deployment Pipeline**:

   - Hosted in a GitHub repository
   - Automated through GitHub Actions workflows that handle building, testing, and deploying the application
   - Ensures code quality and successful deployment through automated checks

2. **Frontend Hosting**: A Gatsby-based static web application hosted on Netlify, along with Netlify Functions for serverless API functionality.

3. **Search**: Algolia provides the search index functionality, enabling fast and efficient content discovery.

4. **Content Management**: Prismic CMS allows for dynamic content management including blog posts and other updateable content.

5. **Database**: A MongoDB database stores the core application data. The database content can be synced periodically to update the Algolia search index, allowing for storage of documents and details that may be either unsupported by or too costly to host in Algolia.

Additional services integrated into the architecture include:

- MailerSend for email communication
- Cloudinary for image hosting and optimization
- Sentry for error logging and monitoring
- Google Translate API for content translation capabilities

This architecture maintains a serverless approach, with no need for a traditional dynamic backend server, while leveraging specialized services for specific functionalities. The deployment process is fully automated through GitHub Actions, ensuring consistent and reliable deployments with proper testing and validation steps.

More details are available on our [documentation](site/docs/README.md).

## Public GraphQL endpoint

The site exposes a read-only GraphQL endpoint at `/api/graphql`.

### Accessing the endpoint

You can check the endpoint [https://incidentdatabase.ai/api/graphql](https://incidentdatabase.ai/api/graphql)

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

## Contact

For inquiries, you are encouraged to open an issue on this repository or visit the [contact page](https://incidentdatabase.ai/contact).
