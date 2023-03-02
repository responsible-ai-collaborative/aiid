import React, { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { Modal, Spinner } from 'flowbite-react';
import SubmissionForm from '../../components/submissions/SubmissionForm';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { FIND_SUBMISSION, UPDATE_SUBMISSION } from '../../graphql/submissions';
import { FIND_ENTITIES, UPSERT_ENTITY } from '../../graphql/entities';
import { Formik } from 'formik';
import useToastContext, { SEVERITY } from '../../hooks/useToast';
import isArray from 'lodash/isArray';
import { stripMarkdown } from '../../utils/typography';
import RelatedIncidents from '../../components/RelatedIncidents';
import { Trans } from 'react-i18next';
import { processEntities } from '../../utils/entities';
import { schema } from './schemas';

export default function SubmissionEditModal({ show, onHide, submissionId }) {
  const { data: entitiesData } = useQuery(FIND_ENTITIES);

  const [findSubmission, { data, loading }] = useLazyQuery(FIND_SUBMISSION);

  const [updateSubmission] = useMutation(UPDATE_SUBMISSION);

  const [createEntityMutation] = useMutation(UPSERT_ENTITY);

  const addToast = useToastContext();

  useEffect(() => {
    if (show) {
      findSubmission({ variables: { query: { _id: submissionId } } });
    }
  }, [show, submissionId]);

  const handleSubmit = async (values) => {
    try {
      const update = { ...values, __typename: undefined, _id: undefined };

      const { entities } = entitiesData;

      update.deployers = await processEntities(entities, values.deployers, createEntityMutation);

      update.developers = await processEntities(entities, values.developers, createEntityMutation);

      update.harmed_parties = await processEntities(
        entities,
        values.harmed_parties,
        createEntityMutation
      );

      await updateSubmission({
        variables: {
          query: {
            _id: values._id,
          },
          set: {
            ...update,
            incident_id: update.incident_id === '' ? 0 : update.incident_id,
            authors: !isArray(values.authors)
              ? values.authors.split(',').map((s) => s.trim())
              : values.authors,
            submitters: values.submitters
              ? !isArray(values.submitters)
                ? values.submitters.split(',').map((s) => s.trim())
                : values.submitters
              : ['Anonymous'],
            plain_text: await stripMarkdown(update.text),
          },
        },
      });

      onHide();

      addToast({
        message: `Submission updated successfully.`,
        severity: SEVERITY.success,
      });
    } catch (e) {
      addToast({
        message: `Error updating submission ${values._id}`,
        severity: SEVERITY.danger,
        error: e,
      });
    }
  };

  return (
    <Modal
      size="3xl"
      show={show}
      data-cy="submission-modal"
      onClose={onHide}
      className="submission-modal"
    >
      <Modal.Header>
        <h5>Edit Submission</h5>
      </Modal.Header>
      {loading && (
        <Modal.Body>
          <div className="flex justify-center">
            <Spinner />
          </div>
        </Modal.Body>
      )}
      {!loading && data?.submission && entitiesData?.entities && (
        <Formik
          validationSchema={schema}
          onSubmit={handleSubmit}
          initialValues={{
            ...data.submission,
            developers:
              data.submission.developers === null
                ? []
                : data.submission.developers.map((item) => item.name),
            deployers:
              data.submission.deployers === null
                ? []
                : data.submission.deployers.map((item) => item.name),
            harmed_parties:
              data.submission.harmed_parties === null
                ? []
                : data.submission.harmed_parties.map((item) => item.name),
            incident_id: data.submission.incident_id == 0 ? '' : data.submission.incident_id,
          }}
        >
          {({ isValid, isSubmitting, submitForm, values, setFieldValue }) => (
            <>
              <Modal.Body>
                <SubmissionForm />
                <RelatedIncidents incident={values} setFieldValue={setFieldValue} />
              </Modal.Body>
              <Modal.Footer>
                <div className="flex items-center gap-3 text-red-500">
                  {!isValid && (
                    <Trans ns="validation">Please review submission. Some data is missing.</Trans>
                  )}
                  <Button
                    onClick={submitForm}
                    className="flex disabled:opacity-50"
                    variant="primary"
                    type="submit"
                    disabled={isSubmitting || !isValid}
                    data-cy="update-btn"
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner size="sm" />
                        <div className="ml-2">
                          <Trans>Updating...</Trans>
                        </div>
                      </>
                    ) : (
                      <Trans>Update</Trans>
                    )}
                  </Button>
                </div>
              </Modal.Footer>
            </>
          )}
        </Formik>
      )}
    </Modal>
  );
}
