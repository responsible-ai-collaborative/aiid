import Rollbar from 'rollbar';
import siteConfig from '../../config';
import OpenAPIRequestValidator from 'openapi-request-validator';
import Cors from 'cors';
import spec from '../../static/spec.json';

const requestValidator = new OpenAPIRequestValidator({
  parameters: spec.paths['/api/lookupbyurl'].get.parameters,
});

const cors = Cors();

const isValidURL = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

async function handler(req, res) {
  if (!Array.isArray(req.query.urls)) {
    req.query.urls = [req.query.urls];
  }

  const errors = requestValidator.validateRequest(req);

  if (errors) {
    res.status(400).json(errors);
  }

  const urls = req.query.urls;

  const index = require('./lookupIndex.json');

  const results = [];

  for (const url of urls) {
    const result = { url, reports: [], incidents: [] };

    const parsedURL = new URL(url);

    const incidents = index.reduce((filtered, incident) => {
      if (
        incident.reports
          // some reports are missing the url, it should be fixed in the source but for now we'll filter them out
          // https://github.com/responsible-ai-collaborative/aiid/issues/2664
          .filter((report) => isValidURL(report.url))
          .some((report) => {
            const reportURL = new URL(report.url);

            return reportURL.host + reportURL.pathname === parsedURL.host + parsedURL.pathname;
          })
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
      incident.reports
        .filter((report) => isValidURL(report.url))
        .forEach((report) => {
          const reportURL = new URL(report.url);

          if (reportURL.host + reportURL.pathname === parsedURL.host + parsedURL.pathname) {
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
    console.error(error);
    rollbar.error(error);

    res.status(500).send('An error occurred');
  }
}
