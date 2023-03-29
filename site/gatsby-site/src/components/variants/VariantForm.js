import React from 'react';
import { useFormikContext } from 'formik';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import FieldContainer from 'components/forms/SubmissionWizard/FieldContainer';
import TextInputGroup from 'components/forms/TextInputGroup';

// Schema for yup
export const schema = yup.object().shape({
  text_inputs: yup.string().required('*Input and circumstances field is required'),
  text_outputs: yup.string().required('*Output and outcomes field is required'),
});

const VariantForm = () => {
  const { values, errors, touched, handleChange, handleBlur, isSubmitting } = useFormikContext();

  const { t } = useTranslation(['variants']);

  return (
    <div className="flex w-full flex-col gap-2" data-cy="variant-form">
      <FieldContainer>
        <TextInputGroup
          label={t('Input and circumstances')}
          isInvalid={errors.text_inputs && touched.text_inputs}
          type="textarea"
          as="textarea"
          rows={8}
          placeholder={t('Input and circumstances')}
          name="text_inputs"
          values={values}
          errors={errors}
          touched={touched}
          handleChange={handleChange}
          handleBlur={handleBlur}
          disabled={isSubmitting}
          data-cy="variant-form-text-inputs"
        />
      </FieldContainer>
      <FieldContainer>
        <TextInputGroup
          label={t('Output and outcomes')}
          isInvalid={errors.text_outputs && touched.text_outputs}
          type="textarea"
          as="textarea"
          rows={8}
          placeholder={t('Output and outcomes')}
          name="text_outputs"
          values={values}
          errors={errors}
          touched={touched}
          handleChange={handleChange}
          handleBlur={handleBlur}
          disabled={isSubmitting}
          data-cy="variant-form-text-outputs"
        />
      </FieldContainer>
    </div>
  );
};

export default VariantForm;
