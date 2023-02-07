import React from 'react';
import Helmet from 'react-helmet';
import config from '../../config';

const AiidHelmet = ({
  children,
  metaTitle = null,
  metaDescription = null,
  path,
  metaImage = null,
  metaType = 'website',
}) => {
  const twitter = config.siteMetadata.twitterAccount;

  metaImage ||= config.siteMetadata.ogImage;

  const canonicalUrl = config.gatsby.siteUrl + path;

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

      {/* Provide default image even when a metaImage is supplied
       * to act as a fallback in case provided one fails to load.
       * Some sites also allow users to pick from the available meta images
       * if multiple are available.
       */}
      {config.siteMetadata.ogImage && (
        <meta property="og:image" content={config.siteMetadata.ogImage} />
      )}
      {config.siteMetadata.ogImage && (
        <meta property="twitter:image" content={config.siteMetadata.ogImage} />
      )}

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
