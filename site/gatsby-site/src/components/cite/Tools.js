import { faEdit, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useUserContext } from 'contexts/userContext';
import { format } from 'date-fns';
import Card from 'elements/Card';
import { Button, ToggleSwitch } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { RESPONSE_TAG } from 'utils/entities';
import CitationFormat from './CitationFormat';
import NotifyButton from './NotifyButton';

function Tools({
  incident,
  incidentReports,
  isSubscribed,
  subscribeToNewReports,
  subscribing,
  isLiveData,
  setIsLiveData,
}) {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  const { t } = useTranslation();

  const { isRole, user } = useUserContext();

  useEffect(() => {
    setIsUserLoggedIn(!!user?.profile.email);
  }, [user]);

  return (
    <Card>
      <Card.Header>
        <h4 className="m-0">
          <Trans>Tools</Trans>
        </h4>
      </Card.Header>
      <Card.Body className="flex-row flex-wrap gap-2">
        <NotifyButton
          subscribing={subscribing}
          onClick={subscribeToNewReports}
          subscribed={isSubscribed}
        />
        <Button
          color="gray"
          href={`/apps/submit?incident_ids=${incident.incident_id}&date_downloaded=${format(
            new Date(),
            'yyyy-MM-dd'
          )}`}
        >
          <FontAwesomeIcon
            icon={faPlus}
            title={t('New Report')}
            className="mr-2"
            titleId="new-report-icon"
          />
          <Trans>New Report</Trans>
        </Button>
        <Button
          color="gray"
          href={`/apps/submit?tags=${RESPONSE_TAG}&incident_id=${incident.incident_id}`}
        >
          <FontAwesomeIcon
            icon={faPlus}
            title={t('New Response')}
            className="mr-2"
            titleId="new-response-icon"
          />
          <Trans>New Response</Trans>
        </Button>
        <Button color="gray" href={'/apps/discover?incident_id=' + incident.incident_id}>
          <FontAwesomeIcon
            className="mr-2"
            icon={faSearch}
            title={t('Discover')}
            titleId="discover-icon"
          />
          <Trans>Discover</Trans>
        </Button>
        <CitationFormat incidentReports={incidentReports} incident={incident} />
        {isUserLoggedIn && isRole('incident_editor') && (
          <Button color="gray" href={'/incidents/edit?incident_id=' + incident.incident_id}>
            <FontAwesomeIcon
              className="mr-2"
              icon={faEdit}
              title={t('Edit Incident')}
              titleId="edit-incident-icon"
            />
            <Trans>Edit Incident</Trans>
          </Button>
        )}
        {isUserLoggedIn && isRole('taxonomy_editor') && (
          <Button color="gray" href={`/apps/csettool/${incident.incident_id}`}>
            <FontAwesomeIcon
              className="mr-2"
              icon={faEdit}
              title={t('CSET Annotators Table')}
              titleId="csettool"
            />
            <Trans>CSET Annotators Table</Trans>
          </Button>
        )}
        {isUserLoggedIn && (isRole('incident_editor') || isRole('taxonomy_editor')) && (
          <div className="flex items-center">
            <ToggleSwitch
              checked={isLiveData}
              label={t('Show Live data')}
              onChange={(checked) => {
                setIsLiveData(checked);
              }}
              name="live-data-switch"
              data-cy="toogle-live-data"
            />
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default Tools;
