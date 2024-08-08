import React from 'react';
import { useMutation, useQuery } from '@apollo/client/react/hooks';
import { FIND_INCIDENT, UPDATE_INCIDENT } from '../../graphql/incidents';
import { INSERT_DUPLICATE } from '../../graphql/duplicates';
import { UPSERT_CLASSIFICATION, FIND_CLASSIFICATION } from '../../graphql/classifications';
import { UPSERT_SUBSCRIPTION, FIND_FULL_SUBSCRIPTIONS } from '../../graphql/subscriptions';
import IncidentsField from 'components/incidents/IncidentsField';
import { Formik, Form } from 'formik';
import { Button, Modal } from 'flowbite-react';
import { Trans } from 'react-i18next';
import useToast, { SEVERITY } from '../../hooks/useToast';

export default function RemoveDuplicateModal({ incident, show, onClose }) {
  const addToast = useToast();

  const [updateIncident] = useMutation(UPDATE_INCIDENT);

  const [insertDuplicate] = useMutation(INSERT_DUPLICATE);

  const [upsertClassification] = useMutation(UPSERT_CLASSIFICATION);

  const [updateSubscription] = useMutation(UPSERT_SUBSCRIPTION);

  const { data: classificationsData, loading: classificationsLoading } = useQuery(
    FIND_CLASSIFICATION,
    { variables: { filter: { incidents: { incident_id: { EQ: incident.incident_id } } } } }
  );

  const { data: subscriptionsData, loading: subscriptionsLoading } = useQuery(
    FIND_FULL_SUBSCRIPTIONS,
    { variables: { query: { incident_id: { incident_id: incident.incident_id } } } }
  );

  return (
    <Modal {...{ show, onClose }}>
      <Modal.Header>
        <Trans>Remove Duplicate</Trans>
      </Modal.Header>
      <Modal.Body>
        <Formik initialValues={{ duplicateIncidentId: [] }}>
          {({ values, isSubmitting, setSubmitting }) => {
            const { data: duplicateIncidentData, loading: duplicateIncidentLoading } = useQuery(
              FIND_INCIDENT,
              { variables: { query: { incident_id: values.duplicateIncidentId?.[0] } } }
            );

            const submitBlocked =
              duplicateIncidentLoading ||
              !duplicateIncidentData ||
              !values.duplicateIncidentId ||
              values.duplicateIncidentId.length == 0 ||
              classificationsLoading ||
              !classificationsData ||
              !subscriptionsData ||
              subscriptionsLoading ||
              isSubmitting;

            const submit = async () => {
              setSubmitting(true);
              const reportIds = duplicateIncidentData.incident.reports
                .concat(incident.reports)
                .map((report) => report.report_number);

              const duplicate_incident_number = incident.incident_id;

              const true_incident_number = values.duplicateIncidentId[0];

              let error = false;

              try {
                await insertDuplicate({
                  variables: {
                    duplicate: {
                      duplicate_incident_number,
                      true_incident_number,
                    },
                  },
                });
              } catch (e) {
                addToast({
                  message: `Could not insert duplicate. Aborting.`,
                  severity: SEVERITY.danger,
                  error: e,
                });
                error = true;
              }

              try {
                await updateIncident({
                  variables: {
                    query: { incident_id: true_incident_number },
                    set: { reports: { link: reportIds } },
                  },
                });
              } catch (e) {
                addToast({
                  message: `Could not transfer reports to incident ${true_incident_number}.`,
                  severity: SEVERITY.danger,
                  error: e,
                });
                error = true;
              }

              try {
                for (const classification of classificationsData.classifications) {
                  await upsertClassification({
                    variables: {
                      filter: { _id: { EQ: classification._id } },
                      update: {
                        ...classification,
                        incidents: {
                          link: classification.incidents
                            .map((incident) => incident.incident_id)
                            .filter((incident_id) => incident_id != duplicate_incident_number)
                            .concat(true_incident_number),
                        },
                        reports: {
                          link: classification.reports.map((report) => report.report_number),
                        },
                      },
                    },
                  });
                }
              } catch (e) {
                addToast({
                  message: `Could not transfer classifications to incident ${true_incident_number}.`,
                  severity: SEVERITY.danger,
                  error: e,
                });
                error = true;
              }
              try {
                for (const subscription of subscriptionsData.subscriptions) {
                  await updateSubscription({
                    variables: {
                      query: { _id: subscription._id },
                      subscription: {
                        userId: { link: subscription.userId.userId },
                        incident_id: { link: true_incident_number },
                        type: subscription.type,
                      },
                    },
                  });
                }
              } catch (e) {
                addToast({
                  message: `Could not transfer subscription to incident ${true_incident_number}.`,
                  severity: SEVERITY.danger,
                  error: e,
                });
                error = true;
              }

              setSubmitting(false);
              onClose();

              if (!error) {
                addToast({
                  severity: SEVERITY.success,
                  message: `Incident ${incident.incident_id} marked as duplicate of ${values.duplicateIncidentId[0]}. Its page will updated within 24 hours.`,
                });
                setTimeout(() => (window.location.pathname = '/'), 5000);
              }
            };

            return (
              <Form>
                <label htmlFor="duplicateIncidentId">
                  <Trans>Transfer reports to incident</Trans>{' '}
                </label>
                <IncidentsField
                  multiple={false}
                  id="duplicateIncidentId"
                  name="duplicateIncidentId"
                  className="mb-4 mt-1"
                />
                <Button
                  color="failure"
                  disabled={submitBlocked}
                  onClick={submit}
                  data-cy="confirm-remove-duplicate"
                >
                  <Trans>Remove Duplicate</Trans>
                </Button>
              </Form>
            );
          }}
        </Formik>
      </Modal.Body>
    </Modal>
  );
}
