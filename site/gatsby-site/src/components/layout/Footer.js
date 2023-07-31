import {
  faFacebookSquare,
  faGithubSquare,
  faLinkedin,
  faTwitterSquare,
} from '@fortawesome/free-brands-svg-icons';
import { faExternalLinkAlt, faRssSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { graphql, useStaticQuery } from 'gatsby';
import React from 'react';
import config from '../../../config';
import { LocalizedLink } from 'plugins/gatsby-theme-i18n';
import { Trans, useTranslation } from 'react-i18next';

export default function Footer() {
  const data = useStaticQuery(graphql`
    query FooterQuery {
      site {
        siteMetadata {
          headerTitle
          githubUrl
          facebookUrl
          linkedInUrl
          helpUrl
          tweetText
          logo {
            link
            image
            mobile
          }
        }
      }
      allPrismicFooter(sort: { data: { order: ASC } }) {
        edges {
          node {
            data {
              title
              items {
                item_title
                item_url {
                  url
                }
                path
              }
              order
              social {
                name
                url {
                  url
                }
              }
            }
          }
        }
      }
    }
  `);

  const {
    site: {
      siteMetadata: { githubUrl, facebookUrl, linkedInUrl },
    },
    allPrismicFooter,
  } = data;

  const footerContent = [];

  if (allPrismicFooter.edges.length > 0) {
    allPrismicFooter.edges.forEach((group) => {
      const title = group.node.data.title;

      let items = group.node.data.items.map((item) => {
        return {
          title: item.item_title,
          url: item.item_url?.url || item.path,
        };
      });

      footerContent.push({
        title,
        items,
        socialItems: group.node.data.social.map((item) => {
          return {
            name: item.name,
            url: item.url?.url || item.path,
          };
        }),
      });
    });
  } else {
    //Fallback to config
    config.footer.navConfig.map((group) => {
      const title = group.title;

      const items = group.items.map((item) => {
        return {
          title: item.title,
          url: item.url,
          label: item.label,
        };
      });

      footerContent.push({
        title,
        items,
      });
    });
  }

  const { t } = useTranslation(['footer']);

  return (
    <footer
      id="main-footer"
      className="bg-text-light-gray relative sm:grid sm:grid-cols-2 md:grid-cols-4 gap-5 p-5 z-50"
    >
      {footerContent.map((group) => {
        const title = group.title;

        const items = group.items;

        const socialItems = group.socialItems || [];

        return (
          <div key={title}>
            <h3 className="text-base mt-4">{t(title)}</h3>
            <ul className="p-0 mb-2">
              {items.map((item) => {
                const url = item.url;

                return (
                  <>
                    {item.title && (
                      <li key={item.title}>
                        {url.includes('http') ? (
                          <a href={url} className="tw-footer-link">
                            {t(item.title)}{' '}
                            <FontAwesomeIcon
                              icon={faExternalLinkAlt}
                              color={'gray'}
                              className="pointer fa fa-sm  hover:text-primary-blue"
                              title="External Link"
                            />
                          </a>
                        ) : (
                          <LocalizedLink to={url} className="tw-footer-link">
                            {t(item.title)}
                          </LocalizedLink>
                        )}
                      </li>
                    )}
                  </>
                );
              })}
              {socialItems.length > 0 && (
                <div className="pt-3 mb-2">
                  {socialItems.map((item) => {
                    const url = item.url;

                    let icon = null;

                    switch (item.name) {
                      case 'twitter':
                        icon = faTwitterSquare;
                        break;
                      case 'facebook':
                        icon = faFacebookSquare;
                        break;
                      case 'linkedin':
                        icon = faLinkedin;
                        break;
                      case 'github':
                        icon = faGithubSquare;
                        break;
                      case 'rss':
                        icon = faRssSquare;
                        break;
                    }
                    return (
                      <>
                        {item.name && (
                          <a
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="pr-2 tw-footer-link"
                          >
                            <FontAwesomeIcon
                              titleId={item.name}
                              icon={icon}
                              color={'gray'}
                              className="pointer fa fa-lg hover:text-primary-blue"
                              title={`Open ${item.name}`}
                            />
                          </a>
                        )}
                      </>
                    );
                  })}
                </div>
              )}
            </ul>
          </div>
        );
      })}

      {allPrismicFooter.edges.length <= 0 && (
        <div>
          <h3 className="text-base mt-4">2023 - AI Incident Database</h3>

          <LocalizedLink to="/terms-of-use" className="tw-footer-link">
            <Trans ns="footer">Terms of use</Trans>
          </LocalizedLink>
          <br />
          <LocalizedLink to="/privacy-policy" className="tw-footer-link">
            <Trans ns="footer">Privacy Policy</Trans>
          </LocalizedLink>
          <div className="pt-3 mb-2">
            <a
              href={'https://twitter.com/IncidentsDB'}
              target="_blank"
              rel="noreferrer"
              className="pr-2 tw-footer-link"
            >
              <FontAwesomeIcon
                titleId={'twitter'}
                icon={faTwitterSquare}
                color={'gray'}
                className="pointer fa fa-lg hover:text-primary-blue"
                title="Open Twitter"
              />
            </a>

            <a href={githubUrl} target="_blank" rel="noreferrer" className="pr-2 tw-footer-link">
              <FontAwesomeIcon
                titleId="github"
                icon={faGithubSquare}
                color={'gray'}
                className="pointer fa fa-lg hover:text-primary-blue"
                title="Open github"
              />
            </a>

            <a
              href={'/rss.xml'}
              target="_blank"
              rel="noopener noreferrer"
              className="pr-2 tw-footer-link"
            >
              <FontAwesomeIcon
                titleId="rss"
                icon={faRssSquare}
                color={'gray'}
                className="pointer fa fa-lg hover:text-primary-blue"
                title="Open RSS Feed"
              />
            </a>

            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pr-2 tw-footer-link"
            >
              <FontAwesomeIcon
                titleId="facebook"
                icon={faFacebookSquare}
                color={'gray'}
                className="pointer fa fa-lg hover:text-primary-blue"
                title="Open Facebook"
              />
            </a>

            <a
              href={linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pr-2 tw-footer-link"
            >
              <FontAwesomeIcon
                titleId="linkedin"
                icon={faLinkedin}
                color={'gray'}
                className="pointer fa fa-lg hover:text-primary-blue"
                title="Open Linked In"
              />
            </a>
          </div>
        </div>
      )}
    </footer>
  );
}
