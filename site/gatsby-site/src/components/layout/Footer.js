import { faGithubSquare, faTwitterSquare } from '@fortawesome/free-brands-svg-icons';
import { faRssSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { graphql, useStaticQuery } from 'gatsby';
import React from 'react';
import { Container } from 'react-bootstrap';
import styled from 'styled-components';
import config from '../../../config';
import { LocalizedLink } from 'gatsby-theme-i18n';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

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

  console.log(`faExternalLink`, faExternalLinkAlt);

  const {
    site: {
      siteMetadata: { githubUrl },
    },
  } = data;

  return (
    <Container fluid as="footer" className="bg-light" style={{ position: 'relative' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          flexWrap: 'wrap',
          paddingTop: '1.5em',
        }}
      >
        {config.footer.navConfig.map((group) => (
          <div style={{ padding: '0px', display: 'inline-block' }} key={group.title}>
            <h3
              style={{
                display: 'inline-block',
                float: 'left',
                clear: 'both',
                fontSize: '100%',
              }}
            >
              {group.title}
            </h3>
            <ul style={{ padding: '0px', display: 'inline-block', float: 'left', clear: 'both' }}>
              {group.items.map(
                (item) =>
                  item.title && (
                    <li
                      key={item.title}
                      style={{
                        display: 'inline-block',
                        float: 'left',
                        clear: 'both',
                      }}
                    >
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
          <h2 style={{ fontSize: '100%' }}>2022 - AI Incident Database</h2>
          <Icons>
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
          <FooterLink href="/terms-of-use">Terms of use</FooterLink>
          <br />
          <FooterLink href="/privacy-policy">Privacy Policy</FooterLink>
        </div>
      </div>
    </Container>
  );
}
