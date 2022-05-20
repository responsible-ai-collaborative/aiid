import React, { useEffect } from 'react';
import { Button, Modal, Spinner } from 'react-bootstrap';
import SubmissionForm, { schema } from 'components/submissions/SubmissionForm';
import { useLazyQuery, useMutation } from '@apollo/client';
import { FIND_SUBMISSION, UPDATE_SUBMISSION } from '../../graphql/submissions';
import { Formik } from 'formik';
import useToastContext, { SEVERITY } from 'hooks/useToast';
import isArray from 'lodash/isArray';

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
            submitters: !isArray(values.submitters)
              ? values.submitters.split(',').map((s) => s.trim())
              : values.submitters,
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
    <Modal size="lg" show={show}>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>Edit Submission</Modal.Title>
      </Modal.Header>
      {loading && (
        <Modal.Body>
          <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
        </Modal.Body>
      )}
      {data?.submission && (
        <Formik
          validationSchema={schema}
          onSubmit={handleSubmit}
          initialValues={{
            ...data.submission,
            incident_id: data.submission.incident_id == 0 ? '' : data.submission.incident_id,
          }}
          enableReinitialize={true}
        >
          {({ isValid, isSubmitting, submitForm }) => (
            <>
              <Modal.Body>
                <SubmissionForm />
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
  );
}
