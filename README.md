# aiid-capture

A work-in-progress repository doing the following:

1. Capturing the data associated with publicly available URLs detailing AI Incidents. Status: an initial set of incidents has been scraped. The capture scripts now need to be adapted to a user interface instead of a batch jobb.
2. A serverless Javascript application for interfacing with a two MongoDB databases. One MongoDB is associated with the search index supporting instantaneous search of full text articles. The other one is the same data, but it is stored in a secondary server for administratively cleaning data. At some point in the future the administrative database will automatically push to the search index, but this will be a manual process in the near team.

## Contributing

1. Open a feature branch from whichever branch you would like to change, `git checkout -b feature-cool-new-thing`.
2. Make your change, commit them, then push them remote.
3. Open a pull request.
4. Ping Sean to review the change.
5. Update the pull request based on the review.
6. See the pull request get pulled. :)

Please make sure your code is well organized and commented before opening the pull request.

Assignment of IP: please see "license" below.

## Starting the Web Application for Development

### System Requirements

You will need a web server of some sort. Since the web application is serverless (i.e., it is static HTML, CSS, and Javascript), you can just serve the files to the web browser. In most cases I recommend doing the following: `cd aiid-capture/site ; python -m SimpleHTTPServer 8000`, then visit [http://localhost:8000/](http://localhost:8000/) in your browser. This uses a development server that typically ships with Python, so you likely have it already.

### Setup

1. Clone this repository, `git clone git@github.com:PartnershipOnAI/aiid-capture.git`
2. Checkout the branch you are going to be working with. If you want to work from most recent code, you should probably work off of the `feature-admin-interface` branch. `cd aiid-capture; git checkout feature-admin-interface`. DO NOT COMMIT TO THIS BRANCH. This is Sean's working branch. See "contributing" above for developing new code.
3. Start a server in the "site" directory. For example, `cd aiid-capture/site; python -m SimpleHTTPServer 8000`
4. Visit the web application [http://localhost:8000/](http://localhost:8000/)

## Site Architecture

1. Site. A static untemplated web application.
2. Index. The [Algolia](https://www.algolia.com) search index.
3. Database. The [Atlas MongoDB service](https://cloud.mongodb.com) exposed via the [Stitch MongoDB API](https://www.mongodb.com/cloud/stitch). Atlas provides the storage, and Stitch supports the web API with user account provisioning. This database does not currently automatically populate the search index, but periodic dumps will be made from this database to Algolia. The full database can support documents and details that are either unsupported by Algolia, or would be too expensive to host there.

## Administering Data

Administering data requires an API token from Sean. After you have a token, you can visit `http://localhost:8000/?admin_key=TOKEN_GOES_HERE` and you will have full admin access to the website.

Once you have admin access, you can begin doing one of the following data processes below. You also can develop the website without an access token.

### Current Data Process: Cleanup!

1. Get an API key from Sean. This will allow you to connect to the admin database.
2. Get assigned a set of incidents to work with.
3. For each record associate with an assigned incident, click on the magnifying glass.
4. Fix any issues that arise in the editable fields presented within the modal window.

**Definitions of Editable Fields:**

* "title": The title of the article, book, proceedings article, arXiv article, etc.
* "description": A short snipped summarizing the reference's perspective on the incident.
* "date_publish": The date at which the reference posted publicly.
* "text": The full text of the article. If it is spread over several pages, you should add at least the first page and use discretion on whether the later pages are worth manually resolving.
* "image_url": This is the image we will scrape next for display with the incident. If the image is bad, you should just remove the link. Please note that many images will not display until we index them, so you may need to click through on these to see what they  will be.
* "is bad": put contents into this text area to mark the reference as not being good. Add a note indicating what is wrong and we may attempt to move it to a different incident.

We can add other fields at will. The goal is to adaptively develop both the interface and the data.

**Things to note:**

1. Updating the admin records will not update the search index that you see on the page. It only updates the database. We are going to periodically dump the database into Algolia, and at some point in the future we will connect them.
2. Use proper string date formatting: `2019-07-25T16:45:21+00:00` for in ISO 8601 and RFC 3339
3. Follow the data process below! You have a lot of power and could change the whole datastore in ways that are confusing to everyone. If you cause a bad, irreversible problem, please let Sean know and he will roll back to an earlier version of the database. Try to avoid this. :)

### Next Data Process: Add scripts for ingesting new links

The process we just executed should be done at the time the incident link is ingested. The user should see how the contents are parsed, correct them, and then potentially associate the content with an existing link.

### Other Data Process: Incident Definitions

We need to adopt one or more formally evaluatable definitions for AI incidents and accidents. The definitions should minimize inter-rater disagreement. The steps here are to propose 3 definitions, then apply them as a group with minimal contextualization outside the materials.

### Also valuable to work on: Development!

You can make changes to the UI without needing access to the Algolia backend. That is the beauty of the static javascript application: you can control everything! The priority order of new developments is the following:

1. Add an "incident detail" view. The card interface doesn't show the full details of an incident. These could potentially give vital statistics across all incident references.
2. Add a service for parsing incident references interactively.

## License

Note: We have not discussed licenses yet. I am putting my MIT license on this now because it is simpler than figuring out which organizations I can legally add to the license. All code contributed to the project falls under the license. If the license is transferred to an org, it will be to some combination of the Partnership on AI, the XPRIZE Foundation, the AI Commons, Sean McGregor, and/or the contributing individuals/organizations. Contributions include both code and data. Contributors disclaim all rights to their contributions. If you don't like these terms, then please reach out to discuss them. Please note that the MIT license furnished below is one of the most permissive licenses in existence, so this is not limiting your right to expression with code. :)

Copyright 2019 Sean McGregor

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Contact

The AIID is a project of the Partnership on AI. For inquiries, you are encouraged to open an issue on this repository or visit the [production website](http://aiid.partnershiponai.org/). This project is largely organized via email, synchronous meetings, and Slack.
