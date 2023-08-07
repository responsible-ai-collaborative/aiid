import React, { useEffect, useMemo, useState, useRef } from 'react';
import { Badge, Button } from 'flowbite-react';
import { Trans, useTranslation } from 'react-i18next';
import { useLocalization } from 'plugins/gatsby-theme-i18n';
import { useMutation, useQuery } from '@apollo/client';
import ImageCarousel from 'components/cite/ImageCarousel';
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
import SocialShareButtons from '../components/ui/SocialShareButtons';
import useLocalizePath from '../components/i18n/useLocalizePath';
import { FIND_USER_SUBSCRIPTIONS, UPSERT_SUBSCRIPTION } from '../graphql/subscriptions';
import useToastContext, { SEVERITY } from '../hooks/useToast';
import Link from 'components/ui/Link';
import { getTaxonomies } from 'utils/cite';
import { RESPONSE_TAG } from 'utils/entities';
import AllegedEntities from 'components/entities/AllegedEntities';
import { SUBSCRIPTION_TYPE } from 'utils/subscriptions';
import VariantList from 'components/variants/VariantList';
import { useQueryParams, StringParam, withDefault } from 'use-query-params';
import Tools from 'components/cite/Tools';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

function CiteTemplate({
  incident,
  sortedReports,
  variants,
  metaTitle,
  entities,
  timeline,
  locationPathName,
  allMongodbAiidprodTaxa,
  allMongodbAiidprodClassifications,
  nextIncident,
  prevIncident,
  nlp_similar_incidents,
  editor_similar_incidents,
  editor_dissimilar_incidents,
  liveVersion = false,
  setIsLiveData,
}) {
  const { loading, isRole, user } = useUserContext();

  const { i18n, t } = useTranslation();

  const { locale } = useLocalization();

  const localizePath = useLocalizePath();

  const [query] = useQueryParams({
    edit_taxonomy: withDefault(StringParam, ''),
  });

  const [isSubscribed, setIsSubscribed] = useState(false);

  const { data } = useQuery(FIND_USER_SUBSCRIPTIONS, {
    variables: {
      query: { userId: { userId: user?.id }, incident_id: { incident_id: incident.incident_id } },
    },
  });

  // meta tags

  const defaultIncidentTitle = t('Citation record for Incident {{id}}', {
    id: incident.incident_id,
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
        } catch (error) {
          addToast({
            message: <label>{t(error.error || 'An unknown error has ocurred')}</label>,
            severity: SEVERITY.danger,
            error,
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
        severity: SEVERITY.info,
      });
    }
  };

  const incidentResponded = sortedReports.some(
    (report) => report.tags && report.tags.includes(RESPONSE_TAG)
  );

  return (
    <>
      <div className={'titleWrapper'}>
        <div className="w-full flex justify-between flex-wrap gap-1">
          <h1 className="text-2xl inline">{locale == 'en' ? metaTitle : defaultIncidentTitle}</h1>
          <div className="inline-flex gap-2">
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
            <SocialShareButtons
              metaTitle={metaTitle}
              path={locationPathName}
              page="cite"
            ></SocialShareButtons>
          </div>
        </div>
      </div>
      <div className="flex mt-6">
        <div className="shrink-1">
          <Row>
            <Col>
              <div>
                <strong>Description</strong>: {incident.description}
              </div>
            </Col>
          </Row>
          {incident.editor_notes && incident.editor_notes !== '' && (
            <Row className="mt-2">
              <Col>
                <div>
                  <strong>Editor Notes</strong>: {incident.editor_notes}
                </div>
              </Col>
            </Row>
          )}

          <Row className="mt-6">
            <Col>
              <Tools
                incident={incident}
                isSubscribed={isSubscribed}
                subscribeToNewReports={subscribeToNewReports}
                incidentReports={sortedReports}
                subscribing={subscribing}
                isLiveData={liveVersion}
                setIsLiveData={setIsLiveData}
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
                      editors: incident.editors
                        .map(({ first_name, last_name }) => `${first_name} ${last_name}`)
                        .join(', '),
                    }}
                  />
                </div>
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

            {sortedReports.map((report) => {
              let actions = <></>;

              if (!loading && isRole('incident_editor')) {
                actions = (
                  <Button
                    data-cy="edit-report"
                    size={'xs'}
                    color="light"
                    href={`/cite/edit?report_number=${report.report_number}&incident_id=${incident.incident_id}`}
                    className="hover:no-underline "
                  >
                    <Trans>Edit</Trans>
                  </Button>
                );
              }
              return (
                <Row className="mt-6 mb-4" key={report.report_number}>
                  <Col>
                    <ReportCard item={report} incidentId={incident.incident_id} actions={actions} />
                  </Col>
                </Row>
              );
            })}

            <VariantList
              liveVersion={liveVersion}
              incidentId={incident.incident_id}
              variants={variants}
            />

            <SimilarIncidents
              nlp_similar_incidents={nlp_similar_incidents}
              editor_similar_incidents={editor_similar_incidents}
              editor_dissimilar_incidents={editor_dissimilar_incidents}
              flagged_dissimilar_incidents={incident.flagged_dissimilar_incidents}
              parentIncident={incident}
              className="xl:hidden"
            />

            <div className="flex justify-between">
              <Button
                color={'gray'}
                href={localizePath({ path: `/cite/${prevIncident}` })}
                disabled={!prevIncident}
                className="hover:no-underline"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                <Trans>Previous Incident</Trans>
              </Button>
              <Button
                color={'gray'}
                href={localizePath({ path: `/cite/${nextIncident}` })}
                disabled={!nextIncident}
                className="hover:no-underline"
              >
                <Trans>Next Incident</Trans>
                <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
              </Button>
            </div>
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
  );
}

export default CiteTemplate;
