import React from 'react';
import Helmet from 'react-helmet';
import config from '../../config';

const AiidHelmet = ({ children, metaTitle, metaDescription, canonicalUrl }) => (
  <Helmet>
    {metaTitle && <title>{metaTitle}</title>}
    {metaTitle && <meta name="title" content={metaTitle} />}
    {metaTitle && <meta property="og:title" content={metaTitle} />}
    {metaTitle && <meta property="twitter:title" content={metaTitle} />}
    {metaDescription && <meta property="og:description" content={metaDescription} />}
    {metaDescription && <meta property="twitter:description" content={metaDescription} />}
    {metaDescription && <meta name="description" content={metaDescription} />}

    {config.siteMetadata.ogImage && (
      <meta property="twitter:image" content={config.siteMetadata.ogImage} />
    )}
    {config.siteMetadata.favicon && (
      <link rel="shortcut icon" type="image/svg" href={config.siteMetadata.favicon} />
    )}
    {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

    {children}
  </Helmet>
);

export default AiidHelmet;
