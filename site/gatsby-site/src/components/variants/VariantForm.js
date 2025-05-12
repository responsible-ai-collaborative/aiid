import React, { useEffect } from 'react';
import { Field, FieldArray, useFormikContext } from 'formik';
import * as yup from 'yup';
import { Trans, useTranslation } from 'react-i18next';
import { Button } from 'flowbite-react';
import TextInputGroup from 'components/forms/TextInputGroup';
import TagsInputGroup from 'components/forms/TagsInputGroup';
import Label from 'components/forms/Label';
import { dateRegExp, isPastDate } from 'utils/date';

// Schema for yup
export const schema = yup.object().shape({
  date_published: yup
    .string()
    .matches(dateRegExp, '*Date is not valid, must be `YYYY-MM-DD`')
    .test(isPastDate),
  submitters: yup
    .string()
    .matches(/^.{3,}$/, {
      excludeEmptyString: true,
      message: '*Submitter must have at least 3 characters',
    })
    .matches(/^.{3,200}$/, {
      excludeEmptyString: true,
      message: "*Submitter list can't be longer than 200 characters",
    }),
  inputs_outputs: yup.array().of(yup.string().min(5, '*Must have at least 5 characters')),
  text: yup
    .string()
    .min(80, `*Text must have at least 80 characters`)
    .max(50000, `*Text can’t be longer than 50000 characters`)
    .when('inputs_outputs', ([inputs_outputs], schema) => {
      return !inputs_outputs || inputs_outputs.length < 5
        ? schema.required('*At least this field or "Inputs / Outputs" should be filled.')
        : schema;
    }),
});

const VariantForm = ({ scrollInputsOutputs = false, allFieldsForm = true }) => {
  const { values, errors, touched, handleChange, handleBlur, isSubmitting, setFieldValue } =
    useFormikContext();

  const { t } = useTranslation(['variants']);

  useEffect(() => {
    if (values?.date_published) {
      const publishedDate = new Date(values.date_published);

      const formattedDate = publishedDate.toISOString().split('T')[0];

      setFieldValue('date_published', formattedDate);
    }

    if (values?.date_downloaded) {
      const publishedDate = new Date(values.date_downloaded);

      const formattedDate = publishedDate.toISOString().split('T')[0];

      setFieldValue('date_downloaded', formattedDate);
    }
  }, [values?.date_published, values?.date_downloaded]);

  return (
    <div className="flex w-full min-w-6xl flex-col" data-cy="variant-form">
      {allFieldsForm && (
        <>
          <TextInputGroup
            name="date_published"
            label={t('Incident Date')}
            placeholder={t('Incident Date')}
            type="date"
            values={values}
            errors={errors}
            touched={touched}
            handleChange={handleChange}
            handleBlur={handleBlur}
            schema={schema}
            data-cy="variant-form-date-published"
          />
          <TagsInputGroup
            name="submitters"
            placeholder={t("Enter your name for the leaderboard or leave blank for 'Anonymous'.")}
            label={t('Submitter(s)')}
            errors={errors}
            touched={touched}
            schema={schema}
            data-cy="variant-form-submitters"
          />
          <TextInputGroup
            label={t('Description of Incident Circumstances')}
            type="textarea"
            as="textarea"
            rows={8}
            placeholder={t('Description of Incident Circumstances')}
            name="text"
            values={values}
            errors={errors}
            touched={touched}
            handleChange={handleChange}
            handleBlur={handleBlur}
            disabled={isSubmitting}
            data-cy="variant-form-text"
          />
        </>
      )}
      <FieldArray
        name="inputs_outputs"
        render={({ pop, push }) => (
          <div className="form-group mt-6">
            <div className="flex items-center">
              <Label popover={'inputs_outputs'} label={t('Inputs / Outputs')} showPopover={true} />
            </div>
            <div className={scrollInputsOutputs ? 'max-h-240 overflow-auto mb-2' : ''}>
              {values.inputs_outputs?.map((io, index) => (
                <div className="mb-3" key={`inputs_outputs.${index}`}>
                  <Field name={`inputs_outputs.${index}`}>
                    {({ field }) => (
                      <TextInputGroup
                        label=""
                        key={`inputs_outputs.${index}`}
                        type="textarea"
                        as="textarea"
                        rows={3}
                        placeholder={t('Inputs / Outputs')}
                        values={values}
                        errors={errors}
                        touched={touched}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        disabled={isSubmitting}
                        data-cy="variant-form-inputs-outputs"
                        {...field}
                      />
                    )}
                  </Field>
                  <div>
                    <span className="text-red-700 text-sm">
                      <Trans ns="validation">
                        {errors && touched && touched['inputs_outputs'] && errors['inputs_outputs']
                          ? errors['inputs_outputs'][index]
                          : null}
                      </Trans>
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              {values.inputs_outputs?.length > 1 && (
                <Button
                  type="button"
                  color="failure"
                  onClick={() => {
                    push('');
                    pop();
                    pop();
                  }}
                  data-cy="delete-text-row-btn"
                >
                  <Trans ns="variants">Delete Row</Trans>
                </Button>
              )}
              <Button type="button" onClick={() => push('')} data-cy="add-text-row-btn">
                <Trans ns="variants">Add Row</Trans>
              </Button>
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default VariantForm;
