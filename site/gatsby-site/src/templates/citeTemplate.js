import React, { useEffect, useState } from 'react';
import { Badge, Button } from 'flowbite-react';
import { Trans, useTranslation } from 'react-i18next';
import { useLocalization } from 'plugins/gatsby-theme-i18n';
import { useMutation, useQuery } from '@apollo/client';
import ImageCarousel from 'components/cite/ImageCarousel';
import Timeline from '../components/visualizations/Timeline';
import IncidentStatsCard from '../components/cite/IncidentStatsCard';
import ReportCard from '../components/reports/ReportCard';
import { useUserContext } from 'contexts/UserContext';
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
import { RESPONSE_TAG } from 'utils/entities';
import AllegedEntities from 'components/entities/AllegedEntities';
import { SUBSCRIPTION_TYPE } from 'utils/subscriptions';
import VariantList from 'components/variants/VariantList';
import Tools from 'components/cite/Tools';
import TranslationBadge from 'components/i18n/TranslationBadge';
import ExpandCollapseAllReports from 'components/cite/ExpandCollapseAllReports';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleArrowLeft,
  faCircleArrowRight,
  faArrowLeft,
  faArrowRight,
  faDice,
} from '@fortawesome/free-solid-svg-icons';
import ClassificationsEditor from 'components/taxa/ClassificationsEditor';
import ClassificationsDisplay from 'components/taxa/ClassificationsDisplay';

const IncidentBadges = ({ badges }) => {
  if (!badges || badges.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2 my-auto">
      {badges.map(
        ({ show, key, content, className = 'self-center' }) =>
          show && (
            <div className={className} key={key}>
              {content}
            </div>
          )
      )}
    </div>
  );
};

function CiteTemplate({
  incident,
  sortedReports,
  variants,
  incidentTitle,
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
  readOnly = false,
  linkRecords,
}) {
  const { loading, isRole, user } = useUserContext();

  const { i18n, t } = useTranslation();

  const { locale } = useLocalization();

  const localizePath = useLocalizePath();

  const [isSubscribed, setIsSubscribed] = useState(false);

  const [reportExpandedStates, setReportExpandedStates] = useState({});

  const { data } = useQuery(FIND_USER_SUBSCRIPTIONS, {
    variables: {
      filter: { userId: { EQ: user?.id }, incident_id: { EQ: incident.incident_id } },
    },
    skip: !user || loading,
  });

  const visibleClassifications = {
    nodes: allMongodbAiidprodClassifications.nodes.filter(
      (classification) => !classification.namespace.includes('_Annotator')
    ),
  };

  // meta tags

  const addToast = useToastContext();

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
              filter: {
                type: { EQ: SUBSCRIPTION_TYPE.incident },
                userId: { EQ: user.id },
                incident_id: { EQ: incidentId },
              },
              update: {
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
            message: <label>{t(error.error || 'An unknown error has occurred')}</label>,
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

  const handleExpandAll = () => {
    const expandedStates = {};

    sortedReports.forEach((report) => {
      expandedStates[report.report_number] = true;
    });
    setReportExpandedStates(expandedStates);
  };

  const handleCollapseAll = () => {
    const expandedStates = {};

    sortedReports.forEach((report) => {
      expandedStates[report.report_number] = false;
    });
    setReportExpandedStates(expandedStates);
  };

  const handleToggleReport = (reportNumber, expanded) => {
    setReportExpandedStates((prev) => ({
      ...prev,
      [reportNumber]: expanded,
    }));
  };

  // Calculate derived state for expand/collapse all buttons
  const reportStates = sortedReports.map(
    (report) => reportExpandedStates[report.report_number] ?? false
  );

  const allExpanded = reportStates.length > 0 && reportStates.every((state) => state === true);

  const allCollapsed = reportStates.length > 0 && reportStates.every((state) => state === false);

  return (
    <>
      <div className={'titleWrapper'}>
        {incident.isTranslated && <TranslationBadge className="mt-2" />}
        <div
          className="flex flex-wrap justify-between items-center w-full xl:flex-nowrap gap-1 xl:gap-4"
          data-testid="incident-title-section"
        >
          <h1 data-testid="incident-title" className="flex-grow inline text-2xl">
            {incidentTitle}
          </h1>
          <div className="flex flex-wrap sm:flex-nowrap gap-4 xl:justify-end">
            <IncidentBadges
              badges={[
                {
                  key: 'translation',
                  show: incident.isTranslated,
                  content: <TranslationBadge className="whitespace-nowrap" />,
                },
                {
                  key: 'responded',
                  show: incidentResponded,
                  content: (
                    <Badge color="success" data-cy="responded-badge">
                      {t('Responded')}
                    </Badge>
                  ),
                },
                {
                  key: 'subscribed',
                  show: isSubscribed,
                  content: (
                    <Badge color="success" data-cy="subscribed-badge" className="whitespace-nowrap">
                      <Trans>Subscribed to Updates</Trans>
                    </Badge>
                  ),
                },
              ]}
            />
            {!readOnly && (
              <>
                <div className="flex justify-end items-start shrink flex-nowrap">
                  <SocialShareButtons
                    metaTitle={incidentTitle}
                    path={locationPathName}
                    page="cite"
                  ></SocialShareButtons>

                  <div className="flex flex-nowrap gap-1 ml-4 text-lg">
                    <a
                      data-cy="header-previous-incident-link"
                      title={t('Previous Incident')}
                      className={`${
                        prevIncident ? 'text-black hover:text-primary-blue' : 'text-gray-400'
                      } h-[50px] leading-[50px]`}
                      href={
                        prevIncident ? localizePath({ path: `/cite/${prevIncident}` }) : undefined
                      }
                    >
                      <FontAwesomeIcon icon={faCircleArrowLeft} className="mr-2" />
                    </a>
                    <a
                      data-cy="header-random-incident-link"
                      title={t('Random Incident')}
                      className={`${
                        nextIncident ? 'text-black hover:text-primary-blue' : 'text-gray-400'
                      } h-[50px] leading-[50px]`}
                      href={localizePath({ path: `/random/` })}
                    >
                      <FontAwesomeIcon icon={faDice} className="mr-2" />
                    </a>
                    <a
                      data-cy="header-next-incident-link"
                      title={t('Next Incident')}
                      className={`${
                        nextIncident ? 'text-black hover:text-primary-blue' : 'text-gray-400'
                      } h-[50px] leading-[50px]`}
                      href={
                        nextIncident ? localizePath({ path: `/cite/${nextIncident}` }) : undefined
                      }
                    >
                      <FontAwesomeIcon icon={faCircleArrowRight} className="mr-2" />
                    </a>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-6">
        <div className="shrink-1 max-w-screen-xl">
          <Row>
            <Col>
              <div
                style={{ 'overflow-wrap': 'anywhere' }}
                className={`${incident.isTranslated ? 'flex flex-wrap' : ''}`}
                data-testid="incident-description-section"
              >
                <strong>
                  <Trans>Description</Trans>
                </strong>
                :
                {incident.isTranslated && (
                  <div className="self-center">
                    <TranslationBadge className="mx-2" />
                  </div>
                )}
                {` ${incident.description}`}
              </div>
            </Col>
          </Row>
          {incident.editor_notes && incident.editor_notes !== '' && (
            <Row className="mt-2">
              <Col>
                <div style={{ 'overflow-wrap': 'anywhere' }}>
                  <strong>Editor Notes</strong>: {incident.editor_notes}
                </div>
              </Col>
            </Row>
          )}

          {!readOnly && (
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
                  linkRecords={linkRecords}
                />
              </Col>
            </Row>
          )}

          <Container>
            <Row>
              <Col>
                <Card className="mt-6 shadow-card border-1.5 border-border-light-gray rounded-5px">
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
                      taxonomiesWithClassifications: Array.from(
                        visibleClassifications.nodes.reduce((namespaces, classification) => {
                          namespaces.add(classification.namespace);
                          return namespaces;
                        }, new Set())
                      ),
                      editors: incident.editors
                        .filter((editor) => editor && editor.first_name && editor.last_name)
                        .map(({ first_name, last_name }) => `${first_name} ${last_name}`)
                        .join(', '),
                    }}
                  />
                </div>
              </Col>
            </Row>

            <Row className="mt-6">
              <Col>
                {!readOnly && (
                  <ClassificationsEditor
                    taxa={allMongodbAiidprodTaxa}
                    incidentId={incident.incident_id}
                  />
                )}
                <ClassificationsDisplay
                  classifications={visibleClassifications}
                  taxa={allMongodbAiidprodTaxa}
                />
              </Col>
            </Row>

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
                <Card className="mx-auto max-w-3xl">
                  <ImageCarousel nodes={sortedReports} />
                </Card>
              </Col>
            </Row>

            <Row className="mt-6">
              <Col>
                <ExpandCollapseAllReports
                  onExpandAll={handleExpandAll}
                  onCollapseAll={handleCollapseAll}
                  hasReports={sortedReports.length > 0}
                  allExpanded={allExpanded}
                  allCollapsed={allCollapsed}
                />
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
                    className="hover:no-underline"
                  >
                    <Trans>Edit</Trans>
                  </Button>
                );
              }
              return (
                <Row className="mt-6 mb-4" key={report.report_number}>
                  <Col>
                    <ReportCard
                      item={report}
                      incidentId={incident.incident_id}
                      actions={actions}
                      readOnly={readOnly}
                      externalExpanded={reportExpandedStates[report.report_number]}
                      onToggleExpanded={handleToggleReport}
                    />
                  </Col>
                </Row>
              );
            })}

            <VariantList
              liveVersion={liveVersion}
              incidentId={incident.incident_id}
              variants={variants}
              readOnly={readOnly}
            />

            {!readOnly && (
              <SimilarIncidents
                nlp_similar_incidents={nlp_similar_incidents}
                editor_similar_incidents={editor_similar_incidents}
                editor_dissimilar_incidents={editor_dissimilar_incidents}
                flagged_dissimilar_incidents={incident.flagged_dissimilar_incidents}
                parentIncident={incident}
                className="xl:hidden"
              />
            )}
            {!readOnly && (
              <div className="flex justify-between">
                <Button
                  color={'gray'}
                  {...(prevIncident
                    ? { href: localizePath({ path: `/cite/${prevIncident}` }) }
                    : {})}
                  disabled={!prevIncident}
                  className="hover:no-underline"
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                  <Trans>Previous Incident</Trans>
                </Button>
                <Button
                  color={'gray'}
                  {...(nextIncident
                    ? { href: localizePath({ path: `/cite/${nextIncident}` }) }
                    : {})}
                  disabled={!nextIncident}
                  className="hover:no-underline"
                >
                  <Trans>Next Incident</Trans>
                  <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                </Button>
              </div>
            )}
          </Container>
        </div>
        {!readOnly && (
          <div
            className="hidden xl:block w-[16rem] 2xl:w-[18rem] ml-2 -mt-2 pr-4 shrink-0"
            data-cy="similar-incidents-column"
          >
            <SimilarIncidents
              nlp_similar_incidents={nlp_similar_incidents}
              editor_similar_incidents={editor_similar_incidents}
              editor_dissimilar_incidents={editor_dissimilar_incidents}
              flagged_dissimilar_incidents={incident.flagged_dissimilar_incidents}
              parentIncident={incident}
              orientation="column"
            />
          </div>
        )}
      </div>
    </>
  );
}

export default CiteTemplate;
