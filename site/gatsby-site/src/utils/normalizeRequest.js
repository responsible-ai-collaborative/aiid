// query strings in a function hosted on Netlify behave differently than on Node
export default function normalizeRequest(req) {
  //Netlify concatenates query string parameters sent as array into one string

  if (typeof req?.query?.urls === 'string') {
    req.query.urls = req.query.urls.split(', ');
  }

  // Native Netlify functions use a different way to access query string parameters

  if (req?.queryStringParameters?.['urls[]']) {
    req.query = { urls: req.queryStringParameters['urls[]'].split(', ') };
  }

  // make sure the parameter is always an array even with only one element

  if (!Array.isArray(req.query.urls)) {
    req.query.urls = [req.query.urls];
  }

  return req;
}
