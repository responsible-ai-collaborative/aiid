import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { Spinner, Tooltip } from 'flowbite-react';
import { Formik } from 'formik';
import { useMutation } from '@apollo/client';
import * as yup from 'yup';
import useToastContext, { SEVERITY } from '../../hooks/useToast';
import { Trans, useTranslation } from 'react-i18next';
import Card from 'elements/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { CREATE_VARIANT } from '../../graphql/variants';

// Schema for yup
export const schema = yup.object().shape({
  textInputs: yup.string().required('*Input and circumstances field is required'),
  textOutputs: yup.string().required('*Output and outcomes field is required'),
});

const VariantForm = ({ incidentId, report_numbers, refetch }) => {
  const { t } = useTranslation();

  const addToast = useToastContext();

  const [createVariantMutation] = useMutation(CREATE_VARIANT);

  const addVariant = async ({ incidentId, textInputs, textOutputs }) => {
    const variant = {
      text_inputs: textInputs,
      text_outputs: textOutputs,
    };

    const result = await createVariantMutation({ variables: { input: { incidentId, variant } } });

    const new_report_numbers = report_numbers.push(result.data.createVariant.report_number);

    await refetch({ variables: { report_numbers: new_report_numbers } });
  };

  return (
    <Card className="p-4 mt-4 bootstrap">
      <Formik
        initialValues={{ textInputs: '', textOutputs: '' }}
        validationSchema={schema}
        onSubmit={async ({ textInputs, textOutputs }, { setSubmitting, resetForm }) => {
          try {
            await addVariant({ incidentId, textInputs, textOutputs });

            addToast({
              message: t('Variant added successfully.'),
              severity: SEVERITY.success,
            });
            resetForm();
          } catch (e) {
            addToast({
              message: (
                <label className="capitalize">{t(e.error || 'An unknown error has ocurred')}</label>
              ),
              severity: SEVERITY.danger,
            });
          }

          setSubmitting(false);
        }}
      >
        {({ values, errors, touched, handleChange, handleSubmit, isSubmitting, isValid }) => (
          <Form onSubmit={handleSubmit}>
            <div className="flex w-full flex-row items-center gap-4">
              <div className="w-1/2">
                <div className="font-bold flex items-center gap-2">
                  <Trans>Input and circumstances</Trans>
                  <Tooltip
                    content={t(
                      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
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
                <div className="pt-3">
                  <Form.Group className="mb-3" controlId="formTextInputs">
                    <Form.Control
                      isInvalid={errors.textInputs && touched.textInputs}
                      type="textarea"
                      as="textarea"
                      rows={4}
                      placeholder={t('Input and circumstances')}
                      name="textInputs"
                      value={values.textInputs}
                      onChange={handleChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      <Trans>
                        {errors.textInputs && touched.textInputs ? errors.textInputs : null}
                      </Trans>
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
              </div>
              <div className="w-1/2">
                <div className="font-bold flex items-center gap-2">
                  <Trans>Output and outcomes</Trans>
                  <Tooltip
                    content={t(
                      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
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
                <div className="pt-3">
                  <Form.Group className="mb-3" controlId="formTextOutputs">
                    <Form.Control
                      isInvalid={errors.textOutputs && touched.textOutputs}
                      type="textarea"
                      as="textarea"
                      rows={4}
                      placeholder={t('Output and outcomes')}
                      name="textOutputs"
                      value={values.textOutputs}
                      onChange={handleChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      <Trans>
                        {errors.textOutputs && touched.textOutputs ? errors.textOutputs : null}
                      </Trans>
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="primary"
                type="submit"
                disabled={isSubmitting || !isValid}
                data-cy="add-variant-btn"
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
          </Form>
        )}
      </Formik>
    </Card>
  );
};

export default VariantForm;
