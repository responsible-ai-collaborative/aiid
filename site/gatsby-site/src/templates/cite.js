import React, { useEffect, useMemo, useState, useRef } from 'react';
import { Badge, Spinner } from 'flowbite-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPlus, faEdit, faSearch } from '@fortawesome/free-solid-svg-icons';
import { CloudinaryImage } from '@cloudinary/base';
import { Trans, useTranslation } from 'react-i18next';
import { useLocalization } from 'gatsby-theme-i18n';
import { useMutation } from '@apollo/client';
import { graphql } from 'gatsby';

import AiidHelmet from 'components/AiidHelmet';
import Layout from 'components/Layout';
import Citation from 'components/cite/Citation';
import ImageCarousel from 'components/cite/ImageCarousel';
import BibTex from 'components/BibTex';
import { format, isAfter, isEqual } from 'date-fns';
import Timeline from '../components/visualizations/Timeline';
import IncidentStatsCard from '../components/cite/IncidentStatsCard';
import ReportCard from '../components/reports/ReportCard';
import Taxonomy from '../components/taxa/Taxonomy';
import { useUserContext } from '../contexts/userContext';
import SimilarIncidents from '../components/cite/SimilarIncidents';
import Card from '../elements/Card';
import Button from '../elements/Button';
import Container from '../elements/Container';
import Row from '../elements/Row';
import Col from '../elements/Col';
import Pagination from '../elements/Pagination';
import SocialShareButtons from '../components/ui/SocialShareButtons';
import useLocalizePath from '../components/i18n/useLocalizePath';
import { UPSERT_SUBSCRIPTION } from '../graphql/subscriptions';
import useToastContext, { SEVERITY } from '../hooks/useToast';
import Link from 'components/ui/Link';
import { getTaxonomies, getTranslatedReports } from 'utils/cite';
import { computeEntities, RESPONSE_TAG } from 'utils/entities';
import AllegedEntities from 'components/entities/AllegedEntities';
import { SUBSCRIPTION_TYPE } from 'utils/subscriptions';
import config from '../../config';
import VariantList from 'components/variants/VariantList';
import { isCompleteReport } from 'utils/variants';
import { useQueryParams, StringParam, withDefault } from 'use-query-params';

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
      allMongodbAiidprodClassifications,
      allMongodbAiidprodReports,
      allMongodbTranslationsReportsEs,
      allMongodbTranslationsReportsEn,
      allMongodbTranslationsReportsFr,
      incident,
      entities: entitiesData,
      responses,
    },
  } = props;

  const { isRole, user, loading } = useUserContext();

  const { i18n, t } = useTranslation();

  const { locale } = useLocalization();

  const localizePath = useLocalizePath();

  const [query] = useQueryParams({
    edit_taxonomy: withDefault(StringParam, ''),
  });

  // meta tags

  const defaultIncidentTitle = t('Citation record for Incident {{id}}', {
    id: incident.incident_id,
  });

  const metaTitle = `Incident ${incident.incident_id}: ${incident.title}`;

  const metaDescription = incident.description;

  const incidentReports = getTranslatedReports({
    allMongodbAiidprodReports,
    translations: {
      en: allMongodbTranslationsReportsEn,
      es: allMongodbTranslationsReportsEs,
      fr: allMongodbTranslationsReportsFr,
    },
    locale,
  });

  const sortedIncidentReports = sortIncidentsByDatePublished(incidentReports);

  const sortedReports = sortedIncidentReports.filter((report) => isCompleteReport(report));

  const publicID = sortedReports.find((report) => report.cloudinary_id)?.cloudinary_id;

  const image = new CloudinaryImage(publicID, {
    cloudName: config.cloudinary.cloudName,
  });

  const metaImage = image.createCloudinaryURL();

  const addToast = useToastContext();

  const timeline = sortedReports.map(
    ({ date_published, title, mongodb_id, report_number, tags }) => ({
      date_published,
      title,
      mongodb_id,
      report_number,
      isResponse: tags && tags.includes(RESPONSE_TAG),
    })
  );

  timeline.push({
    date_published: incident.date,
    title: 'Incident Occurrence',
    mongodb_id: 0,
    isOccurrence: true,
  });

  const variants = sortedIncidentReports.filter((report) => !isCompleteReport(report));

  const taxonomies = useMemo(
    () =>
      getTaxonomies({
        allMongodbAiidprodTaxa,
        allMongodbAiidprodClassifications,
      }),
    []
  );

  const [taxonomiesList, setTaxonomiesList] = useState(
    taxonomies.map((t) => ({ ...t, canEdit: false }))
  );

  const [taxonomyBeingEdited, setTaxonomyBeingEdited] = useState(
    taxonomies.find((taxonomy) => taxonomy.namespace == query.edit_taxonomy)
  );

  const taxonomyDiv = useRef();

  useEffect(() => {
    if (query.edit_taxonomy?.length > 0) {
      if (taxonomyDiv?.current?.scrollIntoView) {
        taxonomyDiv.current.scrollIntoView();
      }
    }
  }, []);

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
        const incidentId = incident.incident_id;

        await subscribeToNewReportsMutation({
          variables: {
            query: {
              type: SUBSCRIPTION_TYPE.incident,
              userId: { userId: user.id },
              incident_id: { incident_id: incidentId },
            },
            subscription: {
              type: SUBSCRIPTION_TYPE.incident,
              userId: {
                link: user.id,
              },
              incident_id: {
                link: incidentId,
              },
            },
          },
        });

        addToast({
          message: (
            <>
              {t(`You have successfully subscribed to updates on incident {{incidentId}}`, {
                incidentId,
              })}
            </>
          ),
          severity: SEVERITY.success,
        });
      } catch (e) {
        addToast({
          message: <label>{t(e.error || 'An unknown error has ocurred')}</label>,
          severity: SEVERITY.danger,
          error: e,
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

  const entities = computeEntities({
    incidents: [incident],
    entities: entitiesData.nodes,
    responses: responses.nodes,
  });

  const incidentResponded = sortedReports.some(
    (report) => report.tags && report.tags.includes(RESPONSE_TAG)
  );

  return (
    <Layout {...{ props }}>
      <AiidHelmet {...{ metaTitle, metaDescription, path: props.location.pathname, metaImage }}>
        <meta property="og:type" content="website" />
      </AiidHelmet>

      <div className={'titleWrapper'}>
        <h1 className="tw-styled-heading">{locale == 'en' ? metaTitle : defaultIncidentTitle}</h1>
        <div className="flex">
          <SocialShareButtons
            metaTitle={metaTitle}
            path={props.location.pathname}
            page="cite"
            className="-mt-1"
          ></SocialShareButtons>
          {incidentResponded && (
            <div className="self-center">
              <Badge color="success" data-cy="responded-badge">
                {t('Responded')}
              </Badge>
            </div>
          )}
        </div>
      </div>

      <div className="flex">
        <div className="shrink-1">
          <div>
            <strong>Description</strong>: {incident.description}
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
                  <Card.Body className="flex-row flex-wrap gap-2">
                    <Button variant="outline-primary" onClick={subscribeToNewReports}>
                      <div className="flex gap-2 items-center">
                        {subscribing ? (
                          <div>
                            <Spinner size="sm" />
                          </div>
                        ) : (
                          <FontAwesomeIcon icon={faEnvelope} title={t('Notify Me of Updates')} />
                        )}
                        <Trans>Notify Me of Updates</Trans>
                      </div>
                    </Button>
                    <Button
                      variant="outline-primary"
                      href={`/apps/submit?incident_id=${
                        incident.incident_id
                      }&date_downloaded=${format(new Date(), 'yyyy-MM-dd')}`}
                    >
                      <FontAwesomeIcon icon={faPlus} title={t('New Report')} className="mr-2" />
                      <Trans>New Report</Trans>
                    </Button>
                    <Button
                      variant="outline-primary"
                      href={`/apps/submit?tags=${RESPONSE_TAG}&incident_id=${incident.incident_id}`}
                    >
                      <FontAwesomeIcon icon={faPlus} title={t('New Response')} className="mr-2" />
                      <Trans>New Response</Trans>
                    </Button>
                    <Button
                      variant="outline-primary"
                      href={'/apps/discover?incident_id=' + incident.incident_id}
                    >
                      <FontAwesomeIcon className="mr-2" icon={faSearch} title={t('Discover')} />
                      <Trans>Discover</Trans>
                    </Button>
                    <BibTex
                      nodes={incidentReports}
                      incidentDate={incident.date}
                      incident_id={incident.incident_id}
                      editors={incident.editors}
                    />
                    {!loading && isRole('incident_editor') && (
                      <Button
                        variant="outline-primary"
                        href={'/incidents/edit?incident_id=' + incident.incident_id}
                      >
                        <FontAwesomeIcon
                          className="mr-2"
                          icon={faEdit}
                          title={t('Edit Incident')}
                        />
                        <Trans>Edit Incident</Trans>
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {taxonomies.length > 0 && (
              <Row id="taxa-area">
                <Col>
                  {taxonomiesList
                    .filter((t) => t.canEdit || (t.classificationsArray.length > 0 && t.publish))
                    .map((t) => {
                      const inQuery = query.edit_taxonomy == t.namespace;

                      return (
                        <div key={t.namespace} ref={inQuery ? taxonomyDiv : undefined}>
                          <Taxonomy
                            id={`taxonomy-${t.namespace}`}
                            taxonomy={t}
                            incidentId={incident.incident_id}
                            canEdit={t.canEdit}
                            {...{
                              taxonomyBeingEdited,
                              setTaxonomyBeingEdited,
                            }}
                          />
                        </div>
                      );
                    })}
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
                      <Trans>Incident Reports</Trans>
                    </h1>
                  </div>
                </div>
              </Col>
            </Row>

            {sortedReports.map((report) => (
              <Row className="mb-4" key={report.report_number}>
                <Col>
                  <ReportCard item={report} incidentId={incident.incident_id} />
                </Col>
              </Row>
            ))}

            <VariantList incidentId={incident.incident_id} variants={variants}></VariantList>

            <SimilarIncidents
              nlp_similar_incidents={nlp_similar_incidents}
              editor_similar_incidents={editor_similar_incidents}
              editor_dissimilar_incidents={editor_dissimilar_incidents}
              flagged_dissimilar_incidents={incident.flagged_dissimilar_incidents}
              parentIncident={incident}
              className="xl:hidden"
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
          </Container>
        </div>
        <div className="hidden xl:block w-[16rem] 2xl:w-[18rem] ml-2 -mt-2 pr-4 shrink-0">
          <SimilarIncidents
            nlp_similar_incidents={nlp_similar_incidents}
            editor_similar_incidents={editor_similar_incidents}
            editor_dissimilar_incidents={editor_dissimilar_incidents}
            flagged_dissimilar_incidents={incident.flagged_dissimilar_incidents}
            parentIncident={incident}
            orientation="column"
          />
        </div>
      </div>
    </Layout>
  );
}

export const query = graphql`
  query CitationPageQuery(
    $incident_id: Int
    $report_numbers: [Int]
    $translate_es: Boolean!
    $translate_fr: Boolean!
    $translate_en: Boolean!
  ) {
    allMongodbAiidprodClassifications(filter: { incident_id: { eq: $incident_id } }) {
      nodes {
        incident_id
        id
        namespace
        notes
        attributes {
          short_name
          value_json
        }
        publish
      }
    }
    allMongodbAiidprodTaxa {
      nodes {
        id
        namespace
        weight
        description
        complete_entities
        dummy_fields {
          field_number
          short_name
        }
        field_list {
          field_number
          short_name
          long_name
          short_description
          long_description
          display_type
          mongo_type
          default
          placeholder
          permitted_values
          weight
          instant_facet
          required
          public
          complete_from {
            all
            current
            entities
          }
          subfields {
            field_number
            short_name
            long_name
            short_description
            long_description
            display_type
            mongo_type
            default
            placeholder
            permitted_values
            weight
            instant_facet
            required
            public
            complete_from {
              all
              current
              entities
            }
          }
        }
      }
    }
    allMongodbAiidprodReports(filter: { report_number: { in: $report_numbers } }) {
      nodes {
        submitters
        date_published
        report_number
        title
        description
        url
        image_url
        cloudinary_id
        source_domain
        mongodb_id
        text
        authors
        epoch_date_submitted
        language
        tags
        text_inputs
        text_outputs
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
    allMongodbTranslationsReportsFr(filter: { report_number: { in: $report_numbers } })
      @include(if: $translate_fr) {
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

    entities: allMongodbAiidprodEntities {
      nodes {
        entity_id
        name
      }
    }

    responses: allMongodbAiidprodReports(filter: { tags: { in: ["response"] } }) {
      nodes {
        report_number
      }
    }
  }
`;

export default CitePage;
