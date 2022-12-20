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
  const { values, errors, touched, handleChange, isSubmitting } = useFormikContext();

  const { t } = useTranslation();

  return (
    <div className="flex w-full flex-col gap-2" data-cy="variant-form">
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
      <Form.Group controlId="formTextInputs">
        <Form.Control
          isInvalid={errors.text_inputs && touched.text_inputs}
          type="textarea"
          as="textarea"
          rows={8}
          placeholder={t('Input and circumstances')}
          name="text_inputs"
          value={values.text_inputs}
          onChange={handleChange}
          disabled={isSubmitting}
        />
        <Form.Control.Feedback type="invalid">
          <Trans>{errors.text_inputs && touched.text_inputs ? errors.text_inputs : null}</Trans>
        </Form.Control.Feedback>
      </Form.Group>
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
      <Form.Group className="mb-3" controlId="formTextOutputs">
        <Form.Control
          isInvalid={errors.text_outputs && touched.text_outputs}
          type="textarea"
          as="textarea"
          rows={8}
          placeholder={t('Output and outcomes')}
          name="text_outputs"
          value={values.text_outputs}
          onChange={handleChange}
          disabled={isSubmitting}
        />
        <Form.Control.Feedback type="invalid">
          <Trans>{errors.text_outputs && touched.text_outputs ? errors.text_outputs : null}</Trans>
        </Form.Control.Feedback>
      </Form.Group>
    </div>
  );
};

export default VariantForm;
