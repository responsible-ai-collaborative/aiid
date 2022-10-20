import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag, faQuestionCircle, faEdit } from '@fortawesome/free-solid-svg-icons';
import { useMutation } from '@apollo/client/react/hooks';
import { UPDATE_INCIDENT } from '../../graphql/incidents';
import { useUserContext } from 'contexts/userContext';
import useToastContext, { SEVERITY } from '../../hooks/useToast';
import Button from '../../elements/Button';
import { LocalizedLink } from 'gatsby-theme-i18n';
import { Trans, useTranslation } from 'react-i18next';
import Link from 'components/ui/Link';
import IncidentReportCard, { CardBottomRight } from 'components/IncidentReportCard';

const blogPostUrl = '/blog/using-ai-to-connect-ai-incidents';

const SimilarIncidentCard = ({ incident, flaggable = true, flagged, parentIncident }) => {
  const { isRole } = useUserContext();

  const { t } = useTranslation();

  const [isFlagged, setFlagged] = useState(flagged && isRole('incident_editor'));

  const [updateIncident] = useMutation(UPDATE_INCIDENT);

  const addToast = useToastContext();

  return (
    <IncidentReportCard incident={incident} data-cy="similar-incident-card">
      <CardBottomRight position="rightCorner">
        {flaggable && (
          <Button
            variant="link"
            className={`tw-flag-button ${isFlagged ? ' flagged' : ''} z-3`}
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
          </Button>
        )}
      </CardBottomRight>
    </IncidentReportCard>
  );
};

const SimilarIncidents = ({
  parentIncident,
  nlp_similar_incidents,
  editor_similar_incidents,
  editor_dissimilar_incidents,
  flagged_dissimilar_incidents,
}) => {
  const { isRole, loading } = useUserContext();

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
    <div className="tw-similar-incidents">
      {(editor_similar_incidents.length > 0 || nlp_only_incidents.length > 0) && (
        <h2 id="similar-incidents">
          <LocalizedLink to={'/summaries/spatial?incident=' + parentIncident.incident_id}>
            <Trans>Similar Incidents</Trans>
          </LocalizedLink>
        </h2>
      )}
      {editor_similar_incidents.length > 0 && (
        <>
          <div className="tw-subtitle">
            <Trans>Selected by our editors</Trans>
            {!loading && isRole('incident_editor') && (
              <a
                className="tw-edit-icon"
                href={`/incidents/edit?incident_id=${parentIncident.incident_id}#similar-incidents`}
                title="Change the displayed similar incidents"
                data-cy="edit-similar-incidents"
              >
                <FontAwesomeIcon icon={faEdit} />
              </a>
            )}
          </div>
          <div className="tw-card-set mt-4">
            {editor_similar_incidents.map((similarIncident) => (
              <SimilarIncidentCard
                incident={similarIncident}
                flaggable={false}
                key={similarIncident.incident_id}
              />
            ))}
          </div>
        </>
      )}

      {nlp_only_incidents.length > 0 && (
        <>
          <div className="tw-subtitle">
            <Trans>By textual similarity</Trans>
            <span className="tw-actions-icons">
              {blogPostUrl && (
                <Link to={blogPostUrl} data-cy="about-similar-incidents">
                  <FontAwesomeIcon icon={faQuestionCircle} />
                </Link>
              )}
              {!loading && isRole('incident_editor') && (
                <a
                  className="tw-edit-icon"
                  href={`/incidents/edit?incident_id=${parentIncident.incident_id}#similar-incidents`}
                  title="Change the displayed similar incidents"
                  data-cy="edit-similar-incidents"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </a>
              )}
            </span>
          </div>
          <hr />
          <p className="tw-flag-prompt">
            <Trans>
              Did <strong>our</strong> AI mess up? Flag <FontAwesomeIcon icon={faFlag} /> the
              unrelated incidents
            </Trans>
          </p>
          <div className="tw-card-set mt-4">
            {nlp_only_incidents.map((similarIncident) => (
              <SimilarIncidentCard
                incident={similarIncident}
                key={similarIncident.incident_id}
                flagged={flagged_dissimilar_incidents.includes(similarIncident.incident_id)}
                parentIncident={parentIncident}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SimilarIncidents;
