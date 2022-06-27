import React, { useEffect, useState, useCallback, useRef } from 'react';
import { ListGroup } from 'react-bootstrap';
import { subWeeks, addWeeks, getUnixTime, parse, isValid } from 'date-fns';
import { gql, useApolloClient } from '@apollo/client';
import debounce from 'lodash/debounce';
import isArray from 'lodash/isArray';
import RelatedIncidentsArea from './RelatedIncidentsArea';
import SemanticallyRelatedIncidents from './SemanticallyRelatedIncidents.js';

const relatedIncidentsQuery = gql`
  query ProbablyRelatedIncidents($query: IncidentQueryInput) {
    incidents(query: $query) {
      incident_id
      reports {
        report_number
        title
        url
      }
    }
  }
`;

const relatedIncidentIdsQuery = gql`
  query ProbablyRelatedIncidentIds($query: IncidentQueryInput) {
    incidents(query: $query) {
      incident_id
      reports {
        report_number
      }
    }
  }
`;

const relatedReportsQuery = gql`
  query ProbablyRelatedReports($query: ReportQueryInput) {
    reports(query: $query) {
      report_number
      title
      url
    }
  }
`;

const reportsWithIncidentIds = async (reports, client) => {
  if (reports.length == 0) {
    return [];
  }
  const response = await client.query({
    query: relatedIncidentIdsQuery,
    variables: {
      query: {
        reports_in: reports.map((report) => ({
          report_number: report.report_number,
        })),
      },
    },
  });

  return reports.map((report) => ({
    ...report,
    incident_id: response.data.incidents.filter((incident) =>
      incident.reports
        .map((incidentReport) => incidentReport.report_number)
        .includes(report.report_number)
    )[0].incident_id,
  }));
};

const searchColumns = {
  byDatePublished: {
    header: (incident) => (
      <>
        Incidents reports matched by published date: <b>{incident.date_published}</b>
      </>
    ),
    query: relatedReportsQuery,
    getReports: async (result, client) => reportsWithIncidentIds(result.data.reports, client),
    isSet: (incident) => {
      const parsedDate = parse(incident.date_published, 'yyyy-MM-dd', new Date());

      return isValid(parsedDate) && getUnixTime(parsedDate) > 0;
    },
    getQueryVariables: (incident) => {
      const datePublished = parse(incident.date_published, 'yyyy-MM-dd', new Date());

      const epoch_date_published_gt = getUnixTime(subWeeks(datePublished, 2));

      const epoch_date_published_lt = getUnixTime(addWeeks(datePublished, 2));

      return { epoch_date_published_gt, epoch_date_published_lt };
    },
  },

  byIncidentId: {
    header: (incident) => (
      <>
        Incidents reports matched by ID: <b>{incident.incident_id}</b>
      </>
    ),
    query: relatedIncidentsQuery,
    getReports: async (result) =>
      result.data.incidents.length ? result.data.incidents[0].reports : [],
    isSet: (incident) => incident.incident_id,
    getQueryVariables: (incident) => ({ incident_id_in: [incident.incident_id] }),
  },

  byAuthors: {
    header: (incident) => (
      <>
        Incidents reports matched by authors: <b>{incident.authors}</b>
      </>
    ),
    query: relatedReportsQuery,
    getReports: async (result, client) => reportsWithIncidentIds(result.data.reports, client),
    isSet: (incident) => incident.authors,
    getQueryVariables: (incident) => ({
      authors_in: isArray(incident.authors) ? incident.authors : incident.authors.split(','),
    }),
  },

  byURL: {
    header: (incident) => (
      <>
        Incidents reports matched by URL: <b>{incident.url}</b>
      </>
    ),
    query: relatedReportsQuery,
    getReports: async (result, client) => reportsWithIncidentIds(result.data.reports, client),
    isSet: (incident) => incident.url,
    getQueryVariables: (incident) => ({ url_in: [incident.url] }),
  },
};

const RelatedIncidents = ({ incident, editable = true, className = '' }) => {
  const [loading, setLoading] = useState({});

  const [relatedReports, setRelatedReports] = useState({});

  const [queryVariables, setQueryVariables] = useState({});

  const client = useApolloClient();

  const debouncedUpdateSearch = useRef(
    debounce((updaters, incident) => {
      const variables = {};

      for (const key in updaters) {
        const updater = updaters[key];

        if (updater.isSet(incident)) {
          variables[key] = updater.getQueryVariables(incident);
        } else {
          variables[key] = null;
        }
      }

      setQueryVariables(variables);
    }, 1000)
  ).current;

  useEffect(() => {
    debouncedUpdateSearch(searchColumns, incident);
  }, [incident.authors, incident.incident_id, incident.date_published, incident.url]);

  const search = useCallback(
    async (key, column) => {
      if (queryVariables[key]) {
        const variables = { query: queryVariables[key] };

        const query = column.query;

        setLoading((loading) => ({ ...loading, [key]: true }));

        const result = await client.query({ query, variables });

        const reports = await column.getReports(result, client);

        setLoading((loading) => ({ ...loading, [key]: false }));

        setRelatedReports((related) => ({ ...related, [key]: reports }));
      } else {
        setRelatedReports((related) => ({ ...related, [key]: null }));
      }
    },
    [queryVariables]
  );

  useEffect(() => {
    for (const key in searchColumns) {
      const column = searchColumns[key];

      search(key, column);
    }
  }, [queryVariables]);

  if (Object.keys(relatedReports).every((key) => relatedReports?.[key]?.length == 0)) {
    return (
      <div className="mt-4" data-cy="empty-message">
        Preliminary checks failed to find incident reports with similar publication dates (+/- 2
        weeks), similar incident dates (+/- 1 month), the same report URL, or the same authors.
      </div>
    );
  }

  return (
    <ListGroup data-cy="related-reports" className={className}>
      {Object.keys(searchColumns).map((key) => {
        const column = searchColumns[key];

        return (
          <RelatedIncidentsArea
            key={key}
            columnKey={key}
            loading={loading[key]}
            reports={relatedReports[key]}
            header={column.header(incident)}
            editable={editable}
          />
        );
      })}

      <SemanticallyRelatedIncidents incident={incident} editable={editable} />
    </ListGroup>
  );
};

export default RelatedIncidents;
