import React, { useEffect, useMemo, useState } from 'react';
import { Spinner } from 'flowbite-react';
import AiidHelmet from 'components/AiidHelmet';
import Layout from 'components/Layout';
import Citation from 'components/cite/Citation';
import ImageCarousel from 'components/cite/ImageCarousel';
import BibTex from 'components/BibTex';
import { getCanonicalUrl } from 'utils/getCanonicalUrl';
import { format, isAfter, isEqual } from 'date-fns';
import { useModal, CustomModal } from '../hooks/useModal';
import Timeline from 'components/visualizations/Timeline';
import IncidentStatsCard from 'components/cite/IncidentStatsCard';
import IncidentCard from 'components/cite/IncidentCard';
import Taxonomy from 'components/taxa/Taxonomy';
import { useUserContext } from 'contexts/userContext';
import SimilarIncidents from 'components/cite/SimilarIncidents';
import { Trans, useTranslation } from 'react-i18next';
import Card from '../elements/Card';
import Button from '../elements/Button';
import Container from '../elements/Container';
import Row from '../elements/Row';
import Col from '../elements/Col';
import Pagination from '../elements/Pagination';
import SocialShareButtons from 'components/ui/SocialShareButtons';
import { useLocalization } from 'gatsby-theme-i18n';
import useLocalizePath from 'components/i18n/useLocalizePath';
import { useMutation } from '@apollo/client';
import { UPSERT_SUBSCRIPTION } from '../graphql/subscriptions';
import useToastContext, { SEVERITY } from '../hooks/useToast';
import Link from 'components/ui/Link';
import { graphql } from 'gatsby';
import { getTaxonomies, getTranslatedReports } from 'utils/cite';
import { computeEntities } from 'utils/entities';
import AllegedEntities from 'components/entities/AllegedEntities';

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
      nextIncident,
      prevIncident,
      nlp_similar_incidents,
      editor_similar_incidents,
      editor_dissimilar_incidents,
    },
    data: {
      allMongodbAiidprodTaxa,
      mongodbAiidprodClassifications,
      mongodbAiidprodResources,
      allMongodbAiidprodReports,
      allMongodbTranslationsReportsEs,
      allMongodbTranslationsReportsEn,
      incident,
    },
  } = props;

  const { isRole, user } = useUserContext();

  const { i18n, t } = useTranslation();

  const { locale } = useLocalization();

  const localizePath = useLocalizePath();

  // meta tags

  const defaultIncidentTitle = t('Citation record for Incident {{id}}', {
    id: incident.incident_id,
  });

  const metaTitle = `Incident ${incident.incident_id}: ${incident.title}`;

  const metaDescription = incident.description;

  const canonicalUrl = getCanonicalUrl(incident.incident_id);

  const incidentReports = getTranslatedReports({
    allMongodbAiidprodReports,
    translations: { en: allMongodbTranslationsReportsEn, es: allMongodbTranslationsReportsEs },
    locale,
  });

  const sortedReports = sortIncidentsByDatePublished(incidentReports);

  const metaImage = sortedReports[0].image_url;

  const authorsModal = useModal();

  const submittersModal = useModal();

  const flagReportModal = useModal();

  const addToast = useToastContext();

  const timeline = sortedReports.map(({ date_published, title, mongodb_id, report_number }) => ({
    date_published,
    title,
    mongodb_id,
    report_number,
  }));

  timeline.push({
    date_published: incident.date,
    title: 'Incident Occurrence',
    mongodb_id: 0,
    isOccurrence: true,
  });

  const taxonomies = useMemo(
    () =>
      getTaxonomies({
        allMongodbAiidprodTaxa,
        mongodbAiidprodClassifications,
        mongodbAiidprodResources,
      }),
    []
  );

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

  const [subscribeToNewReportsMutation, { loading: subscribing }] =
    useMutation(UPSERT_SUBSCRIPTION);

  const subscribeToNewReports = async () => {
    if (isRole('subscriber')) {
      try {
        await subscribeToNewReportsMutation({
          variables: {
            query: {
              type: 'incident',
              userId: { userId: user.id },
              incident_id: { incident_id: incident.incident_id },
            },
            subscription: {
              type: 'incident',
              userId: {
                link: user.id,
              },
              incident_id: {
                link: incident.incident_id,
              },
            },
          },
        });

        addToast({
          message: (
            <>
              {t(`You have successfully subscribed to updates on incident ${incident.incident_id}`)}
            </>
          ),
          severity: SEVERITY.success,
        });
      } catch (e) {
        console.log(e);
        addToast({
          message: <label>{t(e.error || 'An unknown error has ocurred')}</label>,
          severity: SEVERITY.danger,
        });
      }
    } else {
      addToast({
        message: (
          <Trans i18n={i18n}>
            Please <Link to={localizePath({ path: '/login', language: locale })}>log in</Link> to
            subscribe
          </Trans>
        ),
        severity: SEVERITY.success,
      });
    }
  };

  const entities = computeEntities({ incidents: [incident] });

  return (
    <Layout {...props}>
      <AiidHelmet {...{ metaTitle, metaDescription, canonicalUrl, metaImage }}>
        <meta property="og:type" content="website" />
      </AiidHelmet>

      <div className={'titleWrapper'}>
        <h1 className="tw-styled-heading">{locale == 'en' ? metaTitle : defaultIncidentTitle}</h1>
        <SocialShareButtons
          metaTitle={metaTitle}
          canonicalUrl={canonicalUrl}
          page="cite"
        ></SocialShareButtons>
      </div>

      <Container>
        <Row>
          <Col>
            <Card className="border-1.5 border-border-light-gray rounded-5px shadow-card mt-6">
              <Card.Header className="items-center justify-between">
                <h4 className="m-0">
                  <Trans ns="entities">Entities</Trans>
                </h4>
                <Link to="/entities">
                  <Trans ns="entities">View all entities</Trans>
                </Link>
              </Card.Header>
              <Card.Body className="block" data-cy="alleged-entities">
                <AllegedEntities entities={entities} />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card
              data-cy="citation"
              className="border-1.5 border-border-light-gray rounded-5px shadow-card mt-6"
            >
              <Card.Header className="items-center justify-between">
                <h4 className="m-0">
                  <Trans>Suggested citation format</Trans>
                </h4>
              </Card.Header>
              <Card.Body className="block">
                <Citation
                  nodes={incidentReports}
                  incidentDate={incident.date}
                  incident_id={incident.incident_id}
                  editors={incident.editors}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-6">
          <Col>
            <div data-cy={'incident-stats'}>
              <IncidentStatsCard
                {...{
                  incidentId: incident.incident_id,
                  reportCount: incidentReports.length,
                  incidentDate: incident.date,
                  editors: incident.editors.join(', '),
                }}
              />
            </div>
          </Col>
        </Row>

        <Row className="mt-6">
          <Col>
            <Card className="shadow-card">
              <Card.Header className="items-center justify-between">
                <h4>
                  <Trans>Reports Timeline</Trans>
                </h4>
              </Card.Header>
              <Card.Body>
                <Timeline data={timeline} />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-6">
          <Col>
            <Card className="shadow-card">
              <Card.Header className="items-center justify-between">
                <h4>
                  <Trans>Tools</Trans>
                </h4>
              </Card.Header>
              <Card.Body className="flex-row">
                <Button variant="outline-primary" className="mr-2" onClick={subscribeToNewReports}>
                  <div className="flex gap-2 items-center">
                    {subscribing && (
                      <div className="mr-2">
                        <Spinner size="sm" />
                      </div>
                    )}
                    <Trans>Notify Me of Updates</Trans>
                  </div>
                </Button>
                <Button
                  variant="outline-primary"
                  className="mr-2"
                  href={`/apps/submit?incident_id=${incident.incident_id}&date_downloaded=${format(
                    new Date(),
                    'yyyy-MM-dd'
                  )}`}
                >
                  <Trans>New Report</Trans>
                </Button>
                <Button variant="outline-primary" className="mr-2" href={'/summaries/incidents'}>
                  <Trans>All Incidents</Trans>
                </Button>
                <Button
                  variant="outline-primary"
                  className="mr-2"
                  href={'/apps/discover?incident_id=' + incident.incident_id}
                >
                  <Trans>Discover</Trans>
                </Button>
                {isRole('incident_editor') && (
                  <Button
                    variant="outline-primary"
                    className="mr-2"
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
              </Card.Body>
            </Card>
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

        <Row className="mt-6">
          <Col>
            <Card>
              <ImageCarousel nodes={incidentReports} />
            </Card>
          </Col>
        </Row>

        <Row className="mt-6">
          <Col>
            <div className="pb-5">
              <div className={'titleWrapper'}>
                <h1 className="tw-styled-heading">
                  <Trans>Incidents Reports</Trans>
                </h1>
              </div>
            </div>
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

        <Pagination className="justify-between">
          <Pagination.Item
            href={localizePath({ path: `/cite/${prevIncident}` })}
            disabled={!prevIncident}
          >
            ‹ <Trans>Previous Incident</Trans>
          </Pagination.Item>
          <Pagination.Item
            href={localizePath({ path: `/cite/${nextIncident}` })}
            disabled={!nextIncident}
          >
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

export const query = graphql`
  query CitationPageQuery(
    $incident_id: Int
    $report_numbers: [Int]
    $translate_es: Boolean!
    $translate_en: Boolean!
  ) {
    mongodbAiidprodResources(
      classifications: { Publish: { eq: true } }
      incident_id: { eq: $incident_id }
    ) {
      id
      incident_id
      notes
      classifications {
        Datasheets_for_Datasets
        Publish
      }
    }
    mongodbAiidprodClassifications(
      classifications: { Publish: { eq: true } }
      incident_id: { eq: $incident_id }
    ) {
      incident_id
      id
      namespace
      notes
      classifications {
        Annotation_Status
        Annotator
        Ending_Date
        Beginning_Date
        Full_Description
        Intent
        Location
        Named_Entities
        Near_Miss
        Quality_Control
        Reviewer
        Severity
        Short_Description
        Technology_Purveyor
        AI_Applications
        AI_System_Description
        AI_Techniques
        Data_Inputs
        Financial_Cost
        Harm_Distribution_Basis
        Harm_Type
        Infrastructure_Sectors
        Laws_Implicated
        Level_of_Autonomy
        Lives_Lost
        Nature_of_End_User
        Physical_System
        Problem_Nature
        Public_Sector_Deployment
        Relevant_AI_functions
        Sector_of_Deployment
        System_Developer
        Publish
      }
    }
    allMongodbAiidprodTaxa {
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
          long_description
          weight
          short_description
          render_as
        }
      }
    }
    allMongodbAiidprodReports(filter: { report_number: { in: $report_numbers } }) {
      nodes {
        submitters
        date_published
        report_number
        title
        url
        image_url
        cloudinary_id
        source_domain
        mongodb_id
        text
        authors
        epoch_date_submitted
        language
      }
    }
    allMongodbTranslationsReportsEs(filter: { report_number: { in: $report_numbers } })
      @include(if: $translate_es) {
      nodes {
        title
        text
        report_number
      }
    }
    allMongodbTranslationsReportsEn(filter: { report_number: { in: $report_numbers } })
      @include(if: $translate_en) {
      nodes {
        title
        text
        report_number
      }
    }
    incident: mongodbAiidprodIncidents(incident_id: { eq: $incident_id }) {
      incident_id
      reports
      title
      description
      date
      editors
      flagged_dissimilar_incidents
      Alleged_developer_of_AI_system
      Alleged_deployer_of_AI_system
      Alleged_harmed_or_nearly_harmed_parties
    }
  }
`;

export default CitePage;
