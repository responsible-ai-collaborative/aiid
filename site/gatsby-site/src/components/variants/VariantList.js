import React, { useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { Trans, useTranslation } from 'react-i18next';
import { Button, Spinner, Tooltip } from 'flowbite-react';
import useToastContext, { SEVERITY } from '../../hooks/useToast';
import {
  getVariantStatus,
  VARIANT_STATUS,
  getVariantStatusText,
  isCompleteReport,
} from 'utils/variants';
import { sortIncidentsByDatePublished } from 'utils/cite';
import VariantForm, { schema } from 'components/variants/VariantForm';
import { useUserContext } from 'contexts/UserContext';
import VariantEditModal from './VariantEditModal';
import { Formik } from 'formik';
import { useLazyQuery, useMutation } from '@apollo/client';
import { CREATE_VARIANT, FIND_INCIDENT_VARIANTS } from '../../graphql/variants';
import { format } from 'date-fns';

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
      <Trans ns="variants">{getVariantStatusText(status)}</Trans>
    </div>
  );
};

const VariantCard = ({ variant, incidentId }) => {
  const { t } = useTranslation(['translation', 'variants']);

  const { isRole, loading: loadingUserContext } = useUserContext();

  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <>
      <div
        id={`r${variant.report_number}`}
        data-cy="variant-card"
        className="relative p-4 overflow-hidden flex tw-card border-1 rounded-lg break-words flex-col shadow-lg"
      >
        <div className="flex">
          <VariantStatusBadge status={getVariantStatus(variant)} />
        </div>
        <div className="flex w-full flex-col mt-3 gap-3">
          <div className="flex items-center gap-2">
            <div className="font-bold">
              <Trans>Incident Date</Trans>:
            </div>
            {variant.date_published && (
              <div>{format(new Date(variant.date_published), 'yyyy-MM-dd')}</div>
            )}
          </div>
          {variant.text && (
            <>
              <div className="font-bold flex items-center gap-2">
                <Trans ns="variants">Description of Incident Circumstances</Trans>
                <Tooltip
                  content={
                    <Trans ns="variants">
                      Journalistic reporting on the circumstances of the incident to help inform
                      people what happened, where, involving who, when, and why.
                    </Trans>
                  }
                  trigger="click"
                  placement="right"
                >
                  <FontAwesomeIcon
                    icon={faQuestionCircle}
                    style={{ color: 'rgb(210, 210, 210)', cursor: 'pointer' }}
                    className="far fa-question-circle"
                  />
                </Tooltip>
              </div>
              <div data-cy="variant-text" className="border-1 rounded-lg px-3">
                <Markdown>{variant.text}</Markdown>
              </div>
            </>
          )}
          {variant.inputs_outputs &&
            variant.inputs_outputs.length > 0 &&
            variant.inputs_outputs.some((io) => io != '') && (
              <>
                <div className="font-bold flex items-center gap-2">
                  <Trans ns="variants">Inputs / Outputs</Trans>
                  <Tooltip
                    content={
                      <Trans ns="variants">
                        The sequence of data inputs into the intelligent system and outputs produced
                        by the system involved in the incident. For a chatbot, this will generally
                        present a back and forth between a human and the chatbot&apos;s responses.
                      </Trans>
                    }
                    trigger="click"
                    placement="right"
                  >
                    <FontAwesomeIcon
                      icon={faQuestionCircle}
                      style={{ color: 'rgb(210, 210, 210)', cursor: 'pointer' }}
                      className="far fa-question-circle"
                    />
                  </Tooltip>
                </div>
                {variant.inputs_outputs.map((input_output, index) => (
                  <div
                    className={`border-1 rounded-lg px-3 ${index % 2 == 1 ? 'bg-gray-200' : ''}`}
                    key={`inputs_outputs.${index}`}
                    data-cy="variant-inputs-outputs"
                  >
                    <Markdown>{input_output}</Markdown>
                  </div>
                ))}
              </>
            )}
        </div>

        {!loadingUserContext && isRole('incident_editor') && (
          <div className="flex justify-end mt-4">
            <Button type="button" onClick={() => setShowEditModal(true)} data-cy="edit-variant-btn">
              <FontAwesomeIcon icon={faEdit} title={t('Edit Variant')} />
            </Button>
          </div>
        )}
      </div>

      <VariantEditModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        reportNumber={variant.report_number}
        incidentId={incidentId}
      />
    </>
  );
};

const VariantList = ({ liveVersion, incidentId, variants, readOnly = false }) => {
  const { t } = useTranslation(['variants']);

  const [displayForm, setDisplayForm] = useState(false);

  //Sort variants
  variants = variants
    .sort(
      (a, b) => b.tags.includes(VARIANT_STATUS.approved) - a.tags.includes(VARIANT_STATUS.approved)
    )
    .sort(
      (a, b) => a.tags.includes(VARIANT_STATUS.rejected) - b.tags.includes(VARIANT_STATUS.rejected)
    );

  const [variantList, setVariantList] = useState(variants);

  const [displaySuccessMessage, setDisplaySuccessMessage] = useState(false);

  const [findIncidentVariants, { data: incidentData, refetch: refetchVariants }] = useLazyQuery(
    FIND_INCIDENT_VARIANTS,
    {
      variables: { incident_id: { EQ: incidentId } },
    }
  );

  useEffect(() => {
    if (liveVersion) {
      findIncidentVariants();
    }
  }, [liveVersion]);

  const onAddVariantClick = () => {
    setDisplayForm(!displayForm);
  };

  const addToast = useToastContext();

  const [createVariantMutation] = useMutation(CREATE_VARIANT);

  useEffect(() => {
    if (incidentData?.incident?.reports) {
      const incidentReports = incidentData.incident.reports;

      const sortedIncidentReports = sortIncidentsByDatePublished(incidentReports.slice());

      const variants = sortedIncidentReports
        .filter((report) => !isCompleteReport(report))
        .sort(
          (a, b) =>
            b.tags.includes(VARIANT_STATUS.approved) - a.tags.includes(VARIANT_STATUS.approved)
        )
        .sort(
          (a, b) =>
            a.tags.includes(VARIANT_STATUS.rejected) - b.tags.includes(VARIANT_STATUS.rejected)
        );

      setVariantList(variants);
    }
  }, [incidentData]);

  const addVariant = async ({ incidentId, date_published, submitters, text, inputs_outputs }) => {
    const variant = {
      date_published,
      submitters,
      text,
      inputs_outputs,
    };

    await createVariantMutation({ variables: { input: { incidentId, variant } } });

    setDisplayForm(false);
    if (liveVersion) {
      refetchVariants();
    } else {
      setDisplaySuccessMessage(true);
    }
  };

  return (
    <div className="my-6">
      <h1>
        <Trans ns="variants">Variants</Trans>
      </h1>
      <div className="mb-4">
        <Trans ns="variants">
          A &quot;variant&quot; is an incident that shares the same causative factors, produces
          similar harms, and involves the same intelligent systems as a known AI incident. Rather
          than index variants as entirely separate incidents, we list variations of incidents under
          the first similar incident submitted to the database. Unlike other submission types to the
          incident database, variants are not required to have reporting in evidence external to the
          Incident Database.{' '}
          <a href="https://arxiv.org/abs/2211.10384">Learn more from the research paper.</a>
        </Trans>
        <div className={'flex flex-col gap-3 mt-5'}>
          {variantList.map((variant) => (
            <VariantCard
              variant={variant}
              incidentId={incidentId}
              key={`variant-${variant.report_number}`}
            />
          ))}
        </div>
      </div>

      {!readOnly && (
        <div>
          <Button variant="outline-primary" onClick={onAddVariantClick} data-cy="add-variant-btn">
            <FontAwesomeIcon
              titleId="add-variant"
              icon={faPlus}
              title={t('Add Variant')}
              className="mr-2"
            />
            <Trans ns="variants">Add Variant</Trans>
          </Button>
        </div>
      )}

      {displaySuccessMessage && (
        <div data-cy="success-message" className="mt-3 font-medium text-green-600">
          <Trans ns="variants">
            Your variant has been added to the review queue and will appear on this page within 12
            hours. Please continue submitting when you encounter more variants. Most of the time we
            won&apos;t review it in the same day, but it will appear within a day as unreviewed.
          </Trans>
        </div>
      )}

      {displayForm && (
        <div className="p-4 mt-4 flex border-1 rounded-lg break-words flex-col shadow-md">
          <Formik
            initialValues={{ date_published: '', submitters: [], text: '', inputs_outputs: [''] }}
            validationSchema={schema}
            onSubmit={async (
              { date_published, submitters, text, inputs_outputs },
              { setSubmitting, resetForm }
            ) => {
              try {
                await addVariant({ incidentId, date_published, submitters, text, inputs_outputs });

                addToast({
                  message: t(
                    'Your variant has been added to the review queue and will appear on this page within 12 hours.'
                  ),
                  severity: SEVERITY.success,
                });

                resetForm();
              } catch (e) {
                addToast({
                  message: (
                    <label className="capitalize">
                      {t(e.error || 'An unknown error has occurred')}
                    </label>
                  ),
                  severity: SEVERITY.danger,
                  error: e,
                });
              }

              setSubmitting(false);
            }}
          >
            {({ isSubmitting, isValid, submitForm }) => (
              <div>
                <div>
                  <VariantForm />
                </div>
                <div className="flex justify-end gap-3 mt-3">
                  <Button
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
                      <Trans>Submit</Trans>
                    </div>
                  </Button>
                </div>
              </div>
            )}
          </Formik>
        </div>
      )}
    </div>
  );
};

export default VariantList;
