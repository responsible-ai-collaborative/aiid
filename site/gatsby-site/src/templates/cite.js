import React, { useEffect } from 'react';
import Helmet from 'react-helmet';

import { Button, Container, Row } from 'react-bootstrap';

import Layout from 'components/Layout';
import { StyledHeading, StyledMainWrapper } from 'components/styles/Docs';
import Citation from 'components/Citation';
import IncidentList from 'components/IncidentList';
import ImageCarousel from 'components/ImageCarousel';
import BibTex from 'components/BibTex';

import { getCanonicalUrl } from 'utils/getCanonicalUrl';

import { IncidentStatsCard, IncidentCard, NoResults } from '../../src/components/IncidentCards';
import styled from 'styled-components';
import { isAfter, isEqual } from 'date-fns';
import { useModal, CustomModal } from '../../src/components/useModal';
import TaxonomyForm from '../components/TaxonomyForm';

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

const IncidnetsReportsTitle = styled.div`
  margin-top: 4em;
  padding-bottom: 20px;
`;

const IncidentCite = ({ ...props }) => {
  if (!props?.pageContext?.incidentReports) {
    return null;
  }

  const {
    pageContext: { incidentReports, taxonomies },
  } = props;

  const scrollToIncidentCard = () => {
    if (props.location?.hash) {
      const incidentCard = document.getElementById(props.location?.hash?.split('#')[1]);

      incidentCard.scrollIntoView();
    }
  };

  useEffect(() => {
    if (props.location?.hash?.split('#')[1]) {
      scrollToIncidentCard();
    }
  }, []);

  // meta tags
  const incident_id = incidentReports[0].node.incident_id;

  const metaTitle = 'Incident ' + incident_id;

  const metaDescription = 'Citation record for Incident ' + incident_id;

  const canonicalUrl = getCanonicalUrl(incident_id);

  const sortIncidentsByDatePublished = (incidentReports) => {
    return [
      {
        edges: incidentReports.sort((a, b) => {
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

  const sortedGroup = sortIncidentsByDatePublished(incidentReports);

  const stats = {
    incidentId: incident_id,
    reportCount: incidentReports.length,
    incidentDate: incidentReports[0].node.incident_date,
  };

  const sortByDatePublished = (nodes) => {
    const sortedHits = nodes.sort((a, b) => {
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
    });

    return sortedHits;
  };

  const RenderIncidentCards = ({ nodes }) => {
    const sortedHits = sortByDatePublished(nodes);

    const authorsModal = useModal();

    const submittersModal = useModal();

    const flagReportModal = useModal();

    if (sortedHits.length === 0) {
      return (
        <NoResults>
          <p>Your search returned no results.</p>
          <p>Please clear your search in the search box above or the filters.</p>
        </NoResults>
      );
    }

    return (
      <>
        {sortedHits.map((hit) => (
          <IncidentCard
            key={hit.node.id}
            item={hit.node}
            authorsModal={authorsModal}
            submittersModal={submittersModal}
            flagReportModal={flagReportModal}
            showDetails={true}
            isCitePage={true}
          />
        ))}
        <CustomModal {...authorsModal} />
        <CustomModal {...submittersModal} />
        <CustomModal {...flagReportModal} />
      </>
    );
  };

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
          <Row>
            <CardContainer className="card">
              <div className="card-header">
                <h4>Suggested citation format</h4>
              </div>
              <div className="card-body">
                <Citation nodes={incidentReports} incident_id={incident_id} />
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
                <BibTex nodes={incidentReports} incident_id={incident_id} />
              </div>
            </CardContainer>
          </Row>
          {taxonomies.length > 0 &&
            taxonomies.map((t) => (
              <TaxonomyForm key={t.namespace} taxonomy={t} incidentId={incident_id} />
            ))}
          <Row className="mb-4">
            <CardContainer className="card">
              <ImageCarousel nodes={incidentReports} />
            </CardContainer>
          </Row>
          <IncidnetsReportsTitle>
            <div className={'titleWrapper'}>
              <StyledHeading>Incidents Reports</StyledHeading>
            </div>
          </IncidnetsReportsTitle>
          <Row className="mb-4">
            <HitsContainer showDetails={true}>
              <RenderIncidentCards nodes={incidentReports} />
            </HitsContainer>
          </Row>
        </Container>
      </CiteStyledMainWrapper>
    </Layout>
  );
};

export default IncidentCite;
