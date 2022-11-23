import React from 'react';
import Helmet from 'react-helmet';
import config from '../../config';

const AiidHelmet = ({
  children,
  metaTitle = null,
  metaDescription = null,
  canonicalUrl = null,
  metaImage = null,
  metaType = 'website',
}) => {
  const twitter = config.siteMetadata.twitterAccount;

  metaImage ||= config.siteMetadata.ogImage;

  if (canonicalUrl[0] == '/') {
    canonicalUrl = config.gatsby.siteUrl + canonicalUrl;
  }

  return (
    <Helmet>
      {metaTitle && <title>{metaTitle}</title>}
      {metaTitle && <meta name="title" content={metaTitle} />}
      {metaTitle && <meta property="og:title" content={metaTitle} />}
      {metaTitle && <meta property="twitter:title" content={metaTitle} />}
      {metaDescription && <meta property="og:description" content={metaDescription} />}
      {metaDescription && <meta property="twitter:description" content={metaDescription} />}
      {metaDescription && <meta name="description" content={metaDescription} />}
      {metaImage && <meta property="twitter:image" content={metaImage} />}
      {metaImage && <meta property="og:image" content={metaImage} />}

      <meta property="og:type" content={metaType} />

      {twitter && <meta name="twitter:site" content={twitter} />}
      {twitter && <meta name="twitter:creator" content={twitter} />}

      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}

      <meta property="twitter:card" content="summary_large_image" />
      {config.siteMetadata.favicon && (
        <link rel="shortcut icon" type="image/svg" href={config.siteMetadata.favicon} />
      )}

      {children}
    </Helmet>
  );
};

export default AiidHelmet;
