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
import Link from 'components/ui/Link';

export default function VariantEditModal({
  show,
  onClose,
  reportNumber,
  incidentId,
  refetch = null,
}) {
  const { t } = useTranslation(['translation', 'variants']);

  const [variant, setVariant] = useState(null);

  const [isRejecting, setIsRejecting] = useState(false);

  const [isApproving, setIsApproving] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

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
      const updated = {
        text_inputs: values.text_inputs,
        text_outputs: values.text_outputs,
      };

      if (newVariantStatus) {
        let newTags = values.tags.filter((tag) => !tag.startsWith('variant:'));

        newTags.push(newVariantStatus);
        updated.tags = newTags;
      }

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
        message: t('Variant successfully updated. Your edits will be live within 24 hours.'),
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
        error: e,
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
          message: t('Variant successfully deleted. Your changes will be live within 24 hours.'),
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
          error: e,
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
            <Trans ns="variants">Edit Variant</Trans>
          </Modal.Title>
        </Modal.Header>

        {!variant && (
          <Modal.Body>
            {variant === undefined && (
              <div className="flex justify-center">
                <Spinner />
              </div>
            )}
            {variant === null && (
              <div>
                <Trans ns="variants">Variant not found</Trans>
              </div>
            )}
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
              } else if (newVariantStatus == null) {
                setIsSaving(true);
              }

              await handleSubmit(values);

              setIsApproving(false);
              setIsRejecting(false);
              setIsSaving(false);
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
                  <Link
                    to={`/cite/edit?report_number=${reportNumber}&incident_id=${incidentId}`}
                    data-cy="edit-all-variant-btn"
                    className="mr-3"
                  >
                    <Trans ns="variants">Edit more fields</Trans>
                  </Link>
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
                        <Trans ns="variants">Rejecting</Trans>
                      </>
                    ) : (
                      <Trans ns="variants">Reject</Trans>
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
                        <Trans ns="variants">Approving</Trans>
                      </>
                    ) : (
                      <Trans ns="variants">Approve</Trans>
                    )}
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setNewVariantStatus(null);
                      submitForm();
                    }}
                    disabled={isSubmitting || isDeleting || !isValid}
                    className="bootstrap flex gap-2 disabled:opacity-50"
                    data-cy="save-variant-btn"
                  >
                    {isSubmitting && isSaving ? (
                      <>
                        <Spinner size="sm" />
                        <Trans ns="variants">Saving</Trans>
                      </>
                    ) : (
                      <Trans ns="variants">Save</Trans>
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
