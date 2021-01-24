import React from 'react';
import Helmet from 'react-helmet';
import { graphql } from 'gatsby';

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { Layout } from '@components';
import { StyledHeading, StyledMainWrapper } from '../components/styles/Docs';
import Citation from '../components/Citation';
import IncidentList from '../components/IncidentList';
import ImageCarousel from '../components/ImageCarousel';
import BibTex from '../components/BibTex';
import Link from '../components/link';

import { getCanonicalUrl } from '../utils/getCanonicalUrl';

const IncidentCite = ({ data, ...props }) => {
  if (!data) {
    return null;
  }

  const {
    allMongodbAiidprodIncidents: { group },
    allMongodbAiidprodDuplicates: { distinct },
  } = data;

  // meta tags
  const reports = group[0]['edges'];

  const incident_id = reports[0]['node']['incident_id'];

  const metaTitle = 'Incident ' + incident_id;

  const metaDescription = 'Citation record for Incident ' + incident_id;

  const canonicalUrl = getCanonicalUrl(incident_id);

  const nodes = group[0]['edges'];

  return (
    <Layout {...props}>
      <Helmet>
        {metaTitle ? <title>{metaTitle}</title> : null}
        {metaTitle ? <meta name="title" content={metaTitle} /> : null}
        {metaDescription ? <meta name="description" content={metaDescription} /> : null}
        {metaTitle ? <meta property="og:title" content={metaTitle} /> : null}
        {metaDescription ? <meta property="og:description" content={metaDescription} /> : null}
        {metaTitle ? <meta property="twitter:title" content={metaTitle} /> : null}
        {metaDescription ? <meta property="twitter:description" content={metaDescription} /> : null}
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>
      <div className={'titleWrapper'}>
        <StyledHeading>{metaDescription}</StyledHeading>
      </div>
      <StyledMainWrapper>
        {distinct.length > 0 && (
          <Container>
            This incident is a duplicate of Incident{' '}
            <Link to={`/cite/${distinct[0]}`}>{distinct[0]}</Link>. All new reports and citations
            should be directed to incident {distinct[0]}. The reports previously found on this page
            have been migrated to the previously existing incident.
          </Container>
        )}
        {distinct.length === 0 && (
          <Container>
            <Row>
              <Col>
                <h2>Suggested citation format</h2>
                <Citation nodes={nodes} incident_id={incident_id} />
              </Col>
            </Row>
            <Row className="mt-4 mb-5">
              <Col>
                <h2>Reports</h2>
                <IncidentList group={group} />
                <ImageCarousel nodes={nodes} />
              </Col>
            </Row>
            <Row className="mt-4 mb-5">
              <Col>
                <h1>Tools</h1>
                <Button variant="outline-primary" className="mr-2" href={'/summaries/incidents'}>
                  All Incidents
                </Button>
                <Button
                  variant="outline-primary"
                  className="mr-2"
                  href={'/discover/index.html?incident_id=' + incident_id}
                >
                  Discover
                </Button>
                <BibTex nodes={nodes} incident_id={incident_id} />
              </Col>
            </Row>
          </Container>
        )}
      </StyledMainWrapper>
    </Layout>
  );
};

export default IncidentCite;

export const pageQuery = graphql`
  query($incident_id: Int!) {
    site {
      siteMetadata {
        title
        docsLocation
      }
    }
    allMdx {
      edges {
        node {
          fields {
            slug
            title
          }
        }
      }
    }
    allMongodbAiidprodIncidents(filter: { incident_id: { eq: $incident_id } }) {
      group(field: incident_id) {
        edges {
          node {
            id
            submitters
            incident_date
            date_published
            incident_id
            report_number
            title
            url
            image_url
            source_domain
          }
        }
      }
    }
    allMongodbAiidprodDuplicates(filter: { duplicate_incident_number: { eq: $incident_id } }) {
      distinct(field: true_incident_number)
    }
  }
`;
