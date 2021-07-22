import React, { useState, useEffect } from 'react';
import Helmet from 'react-helmet';
import { graphql } from 'gatsby';

import { Button, Container, Row, OverlayTrigger, Tooltip } from 'react-bootstrap';

import Layout from 'components/Layout';
import { StyledHeading, StyledMainWrapper } from 'components/styles/Docs';
import Citation from 'components/Citation';
import IncidentList from 'components/IncidentList';
import ImageCarousel from 'components/ImageCarousel';
import BibTex from 'components/BibTex';

import { getCanonicalUrl } from 'utils/getCanonicalUrl';

import { InstantSearch, Configure } from 'react-instantsearch-dom';
import { searchClient, Hits, IncidentStatsCard, indexName } from '../../pages/apps/discover';
import styled from 'styled-components';
import { isAfter, isEqual } from 'date-fns';

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

const StatsContainer = styled.div`
  width: 100%;
  margin-top: 1.5rem;
  h4 {
    margin: 0 !important;
  }
`;

const ClassificationContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 100%;
`;

const Field = styled.div`
  width: 20%;
  border-right: 2.5px solid #d9deee;
  margin-right: 1em;
  color: grey;
  font-weight: 700;
`;

const Value = styled.div`
  width: 80%;
`;

const TaxaCardHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  p {
    margin: 0;
  }
`;

const IncidnetsReportsTitle = styled.div`
  margin-top: 4em;
  padding-bottom: 20px;
`;

const IncidentCite = ({ data, ...props }) => {
  if (!data) {
    return null;
  }

  const {
    allMongodbAiidprodIncidents: { group },
    allMongodbAiidprodClassifications,
    allMongodbAiidprodTaxa,
  } = data;

  const [hasScrolled, setHasScrolled] = useState(false);

  const [showAllClassifications, setShowAllClassifications] = useState({});

  useEffect(() => {
    let initShowAllClassifications = {};

    if (allMongodbAiidprodClassifications.nodes.length > 0) {
      allMongodbAiidprodClassifications.nodes.forEach((c) => {
        initShowAllClassifications[c.namespace] = false;
      });
      setShowAllClassifications(initShowAllClassifications);
    }
  }, []);

  const scrollToIncidentCard = () => {
    if (props.location?.hash) {
      const incidentCard = document.getElementById(props.location?.hash?.split('#')[1]);

      if (incidentCard && !hasScrolled) {
        incidentCard.scrollIntoView();
        setHasScrolled(true);
      }
    }
  };

  const getClassificationsArray = (classificationObj, taxonomy) => {
    const taxaFieldsArray = taxonomy.field_list.sort((a, b) => b.weight - a.weight);

    const array = [];

    const getStringForValue = (value) => {
      switch (typeof value) {
        case 'object':
          return value.join(', ');

        case 'boolean':
          return value ? 'Yes' : 'No';

        default:
          return value;
      }
    };

    taxaFieldsArray.forEach((field) => {
      const c = classificationObj[field.short_name.split(' ').join('_')];

      const value = getStringForValue(c);

      if (field.public !== false && value !== undefined && value !== '' && value.length > 0) {
        array.push({
          name: field.short_name,
          value: getStringForValue(value),
          weight: field.weight,
          shortDescription: field.short_description,
        });
      }
    });

    return array;
  };

  // meta tags
  const reports = group[0]['edges'];

  const incident_id = reports[0]['node']['incident_id'];

  const metaTitle = 'Incident ' + incident_id;

  const metaDescription = 'Citation record for Incident ' + incident_id;

  const canonicalUrl = getCanonicalUrl(incident_id);

  const nodes = group[0]['edges'];

  const sortIncidentsByDatePublished = (group) => {
    return [
      {
        edges: group[0].edges.sort((a, b) => {
          const dateA = new Date(a.node.date_published);

          const dateB = new Date(b.node.date_published);

          if (isEqual(dateA, dateB)) {
            return 0;
          }
          if (isAfter(dateA, dateB)) {
            return 1;
          }
          if (isAfter(dateB, dateA)) {
            return -1;
          }
        }),
      },
    ];
  };

  const sortedGroup = sortIncidentsByDatePublished(group);

  const stats = {
    incidentId: nodes[0].node.incident_id,
    reportCount: nodes.length,
    incidentDate: nodes[0].node.incident_date,
  };

  const taxonomies = [];

  if (allMongodbAiidprodClassifications.nodes.length > 0) {
    allMongodbAiidprodClassifications.nodes.forEach((c) => {
      allMongodbAiidprodTaxa.nodes.forEach((t) => {
        if (c.namespace === t.namespace) {
          taxonomies.push({
            namespace: c.namespace,
            classificationsArray: getClassificationsArray(c.classifications, t),
            showAllClassifications: false,
          });
        }
      });
    });
  }

  const toggleShowAllClassifications = (namespace) => {
    setShowAllClassifications({
      ...showAllClassifications,
      [namespace]: !showAllClassifications[namespace],
    });
  };

  const renderTooltip = (props, displayText) => (
    <Tooltip id="button-tooltip" {...props}>
      {displayText}
    </Tooltip>
  );

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
      <CiteStyledMainWrapper>
        <Container>
          <InstantSearch indexName={indexName} searchClient={searchClient}>
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
                <IncidentStatsCard {...stats} />
              </StatsContainer>
            </Row>
            <Row className="mb-4">
              <CardContainer className="card">
                <div className="card-header">
                  <h4>Reports</h4>
                </div>
                <div className="card-body">
                  <IncidentList group={sortedGroup} />
                </div>
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
                    href={'/apps/discover?incident_id=' + incident_id}
                  >
                    Discover
                  </Button>
                  <BibTex nodes={nodes} incident_id={incident_id} />
                </div>
              </CardContainer>
            </Row>
            {taxonomies.length > 0 &&
              taxonomies.map((t) => (
                <Row key={t.namespace} className="mb-4">
                  <CardContainer className="card">
                    <TaxaCardHeader className="card-header">
                      <h4>{`${t.namespace} Taxonomy Classifications`}</h4>
                      <a href={`/taxonomy/${t.namespace.toLowerCase()}`}>Taxonomy Details</a>
                    </TaxaCardHeader>
                    {t.classificationsArray &&
                      t.classificationsArray
                        .filter((field) => {
                          if (showAllClassifications[t.namespace]) return true;
                          if (!showAllClassifications[t.namespace] && field.weight >= 50) {
                            return true;
                          }
                          return false;
                        })
                        .map((field) => (
                          <ClassificationContainer key={field.name} className="card-body">
                            <Field>
                              <OverlayTrigger
                                placement="left"
                                delay={{ show: 100, hide: 400 }}
                                overlay={(e) => renderTooltip(e, field.shortDescription)}
                              >
                                <p>{field.name}</p>
                              </OverlayTrigger>
                            </Field>
                            <Value>{field.value}</Value>
                          </ClassificationContainer>
                        ))}
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm btn-block assignment-button"
                      onClick={() => toggleShowAllClassifications(t.namespace)}
                    >
                      {`Show ${
                        showAllClassifications[t.namespace] ? 'Fewer' : 'All'
                      } Classifications`}
                    </button>
                  </CardContainer>
                </Row>
              ))}
            <Row className="mb-4">
              <CardContainer className="card">
                <ImageCarousel nodes={nodes} />
              </CardContainer>
            </Row>
            <IncidnetsReportsTitle>
              <div className={'titleWrapper'}>
                <StyledHeading>Incidents Reports</StyledHeading>
              </div>
            </IncidnetsReportsTitle>
            <Row className="mb-4">
              <HitsContainer showDetails={true}>
                <Hits
                  showDetails={true}
                  sortByDatePublished={true}
                  scrollTo={() => scrollToIncidentCard()}
                />
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
  query ($incident_id: Int!, $taxonomy_namespace_array: [String!]!) {
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

    allMongodbAiidprodClassifications(
      filter: { incident_id: { eq: $incident_id }, classifications: { Publish: { eq: true } } }
    ) {
      ...ClassificationFields
    }

    allMongodbAiidprodTaxa(filter: { namespace: { in: $taxonomy_namespace_array } }) {
      nodes {
        id
        namespace
        weight
        description
        field_list {
          public
          display_type
          long_name
          short_name
          weight
          short_description
        }
      }
    }
  }
`;
