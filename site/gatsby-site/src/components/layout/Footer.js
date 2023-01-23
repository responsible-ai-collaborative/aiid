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
import { LocalizedLink } from 'gatsby-theme-i18n';

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
          headerLinks {
            link
            text
          }
        }
      }
    }
  `);

  const {
    site: {
      siteMetadata: { githubUrl, facebookUrl, linkedInUrl },
    },
  } = data;

  return (
    <footer className="bg-text-light-gray relative sm:grid sm:grid-cols-2 md:grid-cols-4 gap-5 p-5">
      {config.footer.navConfig.map((group) => (
        <div key={group.title}>
          <h3 className="text-base mt-4">{group.title}</h3>
          <ul className="p-0 mb-2">
            {group.items.map(
              (item) =>
                item.title && (
                  <li key={item.title}>
                    {item.url.includes('http') ? (
                      <a href={item.url} className="tw-footer-link">
                        {item.title}{' '}
                        <FontAwesomeIcon
                          icon={faExternalLinkAlt}
                          color={'gray'}
                          className="pointer fa fa-sm "
                          title="External Link"
                        />
                      </a>
                    ) : (
                      <LocalizedLink to={item.url} className="tw-footer-link">
                        {item.title}
                      </LocalizedLink>
                    )}
                  </li>
                )
            )}
          </ul>
        </div>
      ))}
      <div>
        <h3 className="text-base mt-4">2022 - AI Incident Database</h3>

        <LocalizedLink to="/terms-of-use" className="tw-footer-link">
          Terms of use
        </LocalizedLink>
        <br />
        <LocalizedLink to="/privacy-policy" className="tw-footer-link">
          Privacy Policy
        </LocalizedLink>
        <div className="pt-3 mb-2">
          <a
            href={'https://twitter.com/IncidentsDB'}
            target="_blank"
            rel="noreferrer"
            className="pr-2 tw-footer-link"
          >
            <FontAwesomeIcon
              icon={faTwitterSquare}
              color={'gray'}
              className="pointer fa fa-lg"
              title="Open Twitter"
            />
          </a>

          <a href={githubUrl} target="_blank" rel="noreferrer" className="pr-2 tw-footer-link">
            <FontAwesomeIcon
              icon={faGithubSquare}
              color={'gray'}
              className="pointer fa fa-lg"
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
              icon={faRssSquare}
              color={'gray'}
              className="pointer fa fa-lg"
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
              icon={faFacebookSquare}
              color={'gray'}
              className="pointer fa fa-lg"
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
              icon={faLinkedin}
              color={'gray'}
              className="pointer fa fa-lg"
              title="Open Linked In"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
