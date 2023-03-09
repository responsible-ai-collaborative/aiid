import { Badge, Button, Spinner } from 'flowbite-react';
import { Formik, Form, useFormikContext } from 'formik';
import React, { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import TextInputGroup from '../TextInputGroup';
import * as yup from 'yup';
import Label from '../Label';
import FlowbiteSearchInput from '../FlowbiteSearchInput';
import RelatedIncidents from 'components/RelatedIncidents';
import { dateRegExp } from 'utils/date';
import StepContainer from './StepContainer';
import TagsInputGroup from '../TagsInputGroup';
import { Editor } from '@bytemd/react';
import SemanticallyRelatedIncidents from 'components/SemanticallyRelatedIncidents';
import IncidentIdField from 'components/incidents/IncidentIdField';
import isEmpty from 'lodash/isEmpty';
import { format } from 'date-fns';
import FieldContainer from './FieldContainer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPenNib,
  faCalendar,
  faLink,
  faDownload,
  faNewspaper,
  faTenge,
} from '@fortawesome/free-solid-svg-icons';
import { RESPONSE_TAG } from 'utils/entities';

const StepOne = (props) => {
  const [data, setData] = useState(props.data);

  const stepOneValidationSchema = yup.object().shape({
    title: yup
      .string()
      .min(6, '*Title must have at least 6 characters')
      .max(500, "*Titles can't be longer than 500 characters")
      .required('*Title is required')
      .nullable(),
    authors: yup
      .string()
      .min(3, '*Authors must have at least 3 characters')
      .max(200, "*Authors can't be longer than 200 characters")
      .required('*Author is required. Anonymous or the publication can be entered.')
      .nullable(),
    date_published: yup
      .string()
      .matches(dateRegExp, '*Date is not valid, must be `YYYY-MM-DD`')
      .required('*Date published is required')
      .nullable(),
    date_downloaded: yup
      .string()
      .matches(dateRegExp, '*Date is not valid, must be `YYYY-MM-DD`')
      .required('*Date downloaded required')
      .nullable(),
    url: yup
      .string()
      .url('*Must enter URL in http://www.example.com format')
      .required('*URL required')
      .nullable(),
    text: yup
      .string()
      .min(80, `*Text must have at least 80 characters`)
      .max(50000, `*Text can’t be longer than 50000 characters`)
      .required('*Text is required'),
    incident_id: yup.number().positive().integer('*Must be an incident number or empty'),
    incident_date: yup.date(),
  });

  const handleSubmit = (values, last = false) => {
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
        validationSchema={stepOneValidationSchema}
        enableReinitialize
      >
        <FormDetails
          parsingNews={props.parsingNews}
          parseNewsUrl={props.parseNewsUrl}
          schema={stepOneValidationSchema}
          submitForm={handleSubmit}
          validateAndSubmitForm={props.validateAndSubmitForm}
          submissionFailed={props.submissionFailed}
          submissionComplete={props.submissionComplete}
          urlFromQueryString={props.urlFromQueryString}
        />
      </Formik>
    </StepContainer>
  );
};

const FormDetails = ({
  parsingNews,
  parseNewsUrl,
  schema,
  submitForm,
  validateAndSubmitForm,
  submissionFailed,
  submissionComplete,
  urlFromQueryString,
}) => {
  const { t } = useTranslation(['submit']);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [submitCount, setSubmitCount] = useState(0);

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldTouched,
    isValid,
    validateForm,
    resetForm,
  } = useFormikContext();

  useEffect(() => {
    if (!values.date_downloaded) {
      setFieldValue('date_downloaded', new Date().toISOString().substr(0, 10));
    }
  }, [values.date_downloaded]);

  useEffect(() => {
    if (submissionFailed || submissionComplete) {
      setIsSubmitting(false);
      setSubmitCount(0);
    }

    if (submissionComplete) {
      resetForm();
    }
  }, [submissionFailed, submissionComplete]);

  useEffect(() => {
    if (urlFromQueryString) {
      fetchNews(urlFromQueryString);
    }
  }, [urlFromQueryString]);

  const fetchNews = async (url) => {
    await parseNewsUrl(url);
    Object.keys(errors).map((key) => {
      setFieldTouched(key, true);
    });
  };

  const styles = {
    border: errors['text'] && touched['text'] ? '1px solid red' : 'none',
    borderRadius: errors['text'] && touched['text'] ? '4px' : 'none',
    padding: errors['text'] && touched['text'] ? '0.5rem' : '0',
  };

  const incident_id = values.incident_id;

  return (
    <>
      {parsingNews && (
        <>
          <div className="absolute top-0 left-0 z-10 w-full h-full flex justify-center items-start opacity-30 bg-gray-200"></div>
          <span className="absolute top-0 left-1/2 pt-20 z-10">
            <Spinner size="xl" />
          </span>
        </>
      )}
      {incident_id && (
        <span className="flex mb-4" data-cy="prefilled-incident-id">
          <Badge>
            {values.tags && values.tags.includes(RESPONSE_TAG) ? (
              <Trans ns="submit">Adding a new response to incident {{ incident_id }}</Trans>
            ) : (
              <Trans ns="submit">Adding a new report to incident {{ incident_id }}</Trans>
            )}
          </Badge>
        </span>
      )}
      <Form
        className={`relative z-2 ${parsingNews ? 'opacity-50' : ''} ${
          !isEmpty(errors) ? 'form-has-errors' : ''
        }`}
      >
        <FieldContainer>
          <div className="flex items-center mb-1">
            <FontAwesomeIcon
              fixedWidth
              icon={faLink}
              title={t('Report Address')}
              className="mb-2 mr-1"
            />
            <Label label={'*' + t('Report Address')} popover="url"></Label>
          </div>
          <FlowbiteSearchInput
            name="url"
            label={t('Report Address')}
            placeholder={t('Report URL')}
            defaultValue={values?.url || ''}
            dataCy="fetch-info"
            values={values}
            errors={errors}
            touched={touched}
            handleBlur={handleBlur}
            handleChange={(e) => {
              setFieldTouched('url', true);
              handleChange(e);
            }}
            btnClick={() => fetchNews(values.url)}
            loading={parsingNews}
            btnDisabled={!!errors.url || !touched.url || parsingNews}
            btnText={t('Fetch info')}
          />
          <RelatedIncidents incident={values} setFieldValue={setFieldValue} columns={['byURL']} />
        </FieldContainer>

        <FieldContainer>
          <TextInputGroup
            name="title"
            label={t('Title')}
            placeholder={t('Report title')}
            values={values}
            errors={errors}
            touched={touched}
            handleChange={handleChange}
            handleBlur={handleBlur}
            schema={schema}
            disabled={parsingNews}
            icon={faTenge}
          />
        </FieldContainer>

        <FieldContainer>
          <TagsInputGroup
            name="authors"
            label={t('Author(s)')}
            placeholder={t('The author or authors of the report')}
            errors={errors}
            touched={touched}
            schema={schema}
            disabled={parsingNews}
            icon={faPenNib}
          />
          <RelatedIncidents
            incident={values}
            setFieldValue={setFieldValue}
            columns={['byAuthors']}
          />
        </FieldContainer>

        <FieldContainer>
          <TextInputGroup
            name="date_published"
            label={t('Date Published')}
            type="date"
            placeholder={t('YYYY-MM-DD')}
            values={values}
            errors={errors}
            touched={touched}
            handleChange={handleChange}
            handleBlur={handleBlur}
            schema={schema}
            disabled={parsingNews}
            icon={faCalendar}
          />
          <RelatedIncidents
            incident={values}
            setFieldValue={setFieldValue}
            columns={['byDatePublished']}
          />
        </FieldContainer>

        <FieldContainer>
          <TextInputGroup
            name="date_downloaded"
            label={t('Date Downloaded')}
            type="date"
            placeholder={t('YYYY-MM-DD')}
            values={values}
            errors={errors}
            touched={touched}
            handleChange={handleChange}
            handleBlur={handleBlur}
            schema={schema}
            disabled={parsingNews}
            defaultValue={format(new Date(), 'yyyy-MM-dd')}
            icon={faDownload}
          />
        </FieldContainer>

        <FieldContainer>
          <div className="flex items-center mt-3 mb-1">
            <FontAwesomeIcon
              fixedWidth
              icon={faNewspaper}
              title={t('Text')}
              className="mb-2 mr-1"
            />
            <Label popover="text" label={'*' + t('Text')} />
          </div>
          <div
            className="mb-2"
            style={{
              position: 'relative',
              ...styles,
            }}
          >
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
                if (!submissionComplete) {
                  setFieldTouched('text', true);
                } else if (value === '') {
                  setFieldTouched('text', false);
                }
              }}
            />
          </div>
          <span className="text-red-700 text-sm">
            <Trans ns="validation">
              {errors['text'] && touched['text'] ? errors['text'] : null}
            </Trans>
          </span>
          <SemanticallyRelatedIncidents incident={values} setFieldValue={setFieldValue} />
        </FieldContainer>

        <FieldContainer>
          <IncidentIdField
            name="incident_id"
            placeHolder={t('Leave empty to report a new incident')}
            showIncidentData={false}
            disabled={parsingNews}
          />
          <RelatedIncidents
            incident={values}
            setFieldValue={setFieldValue}
            columns={['byIncidentId']}
          />
        </FieldContainer>

        {!values.incident_id && (
          <FieldContainer>
            <TextInputGroup
              name="incident_date"
              label={t('Incident Date')}
              placeholder={t('Incident Date')}
              type="date"
              disabled={values.incident_id || parsingNews}
              values={values}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              handleBlur={handleBlur}
              schema={schema}
              icon={faCalendar}
            />
          </FieldContainer>
        )}

        <div className="flex justify-end mt-8 gap-2">
          <Button
            data-cy="to-step-2"
            color={'light'}
            disabled={isSubmitting || parsingNews}
            onClick={() => {
              setSubmitCount(submitCount + 1);
              validateAndSubmitForm(
                false,
                setIsSubmitting,
                isValid,
                validateForm,
                setFieldTouched,
                values,
                submitForm
              );
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
        <div className="flex justify-end mt-4 gap-2">
          <Button
            data-cy="submit-step-1"
            disabled={isSubmitting || parsingNews}
            onClick={() => {
              setSubmitCount(submitCount + 1);
              validateAndSubmitForm(
                true,
                setIsSubmitting,
                isValid,
                validateForm,
                setFieldTouched,
                values,
                submitForm
              );
            }}
          >
            {isSubmitting && (
              <div className="mr-3">
                <Spinner size="sm" light={true} />
              </div>
            )}
            <Trans>Submit</Trans>
          </Button>
        </div>
      </Form>

      {!isValid && submitCount > 0 && (
        <div className="text-danger text-right">
          <Trans ns="validation">Please review. Some data is missing.</Trans>
        </div>
      )}
    </>
  );
};

export default StepOne;
