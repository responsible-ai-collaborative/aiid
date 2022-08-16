import React, { useState } from 'react';
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
import Card from '../../elements/Card';
import Button from '../../elements/Button';
import { useLocalization, LocalizedLink } from 'gatsby-theme-i18n';
import { Trans, useTranslation } from 'react-i18next';
import Link from 'components/ui/Link';

const blogPostUrl = '/blog/using-ai-to-connect-ai-incidents';

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
        <Image
          className="tw-object-cover tw-w-full tw-aspect-[16/9]"
          publicID={
            incident.reports[0].cloudinary_id || `legacy/${md5(incident.reports[0].image_url)}`
          }
          transformation={fill().height(480)}
          alt=""
        />
        <h3>{locale == 'en' && incident.title ? incident.title : incident.reports[0].title}</h3>
      </a>
      <div className="tw-flex tw-w-full tw-flex-row tw-items-center tw-font-bold tw-mt-0 tw-my-4 tw-mr-4">
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
        <div className="tw-inline-block tw-ml-auto tw-mr-auto" />

        {flaggable && (
          <Button
            variant="link"
            className={`tw-flag-button ${isFlagged ? ' flagged' : ''}`}
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
      </div>
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
    <div className="tw-similar-incidents">
      {(editor_similar_incidents.length > 0 || nlp_only_incidents.length > 0) && (
        <h2 id="similar-incidents">
          <LocalizedLink to="/summaries/spatial">
            <Trans>Similar Incidents</Trans>
          </LocalizedLink>
        </h2>
      )}
      {editor_similar_incidents.length > 0 && (
        <>
          <div className="tw-subtitle">
            <Trans>Selected by our editors</Trans>
            {isRole('incident_editor') && (
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
          <div className="tw-card-set">
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
              {isRole('incident_editor') && (
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
          <div className="tw-card-set">
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
