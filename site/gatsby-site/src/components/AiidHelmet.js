import React from 'react';
import Helmet from 'react-helmet';
import config from '../../config';

const AiidHelmet = ({ children, metaTitle, metaDescription, canonicalUrl, metaImage }) => (
  <Helmet>
    metaImage ||= config.siteMetadata.ogImage;
    {metaTitle && <title>{metaTitle}</title>}
    {metaTitle && <meta name="title" content={metaTitle} />}
    {metaTitle && <meta property="og:title" content={metaTitle} />}
    {metaTitle && <meta property="twitter:title" content={metaTitle} />}
    {metaDescription && <meta property="og:description" content={metaDescription} />}
    {metaDescription && <meta property="twitter:description" content={metaDescription} />}
    {metaDescription && <meta name="description" content={metaDescription} />}
    {metaImage && <meta property="twitter:image" content={metaImage} />}
    {metaImage && <meta property="og:image" content={metaImage} />}
    {config.siteMetadata.twitterAccount && (
      <>
        <meta name="twitter:site" content="@IncidentsDB" />
        <meta name="twitter:creator" content="@IncidentsDB" />
      </>
    )}
    <meta property="twitter:card" content="summary_large_image" />
    {config.siteMetadata.favicon && (
      <link rel="shortcut icon" type="image/svg" href={config.siteMetadata.favicon} />
    )}
    {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
    {children}
  </Helmet>
);

export default AiidHelmet;
