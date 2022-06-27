import React, { useState, useEffect } from 'react';
import { gql, useApolloClient } from '@apollo/client';
import styled from 'styled-components';
import { Card, Button } from 'react-bootstrap';
import { format, parse } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
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

const similarIncidentIdsQuery = gql`
  query SimilarIncidentIds($query: IncidentQueryInput) {
    incidents(query: $query) {
      incident_id
      nlp_similar_incidents {
        incident_id
        similarity
      }
    }
  }
`;

const SimilarIncidentsList = styled.div`
  margin-top: 2em;
  margin-bottom: 2em;
  .card {
    margin-top: 1.5em;
    margin-bottom: 1.5em;
    overflow: hidden;
    box-shadow: 0 2px 5px 0px #e3e5ec;
    a:not(:hover) {
      color: inherit;
    }
  }
  p + .card {
    margin-top: 0px;
  }
  h2 {
    font-size: 200%;
  }
  h3 {
    margin-top: 0.5em;
  }
`;

const CardFooter = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  font-weight: 500;
`;

const FlexSeparator = styled.div`
  display: inline-block;
  margin-left: auto;
  margin-right: auto;
`;

const IncidentCardImage = styled(Image)`
  object-fit: cover;
  width: calc(100% + 2.5em);
  max-width: calc(100% + 2.5em);
  margin: -1.25em -1.25em 0em -1.25em !important;
`;

const Subtitle = styled.p`
  font-size: 120%;
  font-weight: bold;
  svg {
    margin-left: 0.5ch;
  }
`;

const FlagPrompt = styled.p`
  margin-top: 1em;
  margin-bottom: 1em;
  svg {
    margin-left: 0.5ch;
    margin-right: 0.5ch;
  }
`;

const FlagButton = styled(Button)`
  padding: 0px !important;
  color: var(--bs-gray-600) !important;
  :hover {
    color: var(--bs-red) !important;
  }
`;

const SimilarIncidents = ({ incident }) => {
  const client = useApolloClient();

  const [similarIncidents, setSimilarIncidents] = useState([]);

  useEffect(async () => {
    const similarity = await client.query({
      query: similarIncidentIdsQuery,
      variables: {
        query: { incident_id: incident.incident_id },
      },
    });

    const currentIncident = similarity.data.incidents[0];

    if (currentIncident.nlp_similar_incidents) {
      const similarIncidentsResponse = await client.query({
        query: similarIncidentsQuery,
        variables: {
          query: {
            incident_id_in: currentIncident.nlp_similar_incidents.map((e) => e.incident_id),
          },
        },
      });

      setSimilarIncidents(similarIncidentsResponse.data.incidents);
    }
  }, []);

  return similarIncidents.length > 0 ? (
    <SimilarIncidentsList>
      <h2 id="similar-incidents">
        <a href="#similar-incidents">Similar Incidents</a>
      </h2>
      <Subtitle>
        By textual similarity
        <FontAwesomeIcon icon={faQuestionCircle} className="fa-flag" />
      </Subtitle>
      <hr />
      <FlagPrompt className="text-muted">
        Did <strong>our</strong> AI mess up? Flag{' '}
        <FontAwesomeIcon icon={faFlag} className="fa-flag" /> unrelated incidents
      </FlagPrompt>
      {similarIncidents.map((incident) => (
        <Card key={incident.incident_id}>
          <Card.Body>
            <a href={'/cite/' + incident.incident_id}>
              <IncidentCardImage
                publicID={
                  incident.reports[0].cloudinary_id ||
                  `legacy/${md5(incident.reports[0].image_url)}`
                }
                alt=""
                transformation={fill().height(480)}
              />
              <h3>{incident.title || incident.reports[0].title}</h3>
            </a>
            <CardFooter>
              <div className="text-muted">
                <time>{format(parse(incident.date, 'yyyy-MM-dd', new Date()), 'MMM yyyy')}</time> ·{' '}
                <span>
                  {incident.reports.length} {incident.reports.length == 1 ? 'report' : 'reports'}
                </span>
              </div>
              <FlexSeparator />
              <FlagButton variant="link">
                <FontAwesomeIcon icon={faFlag} className="fa-flag" />
              </FlagButton>
            </CardFooter>
          </Card.Body>
        </Card>
      ))}
    </SimilarIncidentsList>
  ) : (
    ''
  );
};

export default SimilarIncidents;
