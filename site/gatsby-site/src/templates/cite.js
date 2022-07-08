import React, { useEffect, useState } from 'react';
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
import { useUserContext } from 'contexts/userContext';
import TSNE from 'tsne-js';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

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

const TsneVisualization = styled.div`
  height: 1000px;
  width: 1000px;
  display: inline;
  position: relative;
  overflow: hidden;
  background: #ccc;
  > * {
    color: inherit;
    position: absolute;
    font-size: 40%;
    height: 2em;
    width: 2em;
    padding-left: 2px;
    padding-right: 2px;
    border-radius: 50%;
    margin-left: -1em;
    margin-top: -1em;
    background: rgba(240, 240, 240, 0.8);
    z-index: 1;
    text-align: center;
    line-height: 2em;
    box-shadow: 0px 0px 2px 2px rgba(0, 0, 0, 0.25);
    transition: background 0.25s;
  }
  > *:hover:not(.current) {
    background: #ddd;
    z-index: 3;
  }
  > *.current {
    background: cyan;
    z-index: 2;
  }
`;

const TransformWrapperWrapper = styled.div`
  > * {
    height: 90vh;
  }
  > *,
  > * > * {
    width: 100%;
  }
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
    pageContext: { incident, incidentReports, taxonomies, nextIncident, prevIncident },
  } = props;

  const { isRole } = useUserContext();

  // meta tags

  const metaTitle = 'Incident ' + incident.incident_id;

  const metaDescription = 'Citation record for Incident ' + incident.incident_id;

  const canonicalUrl = getCanonicalUrl(incident.incident_id);

  const sortedReports = sortIncidentsByDatePublished(incidentReports);

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

  const [spacialIncidents, setSpacialIncidents] = useState(null);

  const [currentSpacialIncident, setCurrentSpacialIncident] = useState(null);

  useEffect(() => {
    fetch(
      'https://raw.githubusercontent.com/responsible-ai-collaborative/nlp-lambdas/main/inference/db_state/state.csv'
    )
      .then((res) => res.text())
      .then((text) => {
        const lines = text
          .split('\n')
          .slice(1)
          .filter((line) => line.length > 2);

        const embeddings = lines.map((line) => JSON.parse(line.split('"')[1]));

        const ids = lines.map((line) => line.split(',')[0]);

        const model = new TSNE({
          dim: 2,
          perplexity: 30.0,
          earlyExaggeration: 4.0,
          learningRate: 100.0,
          nIter: 100,
          metric: 'euclidean',
        });

        // inputData is a nested array which can be converted into an ndarray
        // alternatively, it can be an array of coordinates (second argument should be specified as 'sparse')
        model.init({
          data: embeddings,
          type: 'dense',
        });

        // `error`,  `iter`: final error and iteration number
        // note: computation-heavy action happens here
        const [err, iter] = model.run();

        if (err) {
          console.error(err, iter);
        }

        // `outputScaled` is `output` scaled to a range of [-1, 1]
        const outputScaled = model.getOutputScaled();

        setSpacialIncidents(
          outputScaled.map((array, i) => {
            const spacialIncident = {
              incident_id: ids[i],
              x: array[0],
              y: array[1],
            };

            if (ids[i] == incident.incident_id) {
              setCurrentSpacialIncident(spacialIncident);
            }
            return spacialIncident;
          })
        );
      });
  }, []);

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
            <CardContainer className="card" data-cy="citation">
              <div className="card-header">
                <h4>Suggested citation format</h4>
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
                  href={`/apps/submit?incident_id=${incident.incident_id}&date_downloaded=${format(
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
                  href={'/apps/discover?incident_id=' + incident.incident_id}
                >
                  Discover
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
              {taxonomies.map((t) => {
                const canEdit =
                  isRole('taxonomy_editor') ||
                  isRole('taxonomy_editor_' + t.namespace.toLowerCase());

                return canEdit || t.classificationsArray.length > 0 ? (
                  <Taxonomy
                    key={t.namespace}
                    taxonomy={t}
                    incidentId={incident.incident_id}
                    canEdit={canEdit}
                  />
                ) : null;
              })}
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

        <Pagination className="justify-content-between">
          <Pagination.Item href={`/cite/${prevIncident}`} disabled={!prevIncident}>
            ‹ Previous Incident
          </Pagination.Item>
          <Pagination.Item href={`/cite/${nextIncident}`} disabled={!nextIncident}>
            Next Incident ›
          </Pagination.Item>
        </Pagination>

        {spacialIncidents && (
          <TransformWrapperWrapper>
            <TransformWrapper
              initialScale={3}
              initialPositionX={
                -1500 - 1500 * (currentSpacialIncident.x || 0) + Math.min(500, window.innerWidth)
              }
              initialPositionY={
                -1500 - 1500 * (currentSpacialIncident.y || 0) + Math.min(500, window.innerHeight)
              }
            >
              <TransformComponent>
                <TsneVisualization>
                  {spacialIncidents.map((spacialIncident) => (
                    <a
                      id={'spacial-incident-' + spacialIncident.incident_id}
                      key={spacialIncident.incident_id}
                      href={'/cite/' + spacialIncident.incident_id}
                      style={{
                        top: `calc(50% + 48% * ${spacialIncident.y})`,
                        left: `calc(50% + 48% * ${spacialIncident.x})`,
                      }}
                      className={
                        spacialIncident.incident_id == incident.incident_id ? 'current' : ''
                      }
                    >
                      {spacialIncident.incident_id}
                    </a>
                  ))}
                </TsneVisualization>
              </TransformComponent>
            </TransformWrapper>
          </TransformWrapperWrapper>
        )}

        <CustomModal {...authorsModal} />
        <CustomModal {...submittersModal} />
        <CustomModal {...flagReportModal} />
      </Container>
    </Layout>
  );
}

export default CitePage;
