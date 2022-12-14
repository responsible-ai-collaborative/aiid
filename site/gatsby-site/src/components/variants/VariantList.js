import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { Trans, useTranslation } from 'react-i18next';
import { Spinner, Tooltip } from 'flowbite-react';
import Card from '../../elements/Card';
import useToastContext, { SEVERITY } from '../../hooks/useToast';
import { getVariantStatus, VARIANT_STATUS, getVariantStatusText } from 'utils/variants';
import VariantForm, { schema } from 'components/variants/VariantForm';
import { useUserContext } from 'contexts/userContext';
import VariantEditModal from './VariantEditModal';
import { Formik } from 'formik';
import { useMutation } from '@apollo/client';
import { CREATE_VARIANT } from '../../graphql/variants';
import { Button, Modal } from 'react-bootstrap';

export const VariantStatusBadge = ({ status }) => {
  let badgeClass;

  switch (status) {
    case VARIANT_STATUS.approved:
      badgeClass = 'bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-800';
      break;

    case VARIANT_STATUS.rejected:
      badgeClass = 'bg-red-100 text-red-800 dark:bg-red-200 dark:text-red-800';
      break;

    default:
      badgeClass = 'bg-blue-100 text-blue-800 dark:bg-blue-200 dark:text-blue-800';
      break;
  }

  return (
    <div
      data-cy="variant-status-badge"
      className={`${badgeClass} text-xs font-semibold px-2.5 py-0.5 rounded capitalize`}
    >
      <Trans>{getVariantStatusText(status)}</Trans>
    </div>
  );
};

const VariantCard = ({ variant, refetch }) => {
  const { t } = useTranslation();

  const { isRole } = useUserContext();

  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <>
      <Card data-cy="variant-card" className="relative p-4 overflow-hidden flex">
        <div className="flex">
          <VariantStatusBadge status={getVariantStatus(variant)} />
        </div>
        <div className="flex w-full flex-row items-center mt-2 gap-4">
          <div className="w-1/2">
            <div className="font-bold flex items-center gap-2">
              <Trans>Input and circumstances</Trans>
              <Tooltip
                content={t(
                  'Provide the relevant details producing the incident. Examples include the input prompts to a chatbot or a description of the circumstances leading to injuries sustained from a robot.'
                )}
                trigger="click"
              >
                <FontAwesomeIcon
                  icon={faQuestionCircle}
                  style={{ color: 'rgb(210, 210, 210)', cursor: 'pointer' }}
                  className="far fa-question-circle"
                />
              </Tooltip>
            </div>
            <div data-cy="variant-text_inputs" className="border-1 rounded-lg px-3 mt-2">
              <Markdown>{variant.text_inputs}</Markdown>
            </div>
          </div>
          <div className="w-1/2">
            <div className="font-bold flex items-center gap-2">
              <Trans>Output and outcomes</Trans>
              <Tooltip
                content={t(
                  'Provide the relevant details surrounding the incident. Examples include output text from a chatbot or the nature of injuries sustained from a robot.'
                )}
                trigger="click"
              >
                <FontAwesomeIcon
                  icon={faQuestionCircle}
                  style={{ color: 'rgb(210, 210, 210)', cursor: 'pointer' }}
                  className="far fa-question-circle"
                />
              </Tooltip>
            </div>
            <div data-cy="variant-text_outputs" className="border-1 rounded-lg px-3 mt-2">
              <Markdown>{variant.text_outputs}</Markdown>
            </div>
          </div>
        </div>

        {isRole('incident_editor') && (
          <div className="flex justify-end mt-4">
            <Button
              variant="primary"
              type="button"
              onClick={() => setShowEditModal(true)}
              data-cy="edit-variant-btn"
            >
              <FontAwesomeIcon icon={faEdit} title={t('Edit Variant')} />
            </Button>
          </div>
        )}
      </Card>

      <VariantEditModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        reportNumber={variant.report_number}
        refetch={refetch}
      />
    </>
  );
};

const VariantList = ({ incidentId, report_numbers, variants, loading, refetch }) => {
  const { t } = useTranslation();

  const [displayForm, setDisplayForm] = useState(false);

  const onAddVariantClick = () => {
    setDisplayForm(true);
  };

  const addToast = useToastContext();

  const [createVariantMutation] = useMutation(CREATE_VARIANT);

  const addVariant = async ({ incidentId, text_inputs, text_outputs }) => {
    const variant = {
      text_inputs,
      text_outputs,
    };

    const result = await createVariantMutation({ variables: { input: { incidentId, variant } } });

    const new_report_numbers = report_numbers.push(result.data.createVariant.report_number);

    await refetch({ variables: { report_numbers: new_report_numbers } });
  };

  return (
    <div className="my-6">
      {loading && <Spinner />}

      {!loading && (
        <>
          <h1>
            <Trans>Variants</Trans>
          </h1>
          <div className="mb-4">
            <Trans>
              A &quot;variant&quot; is an incident that shares the same causative factors, produces
              similar harms, and involves the same intelligent systems as a known AI incident.
              Rather than index variants as entirely separate incidents, we list variations of
              incidents under the first incident submitted to the database. Unlike other submission
              types to the incident database, variants are not required to have reporting in
              evidence external to the Incident Database.{' '}
              <a href="https://arxiv.org/abs/2211.10384">Learn more from the research paper.</a>
            </Trans>
            <div className={'flex flex-col gap-3 mt-5'}>
              {variants.map((variant) => (
                <VariantCard
                  variant={variant}
                  refetch={refetch}
                  key={`variant-${variant.report_number}`}
                />
              ))}
            </div>
          </div>

          <div className="bootstrap">
            <Button variant="outline-primary" onClick={onAddVariantClick} data-cy="add-variant-btn">
              <FontAwesomeIcon icon={faPlus} title={t('Add Variant')} className="mr-2" />
              <Trans>Add Variant</Trans>
            </Button>
          </div>

          {displayForm && (
            <Card className="p-4 mt-4 bootstrap">
              <Formik
                initialValues={{ text_inputs: '', text_outputs: '' }}
                validationSchema={schema}
                onSubmit={async ({ text_inputs, text_outputs }, { setSubmitting, resetForm }) => {
                  try {
                    await addVariant({ incidentId, text_inputs, text_outputs });

                    addToast({
                      message: t('Variant successfully added.'),
                      severity: SEVERITY.success,
                    });

                    resetForm();
                  } catch (e) {
                    addToast({
                      message: (
                        <label className="capitalize">
                          {t(e.error || 'An unknown error has ocurred')}
                        </label>
                      ),
                      severity: SEVERITY.danger,
                    });
                  }

                  setSubmitting(false);
                }}
              >
                {({ isSubmitting, isValid, submitForm }) => (
                  <>
                    <Modal.Body>
                      <VariantForm />
                    </Modal.Body>
                    <Modal.Footer>
                      <div className="flex justify-end gap-3">
                        <Button
                          variant="primary"
                          type="submit"
                          disabled={isSubmitting || !isValid}
                          onClick={submitForm}
                          data-cy="add-variant-submit-btn"
                        >
                          <div className="flex gap-2 items-center">
                            {isSubmitting && (
                              <div>
                                <Spinner size="sm" />
                              </div>
                            )}
                            <Trans ns="login">Submit</Trans>
                          </div>
                        </Button>
                      </div>
                    </Modal.Footer>
                  </>
                )}
              </Formik>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default VariantList;
