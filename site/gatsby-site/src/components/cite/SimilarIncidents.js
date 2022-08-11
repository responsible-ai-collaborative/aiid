import React, { useState } from 'react';
import styled from 'styled-components';
import { Card, Button } from 'react-bootstrap';
import { formatISO, format, parse } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag, faQuestionCircle, faEdit } from '@fortawesome/free-solid-svg-icons';
import { Image } from '../../utils/cloudinary';
import { fill } from '@cloudinary/base/actions/resize';
import { useMutation } from '@apollo/client/react/hooks';
import { UPDATE_INCIDENT } from '../../graphql/incidents';
import md5 from 'md5';
import { useUserContext } from 'contexts/userContext';
import useToastContext, { SEVERITY } from '../../hooks/useToast';
import { useLocalization } from 'gatsby-theme-i18n';
import { Trans, useTranslation } from 'react-i18next';
import Link from 'components/ui/Link';

const blogPostUrl = '/blog/using-ai-to-connect-ai-incidents';

const SimilarIncidentsList = styled.div`
  margin-top: 2em;
  margin-bottom: 2em;

  .card {
    overflow: hidden;
    box-shadow: 0 2px 5px 0px #e3e5ec;

    a:not(:hover) {
      color: inherit;
    }
    h3 {
      margin: 1rem 1rem 0.5rem 1rem;
      font-size: 16pt;
      hyphens: auto;
    }
  }
  p + .card {
    margin-top: 0px;
  }
  h2 {
    font-size: 200%;
  }
`;

const IncidentCardImage = styled(Image)`
  object-fit: cover;
  width: 100%;
  aspect-ratio: 16 / 9;
`;

const CardFooter = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-weight: 500;
  margin: 0rem 1rem 1rem 1rem;
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

const ActionIcons = styled.span`
  display: inline-flex;
  align-items: center;
  > * {
    margin-left: 0.25ch;
    margin-right: 0.25ch;
  }
`;

const EditIcon = styled.a`
  vertical-align: middle;
  margin-top: -0.125em;
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

const CardSet = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1em;
  margin-bottom: 2em;
  @media (min-width: 1300px) {
    flex-direction: row;

    > * {
      flex-basis: 0;
      flex-grow: 1;
    }
  }

  > * {
    max-width: 700px;
  }
`;

const SimilarIncidentCard = ({ incident, flaggable = true, flagged, parentIncident }) => {
  const parsedDate = incident.date ? parse(incident.date, 'yyyy-MM-dd', new Date()) : null;

  const { isRole } = useUserContext();

  const { locale } = useLocalization();

  const { t } = useTranslation();

  const [isFlagged, setFlagged] = useState(flagged && isRole('incident_editor'));

  const [updateIncident] = useMutation(UPDATE_INCIDENT);

  const addToast = useToastContext();

  return (
    <Card data-cy="similar-incident-card">
      <a href={'/cite/' + incident.incident_id} data-cy="cite-link">
        <IncidentCardImage
          publicID={
            incident.reports[0].cloudinary_id || `legacy/${md5(incident.reports[0].image_url)}`
          }
          transformation={fill().height(480)}
          alt=""
        />
        <h3>{locale == 'en' && incident.title ? incident.title : incident.reports[0].title}</h3>
      </a>
      <CardFooter>
        <div className="text-muted">
          {parsedDate && (
            <>
              <time dateTime={formatISO(parsedDate)}>{format(parsedDate, 'MMM yyyy')}</time> ·{' '}
            </>
          )}
          <span>
            {incident.reports.length} {incident.reports.length == 1 ? t('report') : t('reports')}
          </span>
        </div>
        <FlexSeparator />

        {flaggable && (
          <FlagButton
            variant="link"
            className={isFlagged ? ' flagged' : ''}
            data-cy="flag-similar-incident"
            onClick={async () => {
              await updateIncident({
                variables: {
                  query: { incident_id: parentIncident.incident_id },
                  set: {
                    flagged_dissimilar_incidents: isFlagged
                      ? parentIncident.flagged_dissimilar_incidents.filter(
                          (e) => e != incident.incident_id
                        )
                      : parentIncident.flagged_dissimilar_incidents
                          .filter((e) => e != incident.incident_id)
                          .concat([incident.incident_id]),
                  },
                },
              });
              addToast({
                message: isFlagged
                  ? t(`Flag reverted.`)
                  : t(
                      `Incident flagged successfully. Our editors will remove it from this list if it not relevant.`
                    ),
                severity: SEVERITY.success,
              });
              setFlagged(!isFlagged);
            }}
          >
            <FontAwesomeIcon icon={faFlag} />
          </FlagButton>
        )}
      </CardFooter>
    </Card>
  );
};

const SimilarIncidents = ({
  parentIncident,
  nlp_similar_incidents,
  editor_similar_incidents,
  editor_dissimilar_incidents,
  flagged_dissimilar_incidents,
}) => {
  const { isRole } = useUserContext();

  nlp_similar_incidents ||= [];
  editor_dissimilar_incidents ||= [];
  editor_similar_incidents ||= [];
  flagged_dissimilar_incidents ||= [];

  const nlp_only_incidents = nlp_similar_incidents.filter(
    (similarIncident) =>
      !(
        editor_similar_incidents.map((e) => e.incident_id).includes(similarIncident.incident_id) ||
        editor_dissimilar_incidents.map((e) => e.incident_id).includes(similarIncident.incident_id)
      )
  );

  return (
    <SimilarIncidentsList>
      {(editor_similar_incidents.length > 0 || nlp_only_incidents.length > 0) && (
        <h2 id="similar-incidents">
          <Trans>Similar Incidents</Trans>
        </h2>
      )}
      {editor_similar_incidents.length > 0 && (
        <>
          <Subtitle>
            <Trans>Selected by our editors</Trans>
            {isRole('incident_editor') && (
              <EditIcon
                href={`/incidents/edit?incident_id=${parentIncident.incident_id}#similar-incidents`}
                title="Change the displayed similar incidents"
                data-cy="edit-similar-incidents"
              >
                <FontAwesomeIcon icon={faEdit} />
              </EditIcon>
            )}
          </Subtitle>
          <CardSet>
            {editor_similar_incidents.map((similarIncident) => (
              <SimilarIncidentCard
                incident={similarIncident}
                flaggable={false}
                key={similarIncident.incident_id}
              />
            ))}
          </CardSet>
        </>
      )}

      {nlp_only_incidents.length > 0 && (
        <>
          <Subtitle>
            <Trans>By textual similarity</Trans>
            <ActionIcons>
              {blogPostUrl && (
                <Link to={blogPostUrl} data-cy="about-similar-incidents">
                  <FontAwesomeIcon icon={faQuestionCircle} />
                </Link>
              )}
              {isRole('incident_editor') && (
                <EditIcon
                  href={`/incidents/edit?incident_id=${parentIncident.incident_id}#similar-incidents`}
                  title="Change the displayed similar incidents"
                  data-cy="edit-similar-incidents"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </EditIcon>
              )}
            </ActionIcons>
          </Subtitle>
          <hr />
          <FlagPrompt className="text-muted">
            <Trans>
              Did <strong>our</strong> AI mess up? Flag <FontAwesomeIcon icon={faFlag} /> the
              unrelated incidents
            </Trans>
          </FlagPrompt>
          <CardSet>
            {nlp_only_incidents.map((similarIncident) => (
              <SimilarIncidentCard
                incident={similarIncident}
                key={similarIncident.incident_id}
                flagged={flagged_dissimilar_incidents.includes(similarIncident.incident_id)}
                parentIncident={parentIncident}
              />
            ))}
          </CardSet>
        </>
      )}
    </SimilarIncidentsList>
  );
};

export default SimilarIncidents;
