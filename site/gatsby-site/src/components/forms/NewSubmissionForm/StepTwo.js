import { Button, Select } from 'flowbite-react';
import { Formik, Form } from 'formik';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import TextInputGroup from '../TextInputGroup';
import * as yup from 'yup';
import Label from '../Label';
import SemanticallyRelatedIncidents from 'components/SemanticallyRelatedIncidents';
import IncidentIdField from 'components/incidents/IncidentIdField';
import RelatedIncidents from 'components/RelatedIncidents';
import supportedLanguages from '../../../components/i18n/languages.json';
import { Editor } from '@bytemd/react';

const StepTwo = (props) => {
  const { t } = useTranslation(['submit']);

  const stepTwoValidationSchema = yup.object().shape({
    submitters: yup.string().required(t('Submitters is required')),
  });

  const handleSubmit = (values) => {
    props.next(values);
  };

  return (
    <div className={`p-6 border rounded-lg mt-6 relative `}>
      <div className="absolute -top-5 bg-white px-4 text-primary-blue text-xl">{props.name}</div>
      <Formik
        initialValues={props.data}
        onSubmit={handleSubmit}
        validationSchema={stepTwoValidationSchema}
      >
        {(TextInputGroupProps) => (
          <Form>
            {/* <Form.Group
                            className={'mt-3' + (touched['text'] && errors['text'] ? ' is-invalid' : '')}
                            data-color-mode="light"
                        > */}
            <Label popover="text" label={t('Text')} />
            <div style={{ position: 'relative' }}>
              {TextInputGroupProps.touched['text'] && TextInputGroupProps.errors['text'] && (
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
                value={TextInputGroupProps.values.text}
                onChange={(value) => {
                  TextInputGroupProps.setFieldValue('text', value);
                  TextInputGroupProps.setFieldTouched('text', true);
                }}
              />
            </div>
            {/* </Form.Group> */}
            {/* <Form.Control.Feedback type="invalid"> */}
            <Trans ns="validation">
              {TextInputGroupProps.errors['text'] && TextInputGroupProps.touched['text']
                ? TextInputGroupProps.errors['text']
                : null}
            </Trans>
            {/* </Form.Control.Feedback> */}

            <SemanticallyRelatedIncidents
              incident={TextInputGroupProps.values}
              setFieldValue={TextInputGroupProps.setFieldValue}
            />

            {/* <Form.Group className="mt-3"> */}
            <Label popover="language" label={t('Language')} />
            <Select
              name="language"
              placeholder={t('Report Language')}
              value={TextInputGroupProps.values.language}
              onChange={TextInputGroupProps.handleChange}
            >
              {supportedLanguages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name}
                </option>
              ))}
            </Select>
            {/* </Form.Group> */}

            <IncidentIdField
              name="incident_id"
              className="mt-3"
              placeHolder={t('Leave empty to report a new incident')}
              showIncidentData={false}
            />

            <RelatedIncidents
              incident={TextInputGroupProps.values}
              setFieldValue={TextInputGroupProps.setFieldValue}
              columns={['byIncidentId']}
            />

            {!TextInputGroupProps.values.incident_id && (
              <TextInputGroup
                name="incident_date"
                label={t('Incident Date')}
                placeholder={t('Incident Date')}
                type="date"
                className="mt-3"
                disabled={TextInputGroupProps.values.incident_id}
                {...TextInputGroupProps}
              />
            )}

            <Button type="button" onClick={() => props.previous(TextInputGroupProps.values)}>
              Previous
            </Button>
            <Button type="submit">Submit</Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default StepTwo;
