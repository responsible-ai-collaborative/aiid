import { faGithubSquare, faTwitterSquare } from '@fortawesome/free-brands-svg-icons';
import { faExternalLinkAlt, faRssSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { graphql, useStaticQuery } from 'gatsby';
import React from 'react';
import { Container } from 'react-bootstrap';
import styled from 'styled-components';
import config from '../../../config';
import { LocalizedLink } from 'gatsby-theme-i18n';

const Icons = styled.div`
  display: flex;
  gap: 1rem;
`;

const FooterLink = styled.a``;

export default function Footer() {
  const data = useStaticQuery(graphql`
    query FooterQuery {
      site {
        siteMetadata {
          headerTitle
          githubUrl
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
      siteMetadata: { githubUrl },
    },
  } = data;

  return (
    <Container fluid as="footer" className="bg-light tw-pt-6" style={{ position: 'relative' }}>
      <div className="sm:tw-grid sm:tw-grid-cols-2 md:tw-grid-cols-4 tw-gap-5 tw-p-5">
        {config.footer.navConfig.map((group) => (
          <div key={group.title}>
            <h3 className="tw-text-base">{group.title}</h3>
            <ul className="tw-p-0">
              {group.items.map(
                (item) =>
                  item.title && (
                    <li key={item.title}>
                      {item.url.includes('http') ? (
                        <a href={item.url}>
                          {item.title}{' '}
                          <FontAwesomeIcon
                            icon={faExternalLinkAlt}
                            color={'gray'}
                            className="pointer fa fa-sm"
                            title="External Link"
                          />
                        </a>
                      ) : (
                        <LocalizedLink to={item.url}>{item.title}</LocalizedLink>
                      )}
                    </li>
                  )
              )}
            </ul>
          </div>
        ))}
        <div>
          <h3 className="tw-text-base">2022 - AI Incident Database</h3>

          <FooterLink href="/terms-of-use">Terms of use</FooterLink>
          <br />
          <FooterLink href="/privacy-policy">Privacy Policy</FooterLink>
          <Icons className="tw-pt-3">
            <a href={'https://twitter.com/IncidentsDB'} target="_blank" rel="noreferrer">
              <FontAwesomeIcon
                icon={faTwitterSquare}
                color={'gray'}
                className="pointer fa fa-lg"
                title="Open Twitter"
              />
            </a>

            <a href={githubUrl} target="_blank" rel="noreferrer">
              <FontAwesomeIcon
                icon={faGithubSquare}
                color={'gray'}
                className="pointer fa fa-lg"
                title="Open github"
              />
            </a>

            <a href={'/rss.xml'} target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon
                icon={faRssSquare}
                color={'gray'}
                className="pointer fa fa-lg"
                title="Open RSS Feed"
              />
            </a>
          </Icons>
        </div>
      </div>
    </Container>
  );
}
