import React, { useEffect, useState, useRef } from 'react';
import { gql, useApolloClient } from '@apollo/client';
import debounce from 'lodash/debounce';
import RelatedIncidentsArea from './RelatedIncidentsArea';
import { stripMarkdown } from '../utils/typography';

const relatedIncidentIdsQuery = gql`
  query ProbablyRelatedIncidentIds($query: IncidentQueryInput) {
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

const semanticallyRelated = async (text) => {
  const url = `/api/semanticallyRelated?text=${text}`;

  let controller = new AbortController();

  setTimeout(() => controller.abort(), 33000);
  const response = await fetch(url, {
    signal: controller.signal,
  });

  if (!response?.ok) {
    throw new Error('Semantic relation error');
  }
  const json = await response.json();

  return json;
};

const SemanticallyRelatedIncidents = ({ incident, editable }) => {
  const [loading, setLoading] = useState(false);

  const [reports, setReports] = useState([]);

  const client = useApolloClient();

  const [error, setError] = useState(null);

  const debouncedUpdateSearch = useRef(
    debounce(async (incident) => {
      setLoading(true);
      setReports([]);
      setError(null);

      const fail = (errorMessage) => {
        setReports([]);
        setError(errorMessage);
        setLoading(false);
      };

      const plaintext = await stripMarkdown(incident.text);

      const minLength = 256;

      if (plaintext.replace(/\s/, '').length < minLength) {
        fail(
          `Reports must have at least ${minLength} non-space characters to compute semantic similarity.`
        );
        return;
      }

      let nlpResponse;

      try {
        nlpResponse = await semanticallyRelated(plaintext);
      } catch (e) {
        console.error(error);
        fail('Could not compute semantic similarity');
        return;
      }

      const incidentIds = nlpResponse.incidents
        .sort((a, b) => b.similarity - a.similarity)
        .map((incident) => incident.incident_id);

      let dbResponse;

      try {
        dbResponse = await client.query({
          query: relatedIncidentIdsQuery,
          variables: {
            query: {
              incident_id_in: incidentIds,
            },
          },
        });
      } catch (e) {
        console.error(e);
        fail('Could not retrieve related incidents from database');
      }

      setReports(
        dbResponse.data.incidents.reduce(
          (reports, incident) =>
            reports.concat(
              incident.reports.map((report) => ({
                incident_id: incident.incident_id,
                ...report,
              }))
            ),
          []
        )
      );

      setLoading(false);
    }, 2000)
  ).current;

  useEffect(() => {
    debouncedUpdateSearch(incident);
  }, [incident.text]);

  return (
    incident.text.length > 0 && (
      <RelatedIncidentsArea
        key="byText"
        columnKey="byText"
        loading={loading}
        reports={reports}
        header="Most Semantically Similar Incident Reports (Experimental)"
        editable={editable}
        error={error}
      />
    )
  );
};

export default SemanticallyRelatedIncidents;
