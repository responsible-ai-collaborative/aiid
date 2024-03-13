import React, { useEffect, useState } from 'react';
import IncidentsTable from '../../components/incidents/IncidentsTable';
import { FIND_INCIDENTS_TABLE } from '../../graphql/incidents';
import { useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import AiidHelmet from '../../components/AiidHelmet';
import ListSkeleton from 'elements/Skeletons/List';
import { graphql } from 'gatsby';
import { makeEntitiesHash } from 'utils/entities';
import { Button } from 'flowbite-react';
import ReportsTable from 'components/reports/ReportsTable';
import { FIND_REPORTS_TABLE } from '../../graphql/reports';

const IncidentsPage = ({ data, ...props }) => {
  const { data: incidents, loading: incidentsLoading } = useQuery(FIND_INCIDENTS_TABLE);

  const { data: reports, loading: reportsLoading } = useQuery(FIND_REPORTS_TABLE, {
    variables: {
      query: {
        is_incident_report: true,
      },
    },
  });

  const { data: issueReports, loading: issueReportsLoading } = useQuery(FIND_REPORTS_TABLE, {
    variables: {
      query: {
        is_incident_report: false,
      },
    },
  });

  const [incidentsData, setIncidentsData] = useState(null);

  const [issueReportsData, setIssueReportsData] = useState(null);

  const [reportsData, setReportsData] = useState(null);

  const [isLiveData, setIsLiveData] = useState(false);

  const [selectedView, setSelectedView] = useState('incidents');

  useEffect(() => {
    if (selectedView === 'incidents') {
      if (isLiveData) {
        if (incidents) {
          setIncidentsData(incidents.incidents);
        }
      } else if (data?.incidents?.nodes) {
        const entitiesHash = makeEntitiesHash(data?.entities?.nodes);

        const incidents = [];

        for (const incident of data.incidents.nodes) {
          incident.AllegedDeployerOfAISystem = incident.Alleged_deployer_of_AI_system.map(
            (entity_id) => entitiesHash[entity_id]
          );
          incident.AllegedDeveloperOfAISystem = incident.Alleged_developer_of_AI_system.map(
            (entity_id) => entitiesHash[entity_id]
          );
          incident.AllegedHarmedOrNearlyHarmedParties =
            incident.Alleged_harmed_or_nearly_harmed_parties.map(
              (entity_id) => entitiesHash[entity_id]
            );
          incidents.push(incident);
        }

        setIncidentsData(incidents);
      }
    } else if (selectedView === 'issueReports') {
      if (isLiveData) {
        if (issueReports) {
          setIssueReportsData(issueReports.reports);
        }
      } else if (data?.issueReports?.nodes) {
        setIssueReportsData(data?.issueReports?.nodes);
      }
    } else if (selectedView === 'reports') {
      if (isLiveData) {
        if (reports) {
          setReportsData(reports.reports);
        }
      } else if (data?.reports?.nodes) {
        setReportsData(data?.reports?.nodes);
      }
    }
  }, [isLiveData, incidents, data, selectedView]);

  const { t } = useTranslation();

  return (
    <div className="w-full" {...props}>
      <AiidHelmet path={props.location.pathname}>
        <title>{t('Incidents')}</title>
      </AiidHelmet>
      <div>
        <Button.Group className="mb-4">
          <Button
            color={`${selectedView === 'incidents' ? 'dark' : 'gray'}`}
            onClick={() => setSelectedView('incidents')}
          >
            Incidents
          </Button>
          <Button
            className={`rounded-none`}
            color={`${selectedView === 'issueReports' ? 'dark' : 'gray'}`}
            onClick={() => setSelectedView('issueReports')}
          >
            Issue Reports
          </Button>
          <Button
            color={`${selectedView === 'reports' ? 'dark' : 'gray'}`}
            onClick={() => setSelectedView('reports')}
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
      }
    }
    entities: allMongodbAiidprodEntities {
      nodes {
        id: entity_id
        name
      }
    }
    reports: allMongodbAiidprodReports(filter: { is_incident_report: { eq: true } }) {
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
      }
    }

    issueReports: allMongodbAiidprodReports(filter: { is_incident_report: { eq: false } }) {
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
      }
    }
  }
`;

export default IncidentsPage;
