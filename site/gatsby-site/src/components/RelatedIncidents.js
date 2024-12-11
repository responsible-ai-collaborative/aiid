import React, { useEffect, useState, useCallback, useRef } from 'react';
import { subWeeks, addWeeks, getUnixTime, parse, isValid } from 'date-fns';
import { gql, useApolloClient } from '@apollo/client';
import debounce from 'lodash/debounce';
import isArray from 'lodash/isArray';
import { Trans } from 'react-i18next';
import RelatedIncidentsArea from './RelatedIncidentsArea';

const relatedIncidentsQuery = gql`
  query ProbablyRelatedIncidents($filter: IncidentFilterType) {
    incidents(filter: $filter) {
      incident_id
      title
      reports {
        report_number
        title
        url
      }
    }
  }
`;

const relatedReportsQuery = gql`
  query ProbablyRelatedReports($filter: ReportFilterType) {
    reports(filter: $filter) {
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
    query: relatedIncidentsQuery,
    variables: {
      filter: {
        reports: { IN: reports.map((report) => report.report_number) },
      },
    },
  });

  return reports.map((report) => {
    const incident = response.data.incidents.find((incident) =>
      incident.reports
        .map((incidentReport) => incidentReport.report_number)
        .includes(report.report_number)
    );

    return {
      ...report,
      title: report.title,
      incident_title: incident?.title,
      incident_id: incident?.incident_id,
    };
  });
};

const allSearchColumns = {
  byDatePublished: {
    header: (incident) => {
      const date = incident.date_published;

      return (
        <>
          <Trans date={date}>
            Incidents reports matched by published date: <b className="break-all">{{ date }}</b>
          </Trans>
        </>
      );
    },
    query: relatedReportsQuery,
    getReports: async (result, client) => reportsWithIncidentIds(result.data.reports, client),
    isSet: (incident) => {
      if (!incident.date_published) return false;
      const parsedDate = parse(incident.date_published, 'yyyy-MM-dd', new Date());

      return isValid(parsedDate) && getUnixTime(parsedDate) > 0;
    },
    getQueryVariables: (incident) => {
      const today = new Date();

      let datePublished = parse(incident.date_published, 'yyyy-MM-dd', today);

      if (datePublished > today) {
        datePublished = today;
      }

      const epoch_date_published_gt = getUnixTime(subWeeks(datePublished, 2));

      const epoch_date_published_lt = getUnixTime(addWeeks(datePublished, 2));

      return {
        epoch_date_published: { GT: epoch_date_published_gt, LT: epoch_date_published_lt },
      };
    },
  },

  byIncidentId: {
    header: (incident) => {
      const id = incident.incident_id;

      return (
        <>
          <Trans id={id}>
            Incident matched by ID: <b>{{ id }}</b>
          </Trans>
        </>
      );
    },
    query: relatedIncidentsQuery,
    getReports: async (result) =>
      result.data.incidents.length ? result.data.incidents[0].reports : [],
    getIncidents: async (result) => result.data.incidents,
    isSet: (incident) => incident.incident_ids && incident.incident_ids.length,
    getQueryVariables: (incident) => ({ incident_id: { IN: incident.incident_ids } }),
    editSimilar: false,
    editId: false,
    showIncidents: true,
  },

  byAuthors: {
    header: (incident) => {
      const authors = incident.authors;

      return (
        <>
          <Trans authors={authors}>
            Incidents reports matched by authors: <b className="break-words">{{ authors }}</b>
          </Trans>
        </>
      );
    },
    query: relatedReportsQuery,
    getReports: async (result, client) => reportsWithIncidentIds(result.data.reports, client),
    isSet: (incident) => incident.authors,
    getQueryVariables: (incident) => ({
      authors: { IN: isArray(incident.authors) ? incident.authors : incident.authors.split(',') },
    }),
  },

  byURL: {
    header: (incident) => {
      const url = incident.url;

      return (
        <>
          <Trans url={url}>
            Incidents reports matched by URL: <b className="break-all">{{ url }}</b>
          </Trans>
        </>
      );
    },
    query: relatedReportsQuery,
    getReports: async (result, client) => reportsWithIncidentIds(result.data.reports, client),
    isSet: (incident) => incident.url,
    getQueryVariables: (incident) => ({ url: { IN: [incident.url] } }),
    editSimilar: false,
  },
};

const RelatedIncidents = ({
  incident,
  setFieldValue = null,
  columns = Object.keys(allSearchColumns),
}) => {
  const searchColumns = {};

  for (const column of columns) {
    searchColumns[column] = allSearchColumns[column];
  }

  const [loading, setLoading] = useState({});

  const [relatedReports, setRelatedReports] = useState({});

  const [relatedIncidents, setRelatedIncidents] = useState({});

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
  }, [incident.authors, incident.incident_ids, incident.date_published, incident.url]);

  const search = useCallback(
    async (key, column) => {
      if (queryVariables[key]) {
        if (key != 'byText') {
          setLoading((loading) => ({ ...loading, [key]: true }));
        }
        const variables = { filter: queryVariables[key] };

        const query = column.query;

        const result = await client.query({ query, variables });

        let reports = await column.getReports(result, client);

        setLoading((loading) => ({ ...loading, [key]: false }));

        reports = reports.filter((r) => r.incident_id);

        setRelatedReports((related) => ({ ...related, [key]: reports }));

        if (searchColumns[key].showIncidents) {
          const incidents = await column.getIncidents(result, client);

          setRelatedIncidents((related) => ({ ...related, [key]: incidents }));
        }
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

  return (
    <div data-cy="related-reports">
      {Object.keys(searchColumns).map((key) => {
        const column = searchColumns[key];

        return (
          <RelatedIncidentsArea
            key={key}
            columnKey={key}
            loading={loading[key]}
            reports={searchColumns[key].showIncidents ? null : relatedReports[key]}
            incidents={searchColumns[key].showIncidents ? relatedIncidents[key] : null}
            header={column.header(incident)}
            setFieldValue={setFieldValue}
            {...{
              editId: column.editId,
              editSimilar: column.editSimilar,
            }}
          />
        );
      })}
    </div>
  );
};

export default RelatedIncidents;
