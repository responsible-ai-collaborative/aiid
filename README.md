# Artificial Intelligence Incident Database (AIID)

The goal of this project is to facilitate the characterization and dissemination of incidents wherein AI systems produce real world harms. Surfacing these incidents serves to prevent or mitigate future incidents. Similar to other incident databases, such as databases for aviation and motor vehicles, the AIID is a systematization of knowledge facilitating trend analysis and the development of best practices. Incident systematization helps proactively avoid physical, emotional, and economic harms.

The AIID consists of a website built upon a database where users can view and submit incident reports that are then associated with incident identifiers. A single incident can be associated with multiple incident reports, such as news articles and scholarly work. Future versions of the AIID will additionally support a flexible taxonomic system wherein editors can develop technology and impact systematizations on the incident database.

[See the live site here](http://aiid.partnershiponai.org/)

## Governance

The AIID is governed by the Partnership on AI (PAI) partner organizations and stewarded by [Sean McGregor](https://seanbmcgregor.com/) as representative of the XPRIZE Foundation (a PAI partner). There is a broad base of interest in the AIID as a research and industrial tool and the development of the incident indexing will be managed in a participatory manner. Persons and organizations contributing code and incidents will be given priority and position in the governance of the project. The following positions currently exist on the project,

**Steering:** People that have contributed significant time and resources to the project and are affiliated with a PAI partner organization.

* Sean McGregor (XPRIZE Foundation)

**Advisors:** People that have contributed significant time and resources to the project.

* Jingying Yang (Partnership on AI)

**Open Source Contributors:** People that have contributed more than one pull request to the code base.

* Seth Reid (AI Forum of New Zealand)

**Incident Editors:** People that resolve incident submissions to the database.

* Sean McGregor (XPRIZE Foundation)

**Incident Contributors:** People that have contributed a large numbers of incidents to the database.

* Sam Yoon (as contractor to PAI, now with Deloitte Consulting)
* Catherine Olsson (Google)
* Roman Yampolskiy (University of Louisville)

There is a growing community of people concerned with the collection and characterization of AI incidents, and we encourage everyone to contribute to the development of this system.

## Contributing Incidents

At present all incidents must be submitted to the review backlog for editors to resolve into existing or new AI incident identifiers. The new incidents will periodically be added after their submission [here](http://aiid.partnershiponai.org/).

## Contributing Code

Anyone can contribute code to the project. The steps are the following,

1. Open a feature branch from whichever branch you would like to change, `git checkout -b feature-cool-new-thing`.
2. Make your change, commit them, then push them remote.
3. Open a pull request.
4. Ping Sean to review the change.
5. Update the pull request based on the review.
6. See the pull request get pulled. :)

Please make sure your code is well organized and commented before opening the pull request.

### System Requirements

1. Clone this repository, `git clone git@github.com:PartnershipOnAI/aiid-capture.git`
2. Checkout the branch you are going to be working with. If you want to work from most recent code, you should probably work off of the `develop` branch, which periodically merges to master and is then deployed.
3. You will need a web server of some sort. Since the web application is serverless (i.e., it is static HTML, CSS, and Javascript), you can just serve the files to the web browser. In most cases you should do the following: `cd aiid-capture/site ; python -m SimpleHTTPServer 8000`, then visit [http://localhost:8000/](http://localhost:8000/) in your browser. This uses a development server that typically ships with Python, so you likely have it already.

## Site Architecture

The site has three components that all conform to a "serverless architecture," meaning there is no dynamic backend templating the application or responding to API requests. The components include,

1. Site. A static untemplated web application.
2. Index. The [Algolia](https://www.algolia.com) search index.
3. Database. The [Atlas MongoDB service](https://cloud.mongodb.com) exposed via the [Stitch MongoDB API](https://www.mongodb.com/cloud/stitch). Atlas provides the storage, and Stitch supports the web API with user account provisioning. This database does not currently automatically populate the search index, but periodic dumps will be made from this database to Algolia. The full database can support documents and details that are either unsupported by Algolia, or would be too expensive to host there.

## Administering Data

Administering data requires an API token from Sean. After you have a token, you can visit `?admin_key=TOKEN_GOES_HERE` and you will have full admin access to the database.

### Database Schema

There are two backend databases. First the MongoDB database supports storage of arbitrary MongoDB database objects. These objects are the incident report documents. Second, the MongoDB database periodically exports to the Algolia instant search index by subsetting the MongoDB database fields to those required by Algolia. Until a document is exported from MongoDB to Algolia, it is not live and available within the web application.

Systems

* _id: 5534b8c29cfd494a0103d45a # MongoDB database hash
* incident_id: 1 # (int) The incrementing primary key for incidents, which are a collection of reports.
* ref_number: 9284 # (int) The auto-incrementing primary key counting report numbers

Definitions

* is_incident: True # (Bool or nil) Determines whether it is officially an incident

Dates

* incident_date: `2019-07-25T16:45:21+00:00` # (TimeDate) Date the incident occurred. Defaults to the article date. ISO 8601 and RFC 3339
* date_downloaded:`2019-07-25T16:45:21+00:00` # (TimeDate) Date the report was downloaded. ISO 8601 and RFC 3339
* date_modify: `2019-07-25T16:45:21+00:00` # (TimeDate or null) Date the report was edited. ISO 8601 and RFC 3339
* date_published: `2019-07-25T16:45:21+00:00` # (TimeDate or null) The publication date of the report. ISO 8601 and RFC 3339

People

* submitter: Array(string) # People that submitted the incident report
* authors: Array(string) # People that wrote the incident report

Text

* title: "title of the report" # (string) The title of the report that is indexed.
* description: "Short text for the report"
* text: "Long text for the report" # (string) This is the complete text for the report in the MongoDB instance, and a shortened subset in the Algolia index

Media

* language: "en" # (string) The language identifier of the report.
* image_url: "http://si.wsj.net/public/resources/images/BN-IM269_YouTub_P_2015051817" # (string) The URL for the image that is indexed. This will be stored on the server as a hash of the URL.
* source_domain: "blogs.wsj.com" # (string) The domain name hosting the report.
* url: "https://blogs.wsj.com/digits/2015/05/19/googles-youtube-kids-app-criti" # The fully qualified URL to the report as hosted on the web.

### Systems

A cron job periodically exports the schema to the form supported by the Algolia index, which includes shortening the full-text fields to be within the maximum length. Another cron job also requests the images associated with the database entry and adds them to the site host.

In the future, an additional set of database keys will be added to support the development of incident taxonomies.

## License

The codebase currently carries an individual MIT license because it is simplest way to proceed forward. All code contributed to the project falls under the license. If the license is transferred to an org rather than an individual, it will be to some combination of the Partnership on AI, the XPRIZE Foundation, the AI Commons, Sean McGregor, and/or the contributing individuals/organizations. Contributions include both code and data. Contributors disclaim all rights to their contributions. If you don't like these terms, then please reach out to discuss them. Please note that the MIT license furnished below is one of the most permissive licenses in existence, so this is not limiting your right to expression with code. :)

Copyright 2020 Sean McGregor

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Contact

The AIID is a project of the Partnership on AI. For inquiries, you are encouraged to open an issue on this repository or visit the [production website](http://aiid.partnershiponai.org/). This project is largely organized via email, synchronous meetings, and Slack.
