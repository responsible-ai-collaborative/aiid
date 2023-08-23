import React, { useEffect, useState } from 'react';
import {
  faEdit,
  faPlus,
  faSearch,
  faClone,
  faTrash,
  faClockRotateLeft,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useUserContext } from 'contexts/userContext';
import { format } from 'date-fns';
import Card from 'elements/Card';
import { Button, Spinner, ToggleSwitch, Modal } from 'flowbite-react';
import { Trans, useTranslation } from 'react-i18next';
import { RESPONSE_TAG } from 'utils/entities';
import CitationFormat from './CitationFormat';
import NotifyButton from './NotifyButton';
import { LocalizedLink } from 'plugins/gatsby-theme-i18n';
import { useMutation, useQuery } from '@apollo/client/react/hooks';
import { FIND_INCIDENT, UPDATE_INCIDENT } from '../../graphql/incidents';
import { INSERT_DUPLICATE } from '../../graphql/duplicates';
import { UPDATE_CLASSIFICATIONS } from '../../graphql/classifications';
import IncidentsField from 'components/incidents/IncidentsField';
import { Form, Formik } from 'formik';

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

  const [showRemoveDuplicateModal, setShowRemoveDuplicateModal] = useState(false);

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
          className="hover:no-underline"
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
          href={`/apps/submit?tags=${RESPONSE_TAG}&incident_ids=${incident.incident_id}`}
          className="hover:no-underline"
        >
          <FontAwesomeIcon
            icon={faPlus}
            title={t('New Response')}
            className="mr-2"
            titleId="new-response-icon"
          />
          <Trans>New Response</Trans>
        </Button>
        <Button
          color="gray"
          href={'/apps/discover?incident_id=' + incident.incident_id}
          className="hover:no-underline"
        >
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
          <>
            <Button
              className="hover:no-underline"
              color="gray"
              href={'/incidents/edit?incident_id=' + incident.incident_id}
            >
              <FontAwesomeIcon
                className="mr-2"
                icon={faEdit}
                title={t('Edit Incident')}
                titleId="edit-incident-icon"
              />
              <Trans>Edit Incident</Trans>
            </Button>
            <Button
              color="gray"
              onClick={() => {
                setShowRemoveDuplicateModal(true);
              }}
            >
              <FontAwesomeIcon
                className="mr-2"
                icon={faTrash}
                title={t('Remove Duplicate')}
                titleId="remove-duplicate-icon"
              />
              <Trans>Remove Duplicate</Trans>
            </Button>
            {showRemoveDuplicateModal && (
              <Modal
                show={showRemoveDuplicateModal}
                onClose={() => setShowRemoveDuplicateModal(false)}
              >
                <Modal.Header>
                  <Trans>Remove Duplicate</Trans>
                </Modal.Header>
                <Modal.Body> 
                  <Formik initialValues={{ duplicateIncidentId: [] }}>
                    {(props) => (
                      <RemoveDuplicateModalContents {...{ ...props, incident }} />
                    )}
                  </Formik>
                </Modal.Body>
              </Modal>
            )}
          </>
        )}
        {isUserLoggedIn && isRole('taxonomy_editor') && (
          <Button
            color="gray"
            href={`/apps/csettool/${incident.incident_id}`}
            className="hover:no-underline"
          >
            <FontAwesomeIcon
              className="mr-2"
              icon={faEdit}
              title={t('CSET Annotators Table')}
              titleId="csettool"
            />
            <Trans>CSET Annotators Table</Trans>
          </Button>
        )}
        {isUserLoggedIn && isRole('incident_editor') && (
          <Button
            color="gray"
            href={`/incidents/new?incident_id=${incident.incident_id}`}
            className="hover:no-underline"
            data-cy="clone-incident-btn"
          >
            <FontAwesomeIcon
              className="mr-2"
              icon={faClone}
              title={t('Clone Incident')}
              titleId="clone-incident-icon"
            />
            <Trans>Clone Incident</Trans>
          </Button>
        )}
        <Button
          color="gray"
          href={`/incidents/history?incident_id=${incident.incident_id}`}
          className="hover:no-underline"
          data-cy="view-history-btn"
        >
          <FontAwesomeIcon
            className="mr-2"
            icon={faClockRotateLeft}
            title={t('View History')}
            titleId="view-history-icon"
          />
          <Trans>View History</Trans>
        </Button>
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

function RemoveDuplicateModalContents({ incident, isValid, isSubmitting, submitForm, values }) {

  const [deletingDuplicate, setDeletingDuplicate] = useState(false);

  const [updateIncident] = useMutation(UPDATE_INCIDENT);

  const [insertDuplicate] = useMutation(INSERT_DUPLICATE);

  const [updateClassifications] = useMutation(UPDATE_CLASSIFICATIONS);

  const { data: duplicateIncidentData, loading: duplicateIncidentLoading } = useQuery(
    FIND_INCIDENT,
    { variables: { query: { incident_id: values.duplicateIncidentId?.[0] } } }
  );

  const duplicateIncident = duplicateIncidentData?.incident;

  return (
    <>
          <Form>
            <Trans>Transfer reports to incident</Trans>{' '}
            <IncidentsField multiple={false} id="duplicateIncidentId" name="duplicateIncidentId" />
            <Button
              color="failure"
              disabled={duplicateIncidentLoading || !values.duplicateIncidentId || !duplicateIncidentData || deletingDuplicate}
              onClick={async () => {
                console.log(`duplicateIncidentData`, duplicateIncidentData);
                setDeletingDuplicate(true);
                const reportIds = removeTypename(
                  duplicateIncidentData.incident.reports.concat(incident.reports)
                ).map((report) => report.report_number);

                let insertDuplicateResponse;

                try {
                  insertDuplicateResponse = await insertDuplicate({
                    variables: {
                      duplicate: {
                        duplicate_incident_number: incident.incident_id,
                        true_incident_number: values.duplicateIncidentId[0],
                      },
                    },
                  });
                } catch (e) {
                  console.error(insertDuplicateResponse);
                  alert(`Could not insert duplicate. Aborting.`);
                  return;
                }

                let updateIncidentResponse;

                try {
                  updateIncidentResponse = await updateIncident({
                    variables: {
                      query: { incident_id: values.duplicateIncidentId[0] },
                      set: { reports: { link: reportIds } },
                    },
                  });
                } catch (e) {
                  console.error(updateIncidentResponse);
                  alert(`Could not transfer reports to incident ${values.duplicateIncidentId[0]}.`);
                }

                let updateClassificationsResponse;

                try {
                  updateClassificationsResponse = await updateClassifications({
                    variables: {
                      query: { incident_id: incident.incident_id },
                      set: { incident_id: values.duplicateIncidentId[0] },
                    },
                  });
                } catch (e) {
                  console.error(updateClassificationsResponse);
                  alert(`Could not transfer classifications to incident ${values.duplicateIncidentId[0]}.`);
                }

                setDeletingDuplicate(false);
                alert(
                  [
                    `Incident ${incident.incident_id} marked`,
                    `as duplicate of ${values.duplicateIncidentId[0]}.`,
                    `Its page will updated within 24 hours.`,
                  ].join(' ')
                );
                window.location.pathname = '/';
              }}
            >
              Remove Duplicate
            </Button>
          </Form>
        )}
    </>
  );
}

const removeTypename = (obj) => {
  const replaced = JSON.stringify(obj).replace(/"__typename":"[A-Za-z]*",/g, '');

  return JSON.parse(replaced);
};

export default Tools;
