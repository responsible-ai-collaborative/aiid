import { Button, Select } from 'flowbite-react';
import { Formik, Form, useFormikContext } from 'formik';
import React, { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import TextInputGroup from '../TextInputGroup';
import * as yup from 'yup';
import Label from '../Label';
import SemanticallyRelatedIncidents from 'components/SemanticallyRelatedIncidents';
import IncidentIdField from 'components/incidents/IncidentIdField';
import RelatedIncidents from 'components/RelatedIncidents';
import supportedLanguages from '../../../components/i18n/languages.json';
import { Editor } from '@bytemd/react';
import { getCloudinaryPublicID, PreviewImageInputGroup } from 'utils/cloudinary';
import StepContainer from './StepContainer';
import { isEmpty } from 'lodash';

const StepTwo = (props) => {
  const [data, setData] = useState(props.data);

  // Schema for yup
  const stepTwoValidationSchema = yup.object().shape({
    text: yup
      .string()
      .min(80, `*Text must have at least 80 characters`)
      .max(50000, `*Text can’t be longer than 50000 characters`)
      .required('*Text is required'),
    incident_id: yup.number().positive().integer('*Must be an incident number or empty'),
    incident_date: yup.date().when('incident_id', {
      is: (incident_id) => incident_id == '' || incident_id === undefined,
      then: yup.date().required('*Incident Date required').nullable(),
    }),
  });

  const handleSubmit = (values) => {
    props.next(values);
  };

  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  useEffect(() => {
    setData({
      ...data,
      cloudinary_id: data.image_url ? getCloudinaryPublicID(data.image_url) : '',
    });
  }, [data.image_url]);

  return (
    <StepContainer name={props.name}>
      <Formik
        initialValues={data}
        onSubmit={handleSubmit}
        validationSchema={stepTwoValidationSchema}
        enableReinitialize
      >
        <FormDetails data={data} previous={props.previous} />
      </Formik>
    </StepContainer>
  );
};

const FormDetails = ({ data, previous }) => {
  const { t } = useTranslation(['submit']);

  const { values, errors, touched, handleChange, handleBlur, setFieldValue, setFieldTouched } =
    useFormikContext();

  useEffect(() => {
    Object.keys(errors).map((key) => {
      setFieldTouched(key, true);
    });
  }, [data]);

  return (
    <Form>
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
      />
      <Label popover="text" label={t('Text')} />
      <div style={{ position: 'relative' }}>
        {touched['text'] && errors['text'] && (
          <div
            style={{
              position: 'absolute',
              inset: '0px',
              border: '1px solid var(--bs-red)',
              zIndex: 10,
              pointerEvents: 'none',
            }}
          />
        )}
        <Editor
          value={values.text}
          onChange={(value) => {
            setFieldValue('text', value);
            setFieldTouched('text', true);
          }}
        />
      </div>
      <Trans ns="validation">{errors['text'] && touched['text'] ? errors['text'] : null}</Trans>

      <SemanticallyRelatedIncidents incident={values} setFieldValue={setFieldValue} />

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
        />
      )}
      <div className="flex justify-between mt-4">
        <Button type="button" onClick={() => previous(values)}>
          <Trans>Previous</Trans>
        </Button>
        <Button type="submit" disabled={!isEmpty(errors)}>
          <Trans>Next</Trans>
        </Button>
      </div>
    </Form>
  );
};

export default StepTwo;
