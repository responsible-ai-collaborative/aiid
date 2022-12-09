import React from 'react';
import { Form } from 'react-bootstrap';
import { Tooltip } from 'flowbite-react';
import { useFormikContext } from 'formik';
import * as yup from 'yup';
import { Trans, useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

// Schema for yup
export const schema = yup.object().shape({
  text_inputs: yup.string().required('*Input and circumstances field is required'),
  text_outputs: yup.string().required('*Output and outcomes field is required'),
});

const VariantForm = () => {
  const { values, errors, touched, handleChange } = useFormikContext();

  const { t } = useTranslation();

  return (
    <>
      <div className="flex w-full flex-row gap-4">
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
                isInvalid={errors.text_inputs && touched.text_inputs}
                type="textarea"
                as="textarea"
                rows={4}
                placeholder={t('Input and circumstances')}
                name="text_inputs"
                value={values.text_inputs}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                <Trans>
                  {errors.text_inputs && touched.text_inputs ? errors.text_inputs : null}
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
                isInvalid={errors.text_outputs && touched.text_outputs}
                type="textarea"
                as="textarea"
                rows={4}
                placeholder={t('Output and outcomes')}
                name="text_outputs"
                value={values.text_outputs}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                <Trans>
                  {errors.text_outputs && touched.text_outputs ? errors.text_outputs : null}
                </Trans>
              </Form.Control.Feedback>
            </Form.Group>
          </div>
        </div>
      </div>
    </>
  );
};

export default VariantForm;
