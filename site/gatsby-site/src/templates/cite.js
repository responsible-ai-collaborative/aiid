import React, { useState, useEffect } from 'react';
import AiidHelmet from 'components/AiidHelmet';
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
import { useUserContext } from 'contexts/userContext';
import TsneVisualization from 'components/cite/TsneVisualization';
import { LocalizedLink } from 'gatsby-theme-i18n';
import SimilarIncidents from 'components/cite/SimilarIncidents';
import { Trans, useTranslation } from 'react-i18next';

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
    const dateA = new Date(a.date_published);

    const dateB = new Date(b.date_published);

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
    pageContext: {
      incident,
      incidentReports,
      taxonomies,
      nextIncident,
      prevIncident,
      spatialIncidents,
      nlp_similar_incidents,
      editor_similar_incidents,
      editor_dissimilar_incidents,
    },
  } = props;

  const { isRole, user } = useUserContext();

  const { t } = useTranslation();

  // meta tags

  const metaTitle = t('Incident {{id}}', { id: incident.incident_id });

  const metaDescription = t('Citation record for Incident {{id}}', { id: incident.incident_id });

  const canonicalUrl = getCanonicalUrl(incident.incident_id);

  const sortedReports = sortIncidentsByDatePublished(incidentReports);

  const metaImage = sortedReports[0].image_url;

  const authorsModal = useModal();

  const submittersModal = useModal();

  const flagReportModal = useModal();

  const timeline = sortedReports.map(({ date_published, title, mongodb_id }) => ({
    date_published,
    title,
    mongodb_id,
  }));

  timeline.push({
    date_published: incident.date,
    title: 'Incident Occurrence',
    mongodb_id: 0,
    isOccurrence: true,
  });

  const [taxonomiesList, setTaxonomiesList] = useState(
    taxonomies.map((t) => ({ ...t, canEdit: false }))
  );

  useEffect(() => {
    setTaxonomiesList((list) =>
      list.map((t) => ({
        ...t,
        canEdit:
          isRole('taxonomy_editor') || isRole('taxonomy_editor_' + t.namespace.toLowerCase()),
      }))
    );
  }, [user]);

  return (
    <Layout {...props}>
      <AiidHelmet {...{ metaTitle, metaDescription, canonicalUrl, metaImage }}>
        <meta property="og:type" content="website" />
      </AiidHelmet>

      <div className={'titleWrapper'}>
        <StyledHeading>{metaDescription}</StyledHeading>
      </div>

      <Container>
        <Row>
          <Col>
            <CardContainer className="card" data-cy="citation">
              <div className="card-header">
                <h4>
                  <Trans>Suggested citation format</Trans>
                </h4>
              </div>
              <div className="card-body">
                <Citation
                  nodes={incidentReports}
                  incidentDate={incident.date}
                  incident_id={incident.incident_id}
                  editors={incident.editors}
                />
              </div>
            </CardContainer>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col>
            <StatsContainer data-cy={'incident-stats'}>
              <IncidentStatsCard
                {...{
                  incidentId: incident.incident_id,
                  reportCount: incidentReports.length,
                  incidentDate: incident.date,
                  editors: incident.editors.join(', '),
                }}
              />
            </StatsContainer>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col>
            <CardContainer className="card">
              <div className="card-header">
                <h4>
                  <Trans>Reports Timeline</Trans>
                </h4>
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
                <h4>
                  <Trans>Tools</Trans>
                </h4>
              </div>
              <div className="card-body">
                <Button
                  variant="outline-primary"
                  className="me-2"
                  href={`/apps/submit?incident_id=${incident.incident_id}&date_downloaded=${format(
                    new Date(),
                    'yyyy-MM-dd'
                  )}`}
                >
                  <Trans>New Report</Trans>
                </Button>
                <Button variant="outline-primary" className="me-2" href={'/summaries/incidents'}>
                  <Trans>All Incidents</Trans>
                </Button>
                <Button
                  variant="outline-primary"
                  className="me-2"
                  href={'/apps/discover?incident_id=' + incident.incident_id}
                >
                  <Trans>Discover</Trans>
                </Button>
                {isRole('incident_editor') && (
                  <Button
                    variant="outline-primary"
                    className="me-2"
                    href={'/incidents/edit?incident_id=' + incident.incident_id}
                  >
                    Edit Incident
                  </Button>
                )}
                <BibTex
                  nodes={incidentReports}
                  incidentDate={incident.date}
                  incident_id={incident.incident_id}
                  editors={incident.editors}
                />
              </div>
            </CardContainer>
          </Col>
        </Row>

        {taxonomies.length > 0 && (
          <Row id="taxa-area">
            <Col>
              {taxonomiesList
                .filter((t) => t.canEdit || t.classificationsArray.length > 0)
                .map((t) => (
                  <Taxonomy
                    key={t.namespace}
                    taxonomy={t}
                    incidentId={incident.incident_id}
                    canEdit={t.canEdit}
                  />
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
                <StyledHeading>
                  <Trans>Incidents Reports</Trans>
                </StyledHeading>
              </div>
            </IncidnetsReportsTitle>
          </Col>
        </Row>

        {sortedReports.map((report) => (
          <Row className="mb-4" key={report.report_number}>
            <Col>
              <IncidentCard
                item={report}
                authorsModal={authorsModal}
                submittersModal={submittersModal}
                flagReportModal={flagReportModal}
              />
            </Col>
          </Row>
        ))}

        <SimilarIncidents
          nlp_similar_incidents={nlp_similar_incidents}
          editor_similar_incidents={editor_similar_incidents}
          editor_dissimilar_incidents={editor_dissimilar_incidents}
          flagged_dissimilar_incidents={incident.flagged_dissimilar_incidents}
          parentIncident={incident}
        />

        {spatialIncidents ? (
          <>
            <StyledHeading>
              <Trans>This Incident in Semantic Space</Trans>
            </StyledHeading>
            <p>
              <Trans>
                The visualization below plots incidents closer together according to the similarity
                of their reports texts, as identified through
              </Trans>{' '}
              <LocalizedLink to="/blog/using-ai-to-connect-ai-incidents">
                <Trans>our natural-language processing system</Trans>
              </LocalizedLink>
              .
            </p>
            <TsneVisualization incident={incident} spatialIncidents={spatialIncidents} />
          </>
        ) : (
          <p>No Spatial incidents</p>
        )}

        <Pagination className="justify-content-between">
          <Pagination.Item href={`/cite/${prevIncident}`} disabled={!prevIncident}>
            ‹ <Trans>Previous Incident</Trans>
          </Pagination.Item>
          <Pagination.Item href={`/cite/${nextIncident}`} disabled={!nextIncident}>
            <Trans>Next Incident</Trans> ›
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
