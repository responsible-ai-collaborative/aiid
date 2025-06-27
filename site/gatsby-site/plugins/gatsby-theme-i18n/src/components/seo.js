import * as React from 'react';
import { Helmet } from 'react-helmet';
import { useStaticQuery, graphql, withPrefix } from 'gatsby';
import { useLocalization } from '../hooks/use-localization';
import { switchLocalizedPath } from '../../../../i18n';

const SEO = ({ location, pageContext }) => {
  const { locale, config } = useLocalization();

  const data = useStaticQuery(graphql`
    query LocalizationSEOQuery {
      site {
        siteMetadata {
          siteUrl
        }
      }
    }
  `);

  const defaultSiteUrl = data.site.siteMetadata.siteUrl;

  const { pathname } = location;

  const defaultPath = switchLocalizedPath({
    currentLang: locale,
    newLang: 'en',
    path: pageContext.originalPath,
  });

  return (
    <Helmet>
      <html lang={pageContext.hrefLang} />
      <link
        rel="alternate"
        hrefLang="x-default"
        href={`${defaultSiteUrl}${withPrefix(defaultPath)}`}
      />
      <link
        rel="alternate"
        hrefLang={pageContext.hrefLang}
        href={`${defaultSiteUrl}${pathname === withPrefix(`/`) ? `/` : pathname}`}
      />
      {config.map((l) => {
        let href;

        if (l.code === locale) return null;

        const path = switchLocalizedPath({
          currentLang: locale,
          newLang: l.code,
          path: pageContext.originalPath,
        });

        href = `${defaultSiteUrl}${withPrefix(path)}`;

        return <link key={l.code} rel="alternate" hrefLang={l.hrefLang} href={href} />;
      })}
      <meta property="og:locale" content={pageContext.hrefLang.replace(`-`, `_`)} />
      {config.map((l) => {
        if (l.code === locale) return null;
        return (
          <meta
            key={l.code}
            property="og:locale:alternate"
            content={l.hrefLang.replace(`-`, `_`)}
          />
        );
      })}
    </Helmet>
  );
};

export { SEO };
