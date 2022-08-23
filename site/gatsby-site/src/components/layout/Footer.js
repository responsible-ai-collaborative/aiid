import { faGithubSquare, faTwitterSquare } from '@fortawesome/free-brands-svg-icons';
import { faRssSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { graphql, useStaticQuery } from 'gatsby';
import React from 'react';
import Row from 'elements/Row';
import Col from 'elements/Col';

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
    <footer className="tw-bg-text-light-gray tw-relative">
      <Row className="tw-flex-row tw-justify-center tw-p-4">
        <Col className="tw-w-auto tw-flex-0-0-auto">2022 - AI Incident Database</Col>
        <Col className="tw-w-auto tw-flex-0-0-auto">
          <div className="tw-flex tw-gap-4">
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
          </div>
        </Col>
        <Col className="tw-w-auto tw-flex-0-0-auto">
          <a className="tw-footer-link" href="/terms-of-use">
            Terms of use
          </a>
        </Col>
        <Col className="tw-w-auto tw-flex-0-0-auto">
          <a className="tw-footer-link" href="/privacy-policy">
            Privacy
          </a>
        </Col>
      </Row>
    </footer>
  );
}
