import { Button, Select } from 'flowbite-react';
import { Formik, Form, useFormikContext } from 'formik';
import React, { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import TextInputGroup from '../TextInputGroup';
import * as yup from 'yup';
import Label from '../Label';
import IncidentIdField from 'components/incidents/IncidentIdField';
import RelatedIncidents from 'components/RelatedIncidents';
import supportedLanguages from '../../i18n/languages.json';
import { getCloudinaryPublicID, PreviewImageInputGroup } from 'utils/cloudinary';
import StepContainer from './StepContainer';
import TagsInputGroup from '../TagsInputGroup';

const StepTwo = (props) => {
  const [data, setData] = useState(props.data);

  // Schema for yup
  const stepTwoValidationSchema = yup.object().shape({
    submitters: yup
      .string()
      .min(3, '*Submitter must have at least 3 characters')
      .max(200, "*Submitter list can't be longer than 200 characters")
      .nullable(),
    image_url: yup.string(),
    incident_id: yup.number().positive().integer('*Must be an incident number or empty'),
    incident_date: yup.date().when('incident_id', {
      is: (incident_id) => incident_id == '' || incident_id === undefined,
      then: yup.date().required('*Incident Date required').nullable(),
    }),
  });

  const handleSubmit = (values, last) => {
    props.next(values, last);
  };

  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  return (
    <StepContainer name={props.name}>
      <Formik
        initialValues={data}
        onSubmit={() => {}}
        validationSchema={stepTwoValidationSchema}
        enableReinitialize
      >
        <FormDetails
          data={data}
          previous={props.previous}
          schema={stepTwoValidationSchema}
          onSubmit={handleSubmit}
        />
      </Formik>
    </StepContainer>
  );
};

const FormDetails = ({ data, previous, schema, onSubmit }) => {
  const { t } = useTranslation(['submit']);

  const { values, errors, touched, handleChange, handleBlur, setFieldValue, setFieldTouched } =
    useFormikContext();

  useEffect(() => {
    Object.keys(errors).map((key) => {
      setFieldTouched(key, true);
    });
  }, [data, errors]);

  useEffect(() => {
    setFieldValue('cloudinary_id', values.image_url ? getCloudinaryPublicID(values.image_url) : '');
  }, [values.image_url]);

  return (
    <Form>
      <TagsInputGroup
        name="submitters"
        placeholder={t('Your name as you would like it to appear in the leaderboard')}
        label={t('Submitter(s)')}
        className="mt-3"
        errors={errors}
        touched={touched}
        schema={schema}
      />

      <PreviewImageInputGroup
        cloudinary_id={data.cloudinary_id}
        name="image_url"
        label={t('Image Address')}
        placeholder={t('Image URL')}
        className="mt-3"
        values={values}
        errors={errors}
        touched={touched}
        handleChange={handleChange}
        handleBlur={handleBlur}
        schema={schema}
      />

      <Label popover="language" label={t('Language')} />
      <Select
        name="language"
        placeholder={t('Report Language')}
        value={values.language}
        onChange={handleChange}
      >
        {supportedLanguages.map((l) => (
          <option key={l.code} value={l.code}>
            {l.name}
          </option>
        ))}
      </Select>

      <IncidentIdField
        name="incident_id"
        className="mt-3"
        placeHolder={t('Leave empty to report a new incident')}
        showIncidentData={false}
      />

      <RelatedIncidents
        incident={values}
        setFieldValue={setFieldValue}
        columns={['byIncidentId']}
      />

      {!values.incident_id && (
        <TextInputGroup
          name="incident_date"
          label={t('Incident Date')}
          placeholder={t('Incident Date')}
          type="date"
          className="mt-3"
          disabled={values.incident_id}
          values={values}
          errors={errors}
          touched={touched}
          handleChange={handleChange}
          handleBlur={handleBlur}
          schema={schema}
        />
      )}
      <div className="flex justify-between mt-4">
        <Button type="button" color={'light'} onClick={() => previous(values)}>
          <svg
            aria-hidden="true"
            className="mr-2 w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
          <Trans>Previous</Trans>
        </Button>
        <div className="flex justify-end gap-2">
          <Button
            gradientDuoTone="greenToBlue"
            onClick={() => {
              onSubmit(values, true);
            }}
          >
            <Trans ns="submit">Submit</Trans>
          </Button>
          <Button
            data-cy="to-step-3"
            color={'light'}
            onClick={() => {
              onSubmit(values, false);
            }}
          >
            <Trans>Add more info</Trans>
            <svg
              aria-hidden="true"
              className="ml-2 w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default StepTwo;
