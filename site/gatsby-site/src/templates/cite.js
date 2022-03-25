import React from 'react';
import Helmet from 'react-helmet';
import { Button, Col, Container, Pagination, Row } from 'react-bootstrap';
import Layout from 'components/Layout';
import { StyledHeading } from 'components/styles/Docs';
import Citation from 'components/cite/Citation';
import ImageCarousel from 'components/cite/ImageCarousel';
import BibTex from 'components/BibTex';
import { getCanonicalUrl } from 'utils/getCanonicalUrl';
import styled from 'styled-components';
import { format, isAfter, isEqual } from 'date-fns';
import { useModal, CustomModal } from '../hooks/useModal';
import Timeline from 'components/visualizations/Timeline';
import IncidentStatsCard from 'components/cite/IncidentStatsCard';
import IncidentCard from 'components/cite/IncidentCard';
import Taxonomy from 'components/taxa/Taxonomy';

const CardContainer = styled.div`
  border: 1.5px solid #d9deee;
  border-radius: 5px;
  box-shadow: 0 2px 5px 0px #e3e5ec;
  h4 {
    margin: 0 !important;
  }
`;

const StatsContainer = styled.div`
  h4 {
    margin: 0 !important;
  }
`;

const IncidnetsReportsTitle = styled.div`
  padding-bottom: 20px;
`;

const sortIncidentsByDatePublished = (incidentReports) => {
  return incidentReports.sort((a, b) => {
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
};

function CitePage(props) {
  const {
    pageContext: { incidentReports, taxonomies, nextIncident, prevIncident },
  } = props;

  // meta tags
  const { incident_id, incident_date } = incidentReports[0].node;

  const metaTitle = 'Incident ' + incident_id;

  const metaDescription = 'Citation record for Incident ' + incident_id;

  const canonicalUrl = getCanonicalUrl(incident_id);

  const sortedReports = sortIncidentsByDatePublished(incidentReports);

  const authorsModal = useModal();

  const submittersModal = useModal();

  const flagReportModal = useModal();

  const stats = {
    incidentId: incident_id,
    reportCount: incidentReports.length,
    incidentDate: incidentReports[0].node.incident_date,
  };

  const timeline = sortedReports.map(({ node: { date_published, title, mongodb_id } }) => ({
    date_published,
    title,
    mongodb_id,
  }));

  timeline.push({
    date_published: stats.incidentDate,
    title: 'Incident Occurrence',
    mongodb_id: 0,
    isOccurrence: true,
  });

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

      <Container>
        <Row>
          <Col>
            <CardContainer className="card">
              <div className="card-header">
                <h4>Suggested citation format</h4>
              </div>
              <div className="card-body">
                <Citation nodes={incidentReports} incident_id={incident_id} />
              </div>
            </CardContainer>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col>
            <StatsContainer>
              <IncidentStatsCard {...stats} />
            </StatsContainer>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col>
            <CardContainer className="card">
              <div className="card-header">
                <h4>Reports Timeline</h4>
              </div>
              <div className="card-body">
                <Timeline data={timeline} />
              </div>
            </CardContainer>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col>
            <CardContainer className="card">
              <div className="card-header">
                <h4>Tools</h4>
              </div>
              <div className="card-body">
                <Button
                  variant="outline-primary"
                  className="me-2"
                  href={`/apps/submit?incident_id=${incident_id}&incident_date=${incident_date}&date_downloaded=${format(
                    new Date(),
                    'yyyy-MM-dd'
                  )}`}
                >
                  New Report
                </Button>
                <Button variant="outline-primary" className="me-2" href={'/summaries/incidents'}>
                  All Incidents
                </Button>
                <Button
                  variant="outline-primary"
                  className="me-2"
                  href={'/apps/discover?incident_id=' + incident_id}
                >
                  Discover
                </Button>
                <BibTex nodes={incidentReports} incident_id={incident_id} />
              </div>
            </CardContainer>
          </Col>
        </Row>

        {taxonomies.length > 0 && (
          <Row id="taxa-area">
            <Col>
              {taxonomies.map((t) => (
                <Taxonomy key={t.namespace} taxonomy={t} incidentId={incident_id} />
              ))}
            </Col>
          </Row>
        )}

        <Row className="mt-4">
          <Col>
            <CardContainer className="card">
              <ImageCarousel nodes={incidentReports} />
            </CardContainer>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col>
            <IncidnetsReportsTitle>
              <div className={'titleWrapper'}>
                <StyledHeading>Incidents Reports</StyledHeading>
              </div>
            </IncidnetsReportsTitle>
          </Col>
        </Row>

        {sortedReports.map((hit) => (
          <Row className="mb-4" key={hit.node.id}>
            <Col>
              <IncidentCard
                item={hit.node}
                authorsModal={authorsModal}
                submittersModal={submittersModal}
                flagReportModal={flagReportModal}
                showDetails={true}
              />
            </Col>
          </Row>
        ))}

        <Pagination className="justify-content-between">
          <Pagination.Item href={`/cite/${prevIncident}`} disabled={!prevIncident}>
            ‹ Previous Incident
          </Pagination.Item>
          <Pagination.Item href={`/cite/${nextIncident}`} disabled={!nextIncident}>
            Next Incident ›
          </Pagination.Item>
        </Pagination>

        <CustomModal {...authorsModal} />
        <CustomModal {...submittersModal} />
        <CustomModal {...flagReportModal} />
      </Container>
    </Layout>
  );
}

export default CitePage;
