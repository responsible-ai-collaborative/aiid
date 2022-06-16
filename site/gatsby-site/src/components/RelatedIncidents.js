import React, { useEffect, useState, useCallback, useRef } from 'react';
import { ListGroup, Card, Spinner } from 'react-bootstrap';
import { subWeeks, addWeeks, getUnixTime, parse, isValid } from 'date-fns';
import styled from 'styled-components';
import { gql, useApolloClient } from '@apollo/client';
import debounce from 'lodash/debounce';
import isArray from 'lodash/isArray';
import { stripMarkdown } from '../utils/typography';
import { useFormikContext } from 'formik';
import { Button } from 'react-bootstrap';

const ListContainer = styled(Card)`
  margin: 1em 0;
`;

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

const relatedReportsQuery = gql`
  query ProbablyRelatedReports($query: ReportQueryInput) {
    reports(query: $query) {
      report_number
      title
      url
    }
  }
`;

const minLength = 300;

const searchColumns = {
  byDatePublished: {
    header: (incident) => (
      <>
        Incidents reports matched by published date: <b>{incident.date_published}</b>
      </>
    ),
    query: relatedReportsQuery,
    getReports: (result) => result.data.reports,
    isSet: (incident) =>
      incident.date_published && isValid(parse(incident.date_published, 'yyyy-MM-dd', new Date())),
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
    getReports: (result) => (result.data.incidents.length ? result.data.incidents[0].reports : []),
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
    getReports: (result) => result.data.reports,
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
    getReports: (result) => result.data.reports,
    isSet: (incident) => incident.url,
    getQueryVariables: (incident) => ({ url_in: [incident.url] }),
  },

  byText: {
    header: () => <>Most Semantically Similar Incident Reports (Experimental)</>,
    query: relatedIncidentsQuery,
    //getReports: (result) => (result.data.incidents.length ? result.data.incidents[0].reports : []),
    getReports: (result) => (
      console.log('result', result),
      result.data.incidents.reduce((reports, incident) => {
        const incident_id = incident.incident_id;

        return reports.concat(incident.reports.map((report) => ({ incident_id, ...report })));
      }, [])
    ),
    /*getReports: (result) => (
      result.data.incidents.length 
        ? result.data.incidents[0].reports.map(report => {
            const incident_id = result.data.incidents[0].incident_id;
            return {incident_id, ...report};
          })
        : []
    ),*/
    isSet: (incident) => incident.text,
    getQueryVariables: (incident, relatedIncidents) => {
      if (relatedIncidents) {
        return { incident_id_in: relatedIncidents };
      } else {
        return { incident_id_in: [] };
      }
    },
  },
};

const semanticallyRelated = async (text) => {
  const url = `/api/semanticallyRelated?text=${encodeURIComponent(text)}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Semantic relation error');
  }
  const json = await response.json();

  console.log('json', json);

  return json;
};

const ReportRow = styled(ListGroup.Item)`
  display: flex !important;
  align-items: center;
  a:first-child {
    flex-shrink: 1;
    margin-right: auto;
  }
  Button {
    margin-left: 1ch;
    flex-shrink: 0 !important;
  }
`;

const RelatedIncidentsArea = ({ columnKey, header, reports, loading, plaintext }) => {
  const { setFieldValue } = useFormikContext();

  if (!reports && !loading) {
    return null;
  }

  return (
    <ListContainer data-cy={`related-${columnKey}`}>
      <ListGroup.Item variant="secondary" key={'header'}>
        {header}
        {loading && <Spinner animation="border" size="sm" className="ms-2" />}
      </ListGroup.Item>
      {reports &&
        reports.map((val) => (
          <ReportRow key={val.url}>
            <a href={val.url} target="_blank" rel="noreferrer">
              {val.title}
            </a>
            {val.incident_id && (
              <Button onClick={() => setFieldValue('incident_id', val.incident_id)}>
                Set&nbsp;Incident&nbsp;ID&nbsp;to&nbsp;{val.incident_id}
              </Button>
            )}
          </ReportRow>
        ))}
      {!loading && reports?.length == 0 && (
        <ListGroup.Item>
          {columnKey == 'byText' && plaintext.length < minLength
            ? `Reports must have at least ${minLength} characters to compute semantic similarity`
            : 'No related reports found.'}
        </ListGroup.Item>
      )}
    </ListContainer>
  );
};

const RelatedIncidents = ({ incident, className = '' }) => {
  const [loading, setLoading] = useState({});

  const [relatedReports, setRelatedReports] = useState({});

  const [queryVariables, setQueryVariables] = useState({});

  const [relatedIncidents, setRelatedIncidents] = useState([]);

  const client = useApolloClient();

  const [plaintext, setPlaintext] = useState(incident.text);

  const debouncedUpdateSearch = useRef(
    debounce((updaters, incident, relatedIncidents, fetchRemote, plaintext) => {
      const fetchSemanticallyRelated = async () => {
        if (plaintext && plaintext.length >= minLength) {
          const response = semanticallyRelated(plaintext);

          response.then((res) => {
            console.log('res.incidents', res.incidents);
            setRelatedIncidents(res.incidents);
          });
        } else {
          setRelatedIncidents([]);
        }
      };

      if (fetchRemote || relatedIncidents.length == 0) fetchSemanticallyRelated();

      const variables = {};

      for (const key in updaters) {
        const updater = updaters[key];

        if (updater.isSet(incident)) {
          variables[key] = updater.getQueryVariables(incident, relatedIncidents);
        } else {
          variables[key] = null;
        }
      }

      setQueryVariables(variables);
    }, 1000)
  ).current;

  useEffect(() => {
    stripMarkdown(incident.text).then((plaintext) => {
      setPlaintext(plaintext);
      debouncedUpdateSearch(searchColumns, incident, relatedIncidents, true, plaintext);
    });
  }, [incident]);

  useEffect(() => {
    debouncedUpdateSearch(searchColumns, incident, relatedIncidents, false);
  }, [relatedIncidents]);

  const search = useCallback(
    async (key, column) => {
      if (queryVariables[key]) {
        const variables = { query: queryVariables[key] };

        const query = column.query;

        setLoading((loading) => ({ ...loading, [key]: true }));

        const result = await client.query({ query, variables });

        setLoading((loading) => ({ ...loading, [key]: false }));

        const reports = column.getReports(result);

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
            plaintext={plaintext}
            incident={incident}
          />
        );
      })}
    </ListGroup>
  );
};

export default RelatedIncidents;
