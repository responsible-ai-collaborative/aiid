import React, { useEffect, useState, useRef } from 'react';
import { gql, useApolloClient } from '@apollo/client';
import debounce from 'lodash/debounce';
import RelatedIncidentsArea from './RelatedIncidentsArea';
import { stripMarkdown } from '../utils/typography';
import { useFormikContext } from 'formik';

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
    console.error('/api/semanticallyRelated', response);
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

  const initialDisplay = useRef(true);

  const { setFieldValue } = editable ? useFormikContext() : { setFieldValue: null };

  const debouncedUpdateSearch = useRef(
    debounce(async (incident) => {
      setLoading(true);
      setReports([]);
      setError(null);
      if (setFieldValue) {
        setFieldValue('nlp_similar_incidents', []);
      }

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

      let nlp_similar_incidents;

      if (
        incident.nlp_similar_incidents &&
        incident.nlp_similar_incidents.length > 0 &&
        initialDisplay.current
      ) {
        nlp_similar_incidents = incident.nlp_similar_incidents.map((similarIncident) => ({
          ...similarIncident,
          __typename: undefined,
        }));
      } else {
        try {
          nlpResponse = await semanticallyRelated(plaintext);
          nlp_similar_incidents = nlpResponse.incidents.sort((a, b) => b.similarity - a.similarity);
        } catch (e) {
          console.error(error);
          fail('Could not compute semantic similarity');
          return;
        }
      }

      if (setFieldValue) {
        setFieldValue('nlp_similar_incidents', nlp_similar_incidents);
      }

      const incidentIds = nlp_similar_incidents.map((incident) => incident.incident_id);

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
      initialDisplay.current = false;
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
