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
    <Card data-cy="similar-incident-card" className="relative pb-8 overflow-hidden">
      <LocalizedLink to={`/cite/${incident.incident_id}`} data-cy="cite-link">
        {(incident.reports[0].cloudinary_id || incident.reports[0]?.image_url) && (
          <Image
            className="object-cover w-full aspect-[16/9]"
            publicID={
              incident.reports[0]?.cloudinary_id || `legacy/${md5(incident.reports[0]?.image_url)}`
            }
            transformation={fill().height(480)}
            alt=""
            title={incident.title}
            itemIdentifier={t('Incident {{id}}', { id: incident.incident_id }).replace(' ', '.')}
          />
        )}

        <h3 className="text-lg m-4">
          {locale == 'en' && incident.title ? incident.title : incident.reports[0].title}
        </h3>
      </LocalizedLink>
      <div className="flex w-full flex-row items-center font-bold mt-0 absolute pr-4 bottom-4">
        <div className="text-muted-gray text-sm mx-4">
          {parsedDate && (
            <>
              <time dateTime={formatISO(parsedDate)}>{format(parsedDate, 'MMM yyyy')}</time> ·{' '}
            </>
          )}
          <span>
            {incident.reports.length} {incident.reports.length == 1 ? t('report') : t('reports')}
          </span>
        </div>
        <div className="inline-block ml-auto mr-auto" />

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
  orientation = null,
  className = '',
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
    <div className={`tw-similar-incidents ${className}`}>
      {(editor_similar_incidents.length > 0 || nlp_only_incidents.length > 0) && (
        <h2 id="similar-incidents" className="leading-9">
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
          <div
            className={(orientation == 'column' ? 'flex flex-col gap-5' : 'tw-card-set') + ' mt-5'}
          >
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
          <p className="tw-flag-prompt mt-2">
            <Trans>
              Did <strong>our</strong> AI mess up? Flag <FontAwesomeIcon icon={faFlag} /> the
              unrelated incidents
            </Trans>
          </p>
          <div
            className={(orientation == 'column' ? 'flex flex-col gap-5' : 'tw-card-set') + ' mt-5'}
          >
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
