import React from 'react';
import Helmet from 'react-helmet';
import { graphql } from 'gatsby';

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import Layout from 'components/Layout';
import { StyledHeading, StyledMainWrapper } from 'components/styles/Docs';
import Citation from 'components/Citation';
import IncidentList from 'components/IncidentList';
import ImageCarousel from 'components/ImageCarousel';
import BibTex from 'components/BibTex';

import { getCanonicalUrl } from 'utils/getCanonicalUrl';

import { InstantSearch, Configure, connectHits } from 'react-instantsearch-dom';
import { searchClient, Hits, IncidentStatsCard } from '../../pages/apps/discover';
import styled from 'styled-components';

const HitsContainer = styled.div`
  display: grid;
  max-width: 100%;
  grid-gap: 13px;
  grid-template-columns: 1fr 1fr;

  @media (max-width: 1740px) {
    grid-template-columns: auto;
  }
`;

const CiteStyledMainWrapper = styled(StyledMainWrapper)`
  max-width: 100% !important;
`;

const CardContainer = styled.div`
  width: 100%;
  border: 1.5px solid #d9deee;
  border-radius: 5px;
  box-shadow: 0 2px 5px 0px #e3e5ec;
  display: flex;
  flex-direction: column;
  h4 {
    margin: 0 !important;
  }
`;

const CustomStats = connectHits(IncidentStatsCard);

const StatsContainer = styled.div`
  width: 100%;
  margin-top: 1.5rem;
  h4 {
    margin: 0 !important;
  }
`;

const IncidentCite = ({ data, ...props }) => {
  if (!data) {
    return null;
  }

  const {
    allMongodbAiidprodIncidents: { group },
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
        {/* <Button
          onClick={(e) => {
            e.preventDefault();
            history.back();
          }}
        >
          Back To Discover App
        </Button> */}
      </div>
      <CiteStyledMainWrapper>
        <Container>
          <InstantSearch indexName="aiid-emergency" searchClient={searchClient}>
            <Row>
              <CardContainer className="card">
                <div className="card-header">
                  <h4>Suggested citation format</h4>
                </div>
                <div className="card-body">
                  <Citation nodes={nodes} incident_id={incident_id} />
                </div>
              </CardContainer>
            </Row>
            <Row className="mb-4">
              <StatsContainer>
                <CustomStats />
              </StatsContainer>
            </Row>
            <Row className="mb-4">
              <CardContainer className="card">
                <div className="card-header">
                  <h4>Reports</h4>
                </div>
                <div className="card-body">
                  <IncidentList group={group} />
                </div>
              </CardContainer>
            </Row>
            <Row className="mb-4">
              <CardContainer className="card">
                <ImageCarousel nodes={nodes} />
              </CardContainer>
            </Row>
            <Row className="mb-4">
              <CardContainer className="card">
                <div className="card-header">
                  <h4>Tools</h4>
                </div>
                <div className="card-body">
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
                </div>
              </CardContainer>
            </Row>
            <Row className="mb-4">
              <HitsContainer showDetails={true}>
                <Hits showDetails={true} />
              </HitsContainer>
              <Configure filters={`incident_id:${incident_id}`} />
            </Row>
          </InstantSearch>
        </Container>
      </CiteStyledMainWrapper>
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
            mongodb_id
          }
        }
      }
    }
  }
`;
