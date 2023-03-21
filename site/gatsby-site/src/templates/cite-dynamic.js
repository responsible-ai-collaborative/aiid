import React, { useEffect, useMemo, useState, useRef } from 'react';
import { Badge, Spinner } from 'flowbite-react';
import { CloudinaryImage } from '@cloudinary/base';
import { Trans, useTranslation } from 'react-i18next';
import { useLocalization } from 'plugins/gatsby-theme-i18n';
import { useMutation, useQuery } from '@apollo/client';
import { graphql } from 'gatsby';
import AiidHelmet from 'components/AiidHelmet';
import Layout from 'components/Layout';
import ImageCarousel from 'components/cite/ImageCarousel';
import { isAfter, isEqual } from 'date-fns';
import Timeline from '../components/visualizations/Timeline';
import IncidentStatsCard from '../components/cite/IncidentStatsCard';
import ReportCard from '../components/reports/ReportCard';
import Taxonomy from '../components/taxa/Taxonomy';
import { useUserContext } from '../contexts/userContext';
import SimilarIncidents from '../components/cite/SimilarIncidents';
import Card from '../elements/Card';
import Container from '../elements/Container';
import Row from '../elements/Row';
import Col from '../elements/Col';
import Pagination from '../elements/Pagination';
import SocialShareButtons from '../components/ui/SocialShareButtons';
import useLocalizePath from '../components/i18n/useLocalizePath';
import { FIND_USER_SUBSCRIPTIONS, UPSERT_SUBSCRIPTION } from '../graphql/subscriptions';
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
import Tools from 'components/cite/Tools';
import { FIND_FULL_INCIDENT } from '../graphql/incidents';

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

function CiteDynamicPage(props) {
  const {
    pageContext: {
      incident_id,
      nextIncident,
      prevIncident,
      nlp_similar_incidents,
      editor_similar_incidents,
      editor_dissimilar_incidents,
    },
    data: {
      allMongodbAiidprodTaxa,
      allMongodbAiidprodClassifications,
      entities: entitiesData,
      responses,
    },
  } = props;

  const { isRole, user } = useUserContext();

  const { i18n, t } = useTranslation();

  const { locale } = useLocalization();

  const localizePath = useLocalizePath();

  const [query] = useQueryParams({
    edit_taxonomy: withDefault(StringParam, ''),
  });

  const [isSubscribed, setIsSubscribed] = useState(false);

  const [incident, setIncident] = useState(null);

  const [entities, setEntities] = useState(null);

  const [sortedReports, setSortedReports] = useState([]);

  const [timeline, setTimeline] = useState(null);

  const [variants, setVariants] = useState([]);

  // meta tags

  const [metaTitle, setMetaTitle] = useState(null);

  const [metaDescription, setMetaDescription] = useState(null);

  const [metaImage, setMetaImage] = useState(null);

  const defaultIncidentTitle = t('Citation record for Incident {{id}}', { id: incident_id });

  const { data: incidentData, loading } = useQuery(FIND_FULL_INCIDENT, {
    variables: { query: { incident_id } },
  });

  const { data } = useQuery(FIND_USER_SUBSCRIPTIONS, {
    variables: {
      query: { userId: { userId: user?.id }, incident_id: { incident_id } },
    },
  });

  const addToast = useToastContext();

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

  useEffect(() => {
    if (data) {
      if (data?.subscriptions?.length > 0) {
        setIsSubscribed(true);
      } else {
        setIsSubscribed(false);
      }
    }
  }, [data]);

  useEffect(() => {
    if (incidentData && incidentData.incident) {
      const incidentTemp = { ...incidentData.incident };

      //set Entities incident fields
      incidentTemp.Alleged_deployer_of_AI_system = incidentTemp.AllegedDeployerOfAISystem.map(
        (e) => e.entity_id
      );
      incidentTemp.Alleged_developer_of_AI_system = incidentTemp.AllegedDeveloperOfAISystem.map(
        (e) => e.entity_id
      );
      incidentTemp.Alleged_harmed_or_nearly_harmed_parties =
        incidentTemp.AllegedHarmedOrNearlyHarmedParties.map((e) => e.entity_id);

      const entities = computeEntities({
        incidents: [incidentTemp],
        entities: entitiesData.nodes,
        responses: responses.nodes,
      });

      const incidentReports = getTranslatedReports({
        allMongodbAiidprodReports: { nodes: incidentTemp.reports },
        translations: {
          en: { nodes: incidentTemp.reports },
          es: { nodes: incidentTemp.reports },
          fr: { nodes: incidentTemp.reports },
        },
        locale,
      });

      const sortedIncidentReports = sortIncidentsByDatePublished(incidentReports);

      const sortedReports = sortedIncidentReports.filter((report) => isCompleteReport(report));

      const publicID = sortedReports.find((report) => report.cloudinary_id)?.cloudinary_id;

      const image = new CloudinaryImage(publicID, {
        cloudName: config.cloudinary.cloudName,
      });

      const timelineTemp = sortedReports.map(
        ({ date_published, title, mongodb_id, report_number, tags }) => ({
          date_published,
          title,
          mongodb_id,
          report_number,
          isResponse: tags && tags.includes(RESPONSE_TAG),
        })
      );

      timelineTemp.push({
        date_published: incidentTemp.date,
        title: 'Incident Occurrence',
        mongodb_id: 0,
        isOccurrence: true,
      });

      const variantsTemp = sortedIncidentReports.filter((report) => !isCompleteReport(report));

      setEntities(entities);
      setMetaTitle(`Incident ${incidentTemp.incident_id}: ${incidentTemp.title}`);
      setMetaDescription(incidentTemp.description);
      setMetaImage(image.createCloudinaryURL());
      setTimeline(timelineTemp);
      setSortedReports(sortedReports);
      setVariants(variantsTemp);
      setIncident(incidentTemp);
    }
  }, [incidentData]);

  const [subscribeToNewReportsMutation, { loading: subscribing }] =
    useMutation(UPSERT_SUBSCRIPTION);

  const subscribeToNewReports = async () => {
    if (!isSubscribed) {
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
    } else {
      addToast({
        message: (
          <Trans i18n={i18n}>
            Please go to your{' '}
            <Link to={localizePath({ path: '/account', language: locale })}>account</Link> to manage
            subscriptions
          </Trans>
        ),
        severity: SEVERITY.success,
      });
    }
  };

  const incidentResponded = sortedReports.some(
    (report) => report.tags && report.tags.includes(RESPONSE_TAG)
  );

  console.log(loading, incident);

  return (
    <Layout {...{ props }} location={props.location}>
      <AiidHelmet {...{ metaTitle, metaDescription, path: props.location.pathname, metaImage }}>
        <meta property="og:type" content="website" />
      </AiidHelmet>

      {loading ? (
        <Spinner />
      ) : !loading && incident ? (
        <>
          <div className={'titleWrapper'}>
            <h1 className="tw-styled-heading">
              {locale == 'en' ? metaTitle : defaultIncidentTitle}
            </h1>
            <div className="flex justify-between w-full flex-wrap">
              <div className="flex gap-2">
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
                {isSubscribed && (
                  <div className="self-center">
                    <Badge color="success" data-cy="subscribed-badge">
                      <Trans>Subscribed to Updates</Trans>
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex mt-6">
            <div className="shrink-1">
              <Row>
                <Col>
                  <strong>Description</strong>: {incident.description}
                </Col>
              </Row>

              <Row className="mt-6">
                <Col>
                  <Tools
                    incident={incident}
                    isSubscribed={isSubscribed}
                    subscribeToNewReports={subscribeToNewReports}
                    incidentReports={sortedReports}
                    subscribing={subscribing}
                  />
                </Col>
              </Row>

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
                        <AllegedEntities entities={entities ?? []} />
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
                          reportCount: sortedReports.length,
                          incidentDate: incident.date,
                          editors: incident.editors.join(', '),
                        }}
                      />
                    </div>
                  </Col>
                </Row>

                {taxonomies.length > 0 && (
                  <Row id="taxa-area">
                    <Col>
                      {taxonomiesList
                        .filter(
                          (t) => t.canEdit || (t.classificationsArray.length > 0 && t.publish)
                        )
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
                    <div className="pb-5">
                      <h1 className="tw-styled-heading">
                        <Trans>Incident Reports</Trans>
                      </h1>
                    </div>
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
                    <Card>
                      <ImageCarousel nodes={sortedReports} />
                    </Card>
                  </Col>
                </Row>

                {sortedReports.map((report) => (
                  <Row className="mt-6 mb-4" key={report.report_number}>
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
        </>
      ) : (
        <Trans>Incident {{ incident_id }} not found</Trans>
      )}
    </Layout>
  );
}

export const query = graphql`
  query CitationPageQuery($incident_id: Int) {
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

export default CiteDynamicPage;
