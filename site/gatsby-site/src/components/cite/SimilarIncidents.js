import React, { useState } from 'react';
import { gql, useApolloClient } from '@apollo/client';
import styled from 'styled-components';
import { Card, Button } from 'react-bootstrap';
import { format, parse } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag } from '@fortawesome/free-solid-svg-icons';
import { Image } from '../../utils/cloudinary';
import { fill } from '@cloudinary/base/actions/resize';
import md5 from 'md5';

const similarIncidentsQuery = gql`
  query SimilarIncidents($query: IncidentQueryInput) {
    incidents(query: $query) {
      incident_id
      title
      date
      reports {
        title
        report_number
        cloudinary_id
        image_url
      }
    }
  }
`;

const semanticallyRelated = async (text, num) => {
  const url = `/api/semanticallyRelated?num=${num}&text=${encodeURIComponent(text)}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Semantic relation error');
  }
  const json = await response.json();

  return json;
};

const SimilarIncidentsList = styled.div`
  margin-top: 2em;
  margin-bottom: 2em;
  .card {
    margin-top: 1.5em;
    margin-bottom: 1.5em;
    overflow: hidden;
    box-shadow: 0 2px 5px 0px #e3e5ec;
  }
  h3 {
    margin-top: 0.5em;
  }
`;

const IncidentCardImage = styled(Image)`
  object-fit: cover;
  width: calc(100% + 2.5em);
  max-width: calc(100% + 2.5em);
  margin: -1.25em -1.25em 0em -1.25em !important;
`;

const SimilarIncidents = ({ item }) => {
  const client = useApolloClient();

  const [similarIncidents, setSimilarIncidents] = useState([]);

  return similarIncidents.length > 0 ? (
    <SimilarIncidentsList>
      <h2>Similar Incidents</h2>
      <p>By textual similarity</p>
      <hr />
      <p>
        Did <strong>our</strong> AI mess up? Flag{' '}
        <FontAwesomeIcon icon={faFlag} className="fa-flag" /> unrelated incidents
      </p>
      {similarIncidents.map((incident) => (
        <Card key={incident.incident_id}>
          <Card.Body>
            <IncidentCardImage
              publicID={
                incident.reports[0].cloudinary_id || `legacy/${md5(incident.reports[0].image_url)}`
              }
              alt=""
              transformation={fill().height(480)}
            />
            <h3>
              <a href={'/cite/' + incident.incident_id}>
                {incident.title || incident.reports[0].title}
              </a>
            </h3>
            <time>{format(parse(incident.date, 'yyyy-MM-dd', new Date()), 'MMM yyyy')}</time> ·{' '}
            <span>
              {incident.reports.length} {incident.reports.length == 1 ? 'report' : 'reports'}
            </span>
          </Card.Body>
        </Card>
      ))}
    </SimilarIncidentsList>
  ) : (
    <Button
      style={{ marginBottom: '1.5em' }}
      onClick={async () => {
        console.log(item);
        const similarity = await semanticallyRelated(item.node.text, 4);

        const similarIncidentsResponse = await client.query({
          query: similarIncidentsQuery,
          variables: {
            query: {
              incident_id_in: similarity.incidents.map((e) => e.incident_id).slice(1),
            },
          },
        });

        setSimilarIncidents(similarIncidentsResponse.data.incidents);
      }}
    >
      Get similar incidents
    </Button>
  );
};

export default SimilarIncidents;
