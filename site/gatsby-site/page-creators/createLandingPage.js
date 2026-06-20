const path = require('path');

const createLandingPage = async (graphql, createPage) => {
  const result = await graphql(`
    query LandingPage {
      latestIncidents: allMongodbAiidprodIncidents(
        filter: {
          reports: { elemMatch: { is_incident_report: { eq: true }, quiet: { in: [null, false] } } }
        }
        sort: { reports: { epoch_date_submitted: DESC } }
        limit: 5
      ) {
        nodes {
          title
          incident_id
          reports {
            cloudinary_id
            epoch_date_submitted
            image_url
            report_number
            source_domain
            text
            title
            url
            language
            is_incident_report
            quiet
          }
        }
      }

      sponsors: allPrismicSponsor(sort: { data: { order: { text: ASC } } }) {
        edges {
          node {
            data {
              title {
                text
                richText
              }
              order {
                text
              }
              language {
                text
              }
              items {
                name {
                  text
                }
                description {
                  richText
                }
                logo {
                  gatsbyImageData
                  url
                }
                link {
                  url
                }
                direct_link
              }
            }
          }
        }
      }
    }
  `);

  // The landing page renders only a short preview (~240 chars) of a single report per
  // incident, so ship just that one report with a trimmed body. This keeps the homepage
  // page-data.json small — it is downloaded on every visit to "/", including every crawl.
  const PREVIEW_CHARS = 600;

  const latestIncidents = result.data.latestIncidents.nodes.map((node) => {
    const filteredReports = node.reports
      .filter((r) => r.is_incident_report && !r.quiet)
      .sort((a, b) => a.epoch_date_submitted - b.epoch_date_submitted);

    const [previewReport] = filteredReports;

    return {
      ...node,
      reports: previewReport
        ? [
            {
              ...previewReport,
              text:
                typeof previewReport.text === 'string'
                  ? previewReport.text.slice(0, PREVIEW_CHARS)
                  : previewReport.text,
            },
          ]
        : [],
    };
  });

  const latestIncidentsReportNumbers = latestIncidents.map((node) => {
    return node.reports[0].report_number;
  });

  createPage({
    path: '/',
    component: path.resolve('./src/templates/landingPage.js'),
    context: {
      latestIncidents,
      latestIncidentsReportNumbers,
      sponsors: result.data.sponsors.edges,
      latestIncidentIds: latestIncidents.map((incident) => incident.incident_id),
    },
  });
};

module.exports = createLandingPage;
