import React, { useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Spinner } from 'flowbite-react';
import SubmissionForm, { schema } from '../../components/submissions/SubmissionForm';
import { useLazyQuery, useMutation } from '@apollo/client';
import { FIND_SUBMISSION, UPDATE_SUBMISSION } from '../../graphql/submissions';
import { Formik } from 'formik';
import useToastContext, { SEVERITY } from '../../hooks/useToast';
import isArray from 'lodash/isArray';
import { stripMarkdown } from '../../utils/typography';
import RelatedIncidents from '../../components/RelatedIncidents';

export default function SubmissionEditModal({ show, onHide, submissionId }) {
  const [findSubmission, { data, loading }] = useLazyQuery(FIND_SUBMISSION);

  const [updateSubmission] = useMutation(UPDATE_SUBMISSION);

  const addToast = useToastContext();

  useEffect(() => {
    if (show) {
      findSubmission({ variables: { query: { _id: submissionId } } });
    }
  }, [show, submissionId]);

  const handleSubmit = async (values) => {
    try {
      const update = { ...values, __typename: undefined, _id: undefined };

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
            deployers: !isArray(values.deployers)
              ? values.deployers.split(',').map((s) => s.trim())
              : values.deployers,
            developers: !isArray(values.developers)
              ? values.developers.split(',').map((s) => s.trim())
              : values.developers,
            harmed_parties: !isArray(values.harmed_parties)
              ? values.harmed_parties.split(',').map((s) => s.trim())
              : values.harmed_parties,
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
      });
    }
  };

  return (
    <div className="bootstrap">
      <Modal size="lg" show={show} data-cy="submission-modal">
        <Modal.Header closeButton onHide={onHide}>
          <Modal.Title>Edit Submission</Modal.Title>
        </Modal.Header>
        {loading && (
          <Modal.Body>
            <div className="flex justify-center">
              <Spinner />
            </div>
          </Modal.Body>
        )}
        {!loading && data?.submission && (
          <Formik
            validationSchema={schema}
            onSubmit={handleSubmit}
            initialValues={{
              ...data.submission,
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
                  <Button
                    onClick={submitForm}
                    className="mt-3"
                    variant="primary"
                    type="submit"
                    disabled={isSubmitting || !isValid}
                  >
                    Update
                  </Button>
                </Modal.Footer>
              </>
            )}
          </Formik>
        )}
      </Modal>
    </div>
  );
}
