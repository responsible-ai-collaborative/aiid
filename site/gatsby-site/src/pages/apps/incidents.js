import React, { useEffect, useState } from 'react';
import IncidentsTable from '../../components/incidents/IncidentsTable';
import { FIND_INCIDENTS_TABLE } from '../../graphql/incidents';
import { useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import HeadContent from '../../components/HeadContent';
import ListSkeleton from 'elements/Skeletons/List';
import { graphql } from 'gatsby';
import { makeEntitiesHash } from 'utils/entities';
import { Button } from 'flowbite-react';
import ReportsTable from 'components/reports/ReportsTable';
import { FIND_REPORTS_TABLE } from '../../graphql/reports';
import { useQueryParam } from 'use-query-params';

const IncidentsPage = ({ data, ...props }) => {
  const [view] = useQueryParam('view');

  const { data: incidents, loading: incidentsLoading } = useQuery(FIND_INCIDENTS_TABLE);

  const { data: reports, loading: reportsLoading } = useQuery(FIND_REPORTS_TABLE, {
    variables: {
      filter: {
        is_incident_report: { EQ: true },
      },
    },
  });

  const { data: issueReports, loading: issueReportsLoading } = useQuery(FIND_REPORTS_TABLE, {
    variables: {
      filter: {
        is_incident_report: { EQ: false },
      },
    },
  });

  const [incidentsData, setIncidentsData] = useState(null);

  const [issueReportsData, setIssueReportsData] = useState(null);

  const [reportsData, setReportsData] = useState(null);

  const [isLiveData, setIsLiveData] = useState(false);

  const [selectedView, setSelectedView] = useState(null);

  useEffect(() => {
    if (view) {
      setSelectedView(view);
    } else {
      setSelectedView('incidents');
    }
  }, [view]);

  useEffect(() => {
    switch (selectedView) {
      case 'incidents':
        if (isLiveData && incidents) {
          setIncidentsData(incidents.incidents);
        } else if (data?.incidents?.nodes) {
          const entitiesHash = makeEntitiesHash(data?.entities?.nodes);

          const processedIncidents = data.incidents.nodes.map((incident) => ({
            ...incident,
            AllegedDeployerOfAISystem: incident.Alleged_deployer_of_AI_system.map(
              (id) => entitiesHash[id]
            ),
            AllegedDeveloperOfAISystem: incident.Alleged_developer_of_AI_system.map(
              (id) => entitiesHash[id]
            ),
            AllegedHarmedOrNearlyHarmedParties:
              incident.Alleged_harmed_or_nearly_harmed_parties.map((id) => entitiesHash[id]),
            implicated_systems: incident.implicated_systems.map((id) => entitiesHash[id]),
          }));

          setIncidentsData(processedIncidents);
        }
        break;
      case 'issueReports':
        if (isLiveData && issueReports) {
          setIssueReportsData(transformReports(issueReports.reports));
        } else if (data?.issueReports?.nodes) {
          setIssueReportsData(transformReports(data.issueReports.nodes));
        }
        break;

      case 'reports':
        if (isLiveData && reports && !reportsLoading) {
          setReportsData(transformReports(reports.reports));
        } else if (!isLiveData && data?.reports?.nodes) {
          setReportsData(transformReports(data.reports.nodes));
        }
        break;
      default:
    }
  }, [isLiveData, incidents, data, selectedView, reportsLoading]);

  function transformReports(reports) {
    let reportsData = reports;

    // Since we don't currently have report pages for reports, we need to add the incident_id to the reports to create the correct link /cite/:incident_id#r:report_number
    if (selectedView === 'reports') {
      const incidents = data.reports.nodes;

      if (isLiveData) {
        if (incidents) {
          const reportToIncidentMap = [];

          incidents.forEach((incident) => {
            incident.reports.forEach((report) => {
              reportToIncidentMap[report.report_number] = incident.incident_id;
            });
          });
          const updatedReports = reports.map((report) => ({
            ...report,
            incident_id: reportToIncidentMap[report.report_number],
          }));

          reportsData = updatedReports;
        } else {
          reportsData = reports;
        }
      } else {
        // Adds the incident_id to reports in order to create the correct link /cite/:incident_id#r:report_number
        const reportsMap = new Map();

        reports.forEach((incident) => {
          incident.reports.forEach((report) => {
            if (!reportsMap.has(report.report_number) && report.is_incident_report) {
              reportsMap.set(report.report_number, {
                ...report,
                incident_id: incident.incident_id,
              });
            }
          });
        });

        const flattenReports = Array.from(reportsMap.values()).sort(
          (a, b) => b.report_number - a.report_number
        );

        reportsData = flattenReports;
      }
    }

    return reportsData.map((report) => ({
      ...report,
      flag: report.flag ? 'Yes' : 'No',
      is_incident_report: report.is_incident_report ? 'No' : 'Yes',
    }));
  }

  return (
    <div className="w-full" {...props}>
      <div>
        <Button.Group className="mb-4" data-cy="table-view">
          <Button
            color={`${selectedView === 'incidents' ? 'dark' : 'gray'}`}
            onClick={() => {
              setSelectedView('incidents');
              const url = new URL(window.location);

              url.searchParams.set('view', 'incidents');
              window.history.replaceState({}, '', url);
            }}
          >
            Incidents
          </Button>
          <Button
            className={`rounded-none`}
            color={`${selectedView === 'issueReports' ? 'dark' : 'gray'}`}
            onClick={() => {
              setSelectedView('issueReports');
              const url = new URL(window.location);

              url.searchParams.set('view', 'issueReports');
              window.history.replaceState({}, '', url);
            }}
          >
            Issue Reports
          </Button>
          <Button
            color={`${selectedView === 'reports' ? 'dark' : 'gray'}`}
            onClick={() => {
              setSelectedView('reports');
              const url = new URL(window.location);

              url.searchParams.set('view', 'reports');
              window.history.replaceState({}, '', url);
            }}
          >
            Reports
          </Button>
        </Button.Group>
        {selectedView === 'incidents' && (
          <>
            {(incidentsData && !isLiveData) ||
            (incidentsData && isLiveData && !incidentsLoading) ? (
              <div className="overflow-x-auto">
                <IncidentsTable
                  data={incidentsData}
                  isLiveData={isLiveData}
                  setIsLiveData={setIsLiveData}
                />
              </div>
            ) : (
              <div className="px-3">
                <ListSkeleton />
              </div>
            )}
          </>
        )}
        {selectedView === 'issueReports' && (
          <>
            {(issueReportsData && !isLiveData) ||
            (issueReportsData && isLiveData && !issueReportsLoading) ? (
              <div className="overflow-x-auto">
                <ReportsTable
                  data={issueReportsData}
                  isLiveData={isLiveData}
                  setIsLiveData={setIsLiveData}
                />
              </div>
            ) : (
              <div className="px-3">
                <ListSkeleton />
              </div>
            )}
          </>
        )}
        {selectedView === 'reports' && (
          <>
            {(reportsData && !isLiveData) || (reportsData && isLiveData && !reportsLoading) ? (
              <div className="overflow-x-auto">
                <ReportsTable
                  data={reportsData}
                  isLiveData={isLiveData}
                  setIsLiveData={setIsLiveData}
                />
              </div>
            ) : (
              <div className="px-3">
                <ListSkeleton />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export const Head = (props) => {
  const {
    location: { pathname },
  } = props;

  const { t } = useTranslation();

  const metaTitle = t('Incidents');

  const metaDescription = t('AIID incidents list');

  return <HeadContent path={pathname} metaTitle={metaTitle} metaDescription={metaDescription} />;
};

export const query = graphql`
  query IncidentsPageQuery {
    incidents: allMongodbAiidprodIncidents {
      nodes {
        incident_id
        title
        description
        editors {
          userId
          first_name
          last_name
        }
        date
        Alleged_deployer_of_AI_system
        Alleged_developer_of_AI_system
        Alleged_harmed_or_nearly_harmed_parties
        implicated_systems
      }
    }
    entities: allMongodbAiidprodEntities {
      nodes {
        id: entity_id
        name
      }
    }

    reports: allMongodbAiidprodIncidents(
      filter: { reports: { elemMatch: { is_incident_report: { eq: true } } } }
      sort: { reports: { report_number: DESC } }
    ) {
      nodes {
        incident_id
        reports {
          report_number
          title
          url
          authors
          date_downloaded
          date_modified
          date_published
          date_submitted
          description
          flag
          image_url
          language
          source_domain
          submitters
          is_incident_report
        }
      }
    }

    issueReports: allMongodbAiidprodReports(
      filter: { is_incident_report: { eq: false } }
      sort: { report_number: DESC }
    ) {
      nodes {
        report_number
        title
        url
        authors
        date_downloaded
        date_modified
        date_published
        date_submitted
        description
        flag
        image_url
        language
        source_domain
        submitters
        is_incident_report
      }
    }
  }
`;

export default IncidentsPage;
