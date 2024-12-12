import React, { useCallback, useState } from 'react';
import { formatISO, format, parse } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag, faQuestionCircle, faEdit } from '@fortawesome/free-solid-svg-icons';
import { Image } from '../../utils/cloudinary';
import { fill } from '@cloudinary/base/actions/resize';
import { useMutation, useQuery } from '@apollo/client/react/hooks';
import { FIND_FULL_INCIDENT, FLAG_INCIDENT_SIMILARITY } from '../../graphql/incidents';
import md5 from 'md5';
import { useUserContext } from 'contexts/userContext';
import useToastContext, { SEVERITY } from '../../hooks/useToast';
import Button from '../../elements/Button';
import { useLocalization, LocalizedLink } from 'plugins/gatsby-theme-i18n';
import { Trans, useTranslation } from 'react-i18next';
import Link from 'components/ui/Link';

const blogPostUrl = '/blog/using-ai-to-connect-ai-incidents';

const SimilarIncidentCard = ({ incident, flaggable = true, flagged, parentIncident }) => {
  const parsedDate = incident.date ? parse(incident.date, 'yyyy-MM-dd', new Date()) : null;

  const { isRole, user } = useUserContext();

  const { locale } = useLocalization();

  const { t } = useTranslation();

  const [isFlagged, setFlagged] = useState(flagged && isRole('incident_editor'));

  const [flagSimilarity] = useMutation(FLAG_INCIDENT_SIMILARITY);

  const { data: incidentData } = useQuery(FIND_FULL_INCIDENT, {
    variables: { filter: { incident_id: { EQ: parentIncident.incident_id } } },
  });

  const addToast = useToastContext();

  const flagIncident = useCallback(async () => {
    const flagged_dissimilar_incidents = isFlagged
      ? parentIncident.flagged_dissimilar_incidents?.filter((e) => e != incident.incident_id)
      : parentIncident.flagged_dissimilar_incidents
          ?.filter((e) => e != incident.incident_id)
          .concat([incident.incident_id]);

    const editors = incidentData.incident.editors.map((e) => e.userId);

    // Add the current user to the list of editors
    if (user && user.providerType != 'anon-user' && !editors.includes(user.id)) {
      editors.push(user.id);
    }

    await flagSimilarity({
      variables: {
        incidentId: parentIncident.incident_id,
        dissimilarIds: flagged_dissimilar_incidents,
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
  }, [incidentData]);

  return (
    <div
      data-cy="similar-incident-card"
      className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 pb-4"
    >
      <LocalizedLink
        to={`/cite/${incident.incident_id}`}
        data-cy="cite-link"
        className="hover:no-underline"
      >
        {(incident.reports[0].cloudinary_id || incident.reports[0]?.image_url) && (
          <div className="object-cover w-full aspect-[16/9]">
            <Image
              publicID={
                incident.reports[0]?.cloudinary_id ||
                `legacy/${md5(incident.reports[0]?.image_url)}`
              }
              transformation={fill().height(480)}
              alt={incident.title}
              itemIdentifier={t('Incident {{id}}', { id: incident.incident_id }).replace(' ', '.')}
              className="rounded-t-lg"
            />
          </div>
        )}

        <h3 className="text-base m-4 text-gray-900 hover:text-primary-blue">
          {locale == 'en' && incident.title ? incident.title : incident.reports[0].title}
        </h3>
      </LocalizedLink>
      <div className="flex w-full flex-row items-center mt-0 pr-4 bottom-4">
        <div className="text-sm text-gray-500 dark:text-gray-400 mx-4">
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

        {flaggable && incidentData && (
          <Button
            variant="link"
            className={`p-0 hover:text-gray-500 ${
              isFlagged ? ' text-red-500' : 'text-dark-gray'
            } z-3`}
            data-cy="flag-similar-incident"
            onClick={() => flagIncident()}
          >
            <FontAwesomeIcon icon={faFlag} className="hover:text-primary-blue" />
          </Button>
        )}
      </div>
    </div>
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
    <div className={`tw-similar-incidents ${className || ''}`}>
      {(editor_similar_incidents.length > 0 || nlp_only_incidents.length > 0) && (
        <LocalizedLink
          to={'/summaries/spatial?incident=' + parentIncident.incident_id}
          className="hover:no-underline"
        >
          <h1 id="similar-incidents" className="text-xl dark:text-white w-full inline leading-9">
            <Trans>Similar Incidents</Trans>
          </h1>
        </LocalizedLink>
      )}
      {editor_similar_incidents.length > 0 && (
        <>
          <div className="flex gap-2 items-center mt-2">
            <h5 className="text-base tracking-tight text-gray-900 dark:text-white relative block mb-0">
              <Trans>Selected by our editors</Trans>
            </h5>
            {!loading && isRole('incident_editor') && (
              <a
                className="tw-edit-icon"
                href={`/incidents/edit?incident_id=${parentIncident.incident_id}#similar-incidents`}
                title="Change the displayed similar incidents"
                data-cy="edit-similar-incidents"
              >
                <FontAwesomeIcon icon={faEdit} className="text-gray-700 hover:text-primary-blue" />
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
                parentIncident={parentIncident}
              />
            ))}
          </div>
        </>
      )}

      {nlp_only_incidents.length > 0 && (
        <>
          <div className="flex gap-2 items-center mt-2">
            <h5 className="text-base tracking-tight text-gray-900 dark:text-white relative block mb-0">
              <Trans>By textual similarity</Trans>
            </h5>
            <span className="flex gap-2 items-center">
              {blogPostUrl && (
                <Link to={blogPostUrl} data-cy="about-similar-incidents">
                  <FontAwesomeIcon
                    icon={faQuestionCircle}
                    className="text-gray-700 hover:text-primary-blue"
                  />
                </Link>
              )}
              {!loading && isRole('incident_editor') && (
                <a
                  className="tw-edit-icon"
                  href={`/incidents/edit?incident_id=${parentIncident.incident_id}#similar-incidents`}
                  title="Change the displayed similar incidents"
                  data-cy="edit-similar-incidents"
                >
                  <FontAwesomeIcon
                    icon={faEdit}
                    className="text-gray-700 hover:text-primary-blue"
                  />
                </a>
              )}
            </span>
          </div>
          <p className="mt-2">
            <Trans>
              Did <strong>our</strong> AI mess up? Flag{' '}
              <FontAwesomeIcon icon={faFlag} className="mx-1 text-dark-gray" /> the unrelated
              incidents
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
