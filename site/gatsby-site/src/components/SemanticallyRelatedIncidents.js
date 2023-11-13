import React, { useEffect, useState, useRef } from 'react';
import { gql, useApolloClient } from '@apollo/client';
import debounce from 'lodash/debounce';
import RelatedIncidentsArea from './RelatedIncidentsArea';
import { stripMarkdown } from '../utils/typography';
import { useTranslation } from 'react-i18next';

const relatedIncidentIdsQuery = gql`
  query ProbablyRelatedIncidentIds($query: IncidentQueryInput) {
    incidents(query: $query) {
      incident_id
      title
    }
  }
`;

const semanticallyRelated = async (text) => {
  const url = `/api/semanticallyRelated`;

  let controller = new AbortController();

  setTimeout(() => controller.abort(), 66000);
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({ text }),
    signal: controller.signal,
  });

  if (!response?.ok) {
    console.error('/api/semanticallyRelated', response);
    throw new Error('Semantic relation error');
  }
  const json = await response.json();

  return json;
};

const SemanticallyRelatedIncidents = ({ incident, setFieldValue, editId = true }) => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);

  const [incidents, setIncidents] = useState([]);

  const client = useApolloClient();

  const [error, setError] = useState(null);

  const initialDisplay = useRef(true);

  const debouncedUpdateSearch = useRef(
    debounce(async (incident) => {
      setLoading(true);
      setIncidents([]);
      setError(null);
      if (setFieldValue) {
        setFieldValue('nlp_similar_incidents', []);
      }

      const fail = (errorMessage) => {
        setIncidents([]);
        setError(errorMessage);
        setLoading(false);
      };

      const plaintext = await stripMarkdown(incident.text);

      const minLength = 256;

      const textLength = plaintext.replace(/\s/, '')?.length;

      const displayingCached =
        initialDisplay.current && incident?.nlp_similar_incidents?.length > 0;

      if (textLength < minLength && !displayingCached) {
        fail(
          t(
            `Reports must have at least ${minLength} non-space characters to compute semantic similarity.`
          )
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

          if (setFieldValue) setFieldValue('embedding', nlpResponse.embedding);
        } catch (e) {
          console.error(error);
          fail(t('Could not compute semantic similarity'));
          return;
        }
      }

      if (setFieldValue) {
        setFieldValue('nlp_similar_incidents', nlp_similar_incidents);
      }

      const incidentIds = nlp_similar_incidents
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
        fail(t('Could not retrieve related incidents from database'));
      }

      setIncidents(dbResponse.data.incidents);

      setLoading(false);
      initialDisplay.current = false;
    }, 2000)
  ).current;

  useEffect(() => {
    debouncedUpdateSearch(incident);
  }, [incident.text]);

  return (
    <div data-cy="semantically-related-incidents" className="flex">
      {incident?.text?.length > 0 && (
        <RelatedIncidentsArea
          key="byText"
          columnKey="byText"
          loading={loading}
          incidents={incidents}
          header={t('Most Semantically Similar Incidents (Experimental)')}
          setFieldValue={setFieldValue}
          editId={editId}
          error={error}
        />
      )}
    </div>
  );
};

export default SemanticallyRelatedIncidents;
