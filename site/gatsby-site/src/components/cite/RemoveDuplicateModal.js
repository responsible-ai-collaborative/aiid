import React from 'react';
import { useMutation, useQuery } from '@apollo/client/react/hooks';
import { FIND_INCIDENT, UPDATE_INCIDENT } from '../../graphql/incidents';
import { INSERT_DUPLICATE } from '../../graphql/duplicates';
import { UPSERT_CLASSIFICATION, FIND_CLASSIFICATION } from '../../graphql/classifications';
import IncidentsField from 'components/incidents/IncidentsField';
import { Formik, Form } from 'formik';
import { Button, Modal } from 'flowbite-react';
import { Trans } from 'react-i18next';

export default function RemoveDuplicateModal({ incident, show, onClose }) {
  const [updateIncident] = useMutation(UPDATE_INCIDENT);

  const [insertDuplicate] = useMutation(INSERT_DUPLICATE);

  const [updateClassification] = useMutation(UPSERT_CLASSIFICATION);

  const { data: classificationsData, loading: classificationsLoading } = useQuery(
    FIND_CLASSIFICATION,
    { variables: { query: { incidents: { incident_id: incident.incident_id } } } }
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
              isSubmitting;

            const submit = async () => {
              setSubmitting(true);
              const reportIds = removeTypename(
                duplicateIncidentData.incident.reports.concat(incident.reports)
              ).map((report) => report.report_number);

              try {
                await insertDuplicate({
                  variables: {
                    duplicate: {
                      duplicate_incident_number: incident.incident_id,
                      true_incident_number: values.duplicateIncidentId[0],
                    },
                  },
                });
              } catch (e) {
                console.error(e);
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

              try {
                for (const classification of classificationsData.classifications) {
                  await updateClassification({
                    variables: {
                      query: { _id: classification._id },
                      data: {
                        ...removeTypename(classification),
                        incidents: {
                          link: classification.incidents
                            .map((incident) => incident.incident_id)
                            .filter((incident_id) => incident_id != incident.incident_id)
                            .concat(values.duplicateIncidentId[0]),
                        },
                        reports: {
                          link: classification.reports.map((report) => report.report_number),
                        },
                      },
                    },
                  });
                }
              } catch (e) {
                console.error(e);
                alert(
                  `Could not transfer classifications to incident ${values.duplicateIncidentId[0]}.`,
                  e
                );
              }

              alert(
                [
                  `Incident ${incident.incident_id} marked`,
                  `as duplicate of ${values.duplicateIncidentId[0]}.`,
                  `Its page will updated within 24 hours.`,
                ].join(' ')
              );
              setSubmitting(false);
              window.location.pathname = '/';
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
                <Button color="failure" disabled={submitBlocked} onClick={submit}>
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

const removeTypename = (obj) => {
  const replaced = JSON.stringify(obj).replace(/"__typename":"[A-Za-z]*",/g, '');

  return JSON.parse(replaced);
};
