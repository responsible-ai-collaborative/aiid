import React from 'react';
import config from '../../config';

const HeadContent = ({
  children,
  metaTitle = null,
  metaDescription = metaTitle,
  path,
  metaImage = null,
  metaType = 'website',
  title = null,
}) => {
  const twitter = config.siteMetadata.twitterAccount;

  metaImage ||= config.siteMetadata.ogImage;

  const canonicalUrl = config.gatsby.siteUrl + path;

  return (
    <>
      {title ? <title>{title}</title> : metaTitle ? <title>{metaTitle}</title> : <></>}
      {metaTitle && <meta property="og:title" content={metaTitle} />}
      {metaTitle && <meta property="twitter:title" content={metaTitle} />}
      {metaDescription && <meta property="og:description" content={metaDescription} />}
      {metaDescription && <meta property="twitter:description" content={metaDescription} />}
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
    </>
  );
};

export default HeadContent;
