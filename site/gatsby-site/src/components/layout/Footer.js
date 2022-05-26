import { faGithubSquare, faTwitterSquare } from '@fortawesome/free-brands-svg-icons';
import { faRssSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { graphql, useStaticQuery } from 'gatsby';
import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import styled from 'styled-components';

const Icons = styled.div`
  display: flex;
  gap: 1rem;
`;

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
    <Container fluid as="footer" className="bg-light" style={{ position: 'relative' }}>
      <Row className="justify-content-md-center p-4">
        <Col xs="auto">2022 - AI Incident Database</Col>
        <Col xs="auto">
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
        </Col>
      </Row>
    </Container>
  );
}
