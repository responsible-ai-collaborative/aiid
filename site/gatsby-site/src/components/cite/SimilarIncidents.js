import React, { useState } from 'react';
import styled from 'styled-components';
import { Card, Button } from 'react-bootstrap';
import { formatISO, format, parse } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { Image } from '../../utils/cloudinary';
import { fill } from '@cloudinary/base/actions/resize';
import md5 from 'md5';

const blogPostUrl = null;

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
    margin-top: 1rem;
  }
`;

const IncidentCardImage = styled(Image)`
  object-fit: cover;
  width: calc(100% + 2.5em);
  max-width: calc(100% + 2.5em);
  margin: -1.25em -1.25em 0em -1.25em !important;
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
  &:hover {
    color: var(--bs-gray-500) !important;
  }
  &.flagged {
    color: var(--bs-red) !important;
  }
`;

const SimilarIncidentCard = ({ incident, flaggable = true }) => {
  const parsedDate = incident.date ? parse(incident.date, 'yyyy-MM-dd', new Date()) : null;

  const [flagged, setFlagged] = useState(false);

  return (
    <Card>
      <Card.Body>
        <a href={'/cite/' + incident.incident_id}>
          <IncidentCardImage
            publicID={
              incident.reports[0].cloudinary_id || `legacy/${md5(incident.reports[0].image_url)}`
            }
            alt=""
            transformation={fill().height(480)}
          />
          <h3>{incident.title || incident.reports[0].title}</h3>
        </a>
        <CardFooter>
          <div className="text-muted">
            {parsedDate && (
              <>
                <time dateTime={formatISO(parsedDate)}>{format(parsedDate, 'MMM yyyy')}</time> ·{' '}
              </>
            )}
            <span>
              {incident.reports.length} {incident.reports.length == 1 ? 'report' : 'reports'}
            </span>
          </div>
          <FlexSeparator />

          {flaggable && (
            <FlagButton
              variant="link"
              className={flagged ? ' flagged' : ''}
              onClick={() => setFlagged(!flagged)}
            >
              <FontAwesomeIcon icon={faFlag} />
            </FlagButton>
          )}
        </CardFooter>
      </Card.Body>
    </Card>
  );
};

const SimilarIncidents = ({
  nlp_similar_incidents,
  editor_similar_incidents,
  editor_dissimilar_incidents,
}) => {
  if (nlp_similar_incidents.length == 0) return null;

  const nlp_only_incidents = nlp_similar_incidents.filter(
    (similarIncident) =>
      !(
        editor_similar_incidents.map((e) => e.incident_id).includes(similarIncident.incident_id) ||
        editor_dissimilar_incidents.map((e) => e.incident_id).includes(similarIncident.incident_id)
      )
  );

  return (
    <SimilarIncidentsList>
      {editor_similar_incidents && (
        <>
          <h2 id="similar-incidents">Similar Incidents</h2>
          <Subtitle>Selected by our editors</Subtitle>
          {editor_similar_incidents.map((similarIncident) => (
            <SimilarIncidentCard
              incident={similarIncident}
              flaggable={false}
              key={similarIncident.incident_id}
            />
          ))}
        </>
      )}

      {nlp_only_incidents.length > 0 && (
        <>
          <Subtitle>
            By textual similarity
            {blogPostUrl && (
              <a href={blogPostUrl}>
                <FontAwesomeIcon icon={faQuestionCircle} />
              </a>
            )}
          </Subtitle>
          <hr />
          <FlagPrompt className="text-muted">
            Did <strong>our</strong> AI mess up? Flag <FontAwesomeIcon icon={faFlag} /> the
            unrelated incidents
          </FlagPrompt>
          {nlp_only_incidents.map((similarIncident) => (
            <SimilarIncidentCard incident={similarIncident} key={similarIncident.incident_id} />
          ))}
        </>
      )}
    </SimilarIncidentsList>
  );
};

export default SimilarIncidents;
