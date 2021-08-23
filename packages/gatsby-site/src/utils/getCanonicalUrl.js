import config from '../../config';

export const getCanonicalUrl = (incident_id) => {
  let canonicalUrl = config.gatsby.siteUrl;

  canonicalUrl =
    config.gatsby.pathPrefix !== '/' ? canonicalUrl + config.gatsby.pathPrefix : canonicalUrl;
  return canonicalUrl + '/cite/' + incident_id;
};
