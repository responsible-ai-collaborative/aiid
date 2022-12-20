import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import useToastContext, { SEVERITY } from '../../hooks/useToast';
import { Button, Modal } from 'react-bootstrap';
import { Spinner } from 'flowbite-react';
import { Formik } from 'formik';
import { useTranslation, Trans } from 'react-i18next';
import VariantForm, { schema } from './VariantForm';
import { DELETE_VARIANT, FIND_VARIANT, UPDATE_VARIANT } from '../../graphql/variants';
import { LINK_REPORTS_TO_INCIDENTS } from '../../graphql/reports';
import { getVariantStatus, VARIANT_STATUS } from 'utils/variants';
import { VariantStatusBadge } from './VariantList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { format, getUnixTime } from 'date-fns';

export default function VariantEditModal({ show, onClose, reportNumber, refetch = null }) {
  const { t } = useTranslation();

  const [variant, setVariant] = useState(null);

  const [isRejecting, setIsRejecting] = useState(false);

  const [isApproving, setIsApproving] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);

  const [newVariantStatus, setNewVariantStatus] = useState(null);

  const { data: variantData } = useQuery(FIND_VARIANT, {
    variables: { query: { report_number: reportNumber } },
  });

  const [updateVariant] = useMutation(UPDATE_VARIANT);

  const [deleteVariant] = useMutation(DELETE_VARIANT);

  const [linkReportsToIncidents] = useMutation(LINK_REPORTS_TO_INCIDENTS);

  const addToast = useToastContext();

  useEffect(() => {
    if (variantData?.report) {
      setVariant({ ...variantData.report });
    } else {
      setVariant(undefined);
    }
  }, [variantData]);

  const handleSubmit = async (values) => {
    try {
      let newTags = values.tags.filter((tag) => !tag.startsWith('variant:'));

      newTags.push(newVariantStatus);

      const updated = {
        text_inputs: values.text_inputs,
        text_outputs: values.text_outputs,
        tags: newTags,
      };

      updated.date_modified = format(new Date(), 'yyyy-MM-dd');
      updated.epoch_date_modified = getUnixTime(new Date(updated.date_modified));

      await updateVariant({
        variables: {
          query: {
            report_number: reportNumber,
          },
          set: {
            ...updated,
          },
        },
      });

      addToast({
        message: t('Variant successfully updated.'),
        severity: SEVERITY.success,
      });

      refetch && (await refetch());

      onClose();
    } catch (e) {
      addToast({
        message: (
          <label className="capitalize">{t(e.error || 'An unknown error has ocurred')}</label>
        ),
        severity: SEVERITY.danger,
      });
    }
  };

  const handleDelete = async () => {
    if (confirm(t('Do you want to delete this variant?'))) {
      try {
        setIsDeleting(true);

        await deleteVariant({
          variables: {
            query: {
              report_number: reportNumber,
            },
          },
        });

        await linkReportsToIncidents({
          variables: {
            input: {
              incident_ids: [],
              report_numbers: [reportNumber],
            },
          },
        });

        addToast({
          message: t('Variant successfully deleted.'),
          severity: SEVERITY.success,
        });

        refetch && (await refetch());

        onClose();
      } catch (e) {
        addToast({
          message: (
            <label className="capitalize">{t(e.error || 'An unknown error has ocurred')}</label>
          ),
          severity: SEVERITY.danger,
        });
      }

      setIsDeleting(false);
    }
  };

  return (
    <div className="bootstrap">
      <Modal show={show} onHide={onClose} data-cy="edit-variant-modal" size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <Trans>Edit Variant</Trans>
          </Modal.Title>
        </Modal.Header>

        {!variant && (
          <Modal.Body>
            {variant === undefined && (
              <div className="flex justify-center">
                <Spinner />
              </div>
            )}
            {variant === null && <div>Variant not found</div>}
          </Modal.Body>
        )}

        {variant && (
          <Formik
            initialValues={{ ...variant }}
            validationSchema={schema}
            onSubmit={async (values) => {
              if (newVariantStatus === VARIANT_STATUS.approved) {
                setIsApproving(true);
              } else if (newVariantStatus === VARIANT_STATUS.rejected) {
                setIsRejecting(true);
              }

              await handleSubmit(values);

              setIsApproving(false);
              setIsRejecting(false);
            }}
          >
            {({ isSubmitting, isValid, submitForm }) => (
              <>
                <Modal.Body>
                  <div className="flex mb-2">
                    <VariantStatusBadge status={getVariantStatus(variant)} />
                  </div>
                  <VariantForm />
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="danger"
                    disabled={isSubmitting}
                    onClick={() => handleDelete()}
                    data-cy="delete-variant-btn"
                  >
                    {isDeleting ? <Spinner size="sm" /> : <FontAwesomeIcon icon={faTrash} />}
                  </Button>

                  <Button
                    variant="danger"
                    onClick={() => {
                      setNewVariantStatus(VARIANT_STATUS.rejected);
                      submitForm();
                    }}
                    disabled={isSubmitting || isDeleting || !isValid}
                    className="bootstrap flex gap-2 disabled:opacity-50"
                    data-cy="reject-variant-btn"
                  >
                    {isSubmitting && isRejecting ? (
                      <>
                        <Spinner size="sm" />
                        <Trans>Rejecting</Trans>
                      </>
                    ) : (
                      <Trans>Reject</Trans>
                    )}
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setNewVariantStatus(VARIANT_STATUS.approved);
                      submitForm();
                    }}
                    disabled={isSubmitting || isDeleting || !isValid}
                    className="bootstrap flex gap-2 disabled:opacity-50"
                    data-cy="approve-variant-btn"
                  >
                    {isSubmitting && isApproving ? (
                      <>
                        <Spinner size="sm" />
                        <Trans>Approving</Trans>
                      </>
                    ) : (
                      <Trans>Approve</Trans>
                    )}
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
