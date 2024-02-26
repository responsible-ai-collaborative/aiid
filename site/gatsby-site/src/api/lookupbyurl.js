import Rollbar from 'rollbar';
import siteConfig from '../../config';

import Cors from 'cors';

const cors = Cors();

async function handler(req, res) {
  const urls = decodeURIComponent(req.query.urls).split(',');

  const index = require('./lookupIndex.json');

  const results = [];

  for (const url of urls) {
    const result = { url, reports: [], incidents: [] };

    const parsedURL = new URL(url);

    const incidents = index.reduce((filtered, incident) => {
      if (
        incident.reports.some((report) => report.url.includes(parsedURL.host + parsedURL.pathname))
      ) {
        filtered.push({
          incident_id: incident.incident_id,
          title: incident.title,
          url: `${siteConfig.gatsby.siteUrl}/cite/${incident.incident_id}`,
        });
      }

      return filtered;
    }, []);

    result.incidents = incidents;

    const reports = index.reduce((filtered, incident) => {
      incident.reports.forEach((report) => {
        if (report.url.includes(parsedURL.host + parsedURL.pathname)) {
          filtered.push({
            report_number: report.report_number,
            title: report.title,
            url: report.url,
          });
        }
      });

      return filtered;
    }, []);

    result.reports = reports;

    results.push(result);
  }

  // Manually run the cors middleware
  // https://www.gatsbyjs.com/docs/reference/functions/middleware-and-helpers/#custom-middleware

  await new Promise((resolve, reject) => {
    cors(req, res, (result) => {
      if (result instanceof Error) {
        reject(result);
      }
      resolve(result);
    });
  });

  res.status(200).json({ results });
}

const rollbar = new Rollbar({
  accessToken: siteConfig.rollbar.token,
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    code_version: '1.0.0',
  },
});

export default async function (req, res) {
  try {
    await handler(req, res);
  } catch (error) {
    rollbar.error(error);

    res.status(500).send('An error occurred');
  }
}
