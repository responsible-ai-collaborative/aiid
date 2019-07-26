# aiid-capture

A work-in-progress repository for capturing the data associated with publicly available URLs detailing AI Incidents.

## Data

The `data/` directory contains the seed data of AI incidents as collected through January of 2019. Its initial composition is 

## Scripts

Scripts are found in the `scripts/` directory and their function is documented within the headers. They include,

* `newsplease_links.py`: Fetch the content associated with each of the links and store them in the JSON format associated with the newsplease parser.
* `algolia_package.py`: Process the newsplease JSON files into the Algolia index JSON for upload to Algolia.

**Old Scripts**

* `pdf_links.py`: Fetch the content associated with each of the links and render them within a browser, which is then "printed" to a PDF.

## Setup

1. `pip3 install -r requirements.txt`
2. Install [PDFing library](https://wkhtmltopdf.org/downloads.html)
3. Install [NewsPlease](https://github.com/fhamborg/news-please) Parsing Library

## Hosting

There are currently two components to the AIID. This repository hosts the workflows associated with preparing collected 

### Search

todo: details about Algolia

### Exploration Website

todo: Develop

### Collection Website

## Contributing

Development is currently being carried out on the `develop` branch, with periodic unversioned merges to `master`.

## Tools

Other potentially useful tools include,

* [Newspaper](https://github.com/codelucas/newspaper). This is the library included in NewsPlease

## TODO

* Play with the PDF capture script to make the captured PDFs more friendly visually. It supports user CSS script injection. https://pypi.org/project/pdfkit/

Source: https://fontawesome.com/icons/newspaper?style=regular
Authors: https://fontawesome.com/icons/id-card?style=regular

## Contact

The AIID is a project of the Partnership on AI. For inquiries, you are encouraged to contact (todo). This project is largely organized via email, in-person meetings, and Slack.
