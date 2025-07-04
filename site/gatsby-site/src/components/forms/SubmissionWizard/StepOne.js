import { Badge, Button, Spinner } from 'flowbite-react';
import { Formik, Form, useFormikContext } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import TextInputGroup from '../TextInputGroup';
import * as yup from 'yup';
import Label from '../Label';
import FlowbiteSearchInput from '../FlowbiteSearchInput';
import RelatedIncidents from 'components/RelatedIncidents';
import { dateRegExp, isPastDate } from 'utils/date';
import StepContainer from './StepContainer';
import TagsInputGroup from '../TagsInputGroup';
import { Editor } from '@bytemd/react';
import SemanticallyRelatedIncidents from 'components/SemanticallyRelatedIncidents';
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
  faFile,
} from '@fortawesome/free-solid-svg-icons';
import { RESPONSE_TAG } from 'utils/entities';
import IncidentsField from 'components/incidents/IncidentsField';
import { arrayToList } from 'utils/typography';
import { debounce } from 'debounce';
import SubmissionButton from './SubmissionButton';

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
      .required('*Author is required. Anonymous or the publication can be entered.')
      .min(3, '*Authors must have at least 3 characters')
      .max(200, "*Authors can't be longer than 200 characters")
      .nullable(),
    date_published: yup
      .string()
      .matches(dateRegExp, '*Date is not valid, must be `YYYY-MM-DD`')
      .required('*Date published is required')
      .test(isPastDate)
      .nullable(),
    date_downloaded: yup
      .string()
      .matches(dateRegExp, '*Date is not valid, must be `YYYY-MM-DD`')
      .required('*Date downloaded required')
      .test(isPastDate)
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
    setData({ ...props.data });
  }, [props.data]);

  return (
    <StepContainer name={props.name} childClassName="p-6">
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
          submissionReset={props.submissionReset}
          urlFromQueryString={props.urlFromQueryString}
          setSavingInLocalStorage={props.setSavingInLocalStorage}
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
  submissionReset,
  urlFromQueryString,
  setSavingInLocalStorage,
}) => {
  const { t } = useTranslation(['submit', 'translation']);

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

  const saveInLocalStorage = useRef(
    debounce((values) => {
      localStorage.setItem('formValues', JSON.stringify(values));
      setSavingInLocalStorage(false);
    }, 1000)
  ).current;

  useEffect(() => {
    // Save form values to local storage when form values change
    setSavingInLocalStorage(true);
    saveInLocalStorage(values);
  }, [values]);

  useEffect(() => {
    if (!values.date_downloaded) {
      setFieldValue('date_downloaded', new Date().toISOString().substr(0, 10));
    }
  }, [values.date_downloaded]);

  useEffect(() => {
    if (submissionFailed || submissionComplete || submissionReset.reset) {
      setIsSubmitting(false);
      setSubmitCount(0);
    }

    if (submissionComplete || submissionReset.reset) {
      resetForm();
    }
  }, [submissionFailed, submissionComplete, submissionReset]);

  useEffect(() => {
    if (urlFromQueryString) {
      fetchNews(urlFromQueryString);
    }
  }, [urlFromQueryString]);

  useEffect(() => {
    if (values.is_incident_report === null || values.is_incident_report === undefined) {
      setFieldValue('is_incident_report', true);
    }
  }, [values.is_incident_report]);

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
      {values?.incident_ids?.length > 0 && (
        <span className="flex mb-4" data-cy="prefilled-incident-id">
          <Badge>
            {values.tags && values.tags.includes(RESPONSE_TAG) ? (
              <Trans ns="submit" incident_id={arrayToList(values.incident_ids)}>
                Adding a new response to incident{' '}
                {{ incident_id: arrayToList(values.incident_ids) }}
              </Trans>
            ) : (
              <Trans ns="submit" incident_id={arrayToList(values.incident_ids)}>
                Adding a new report to incident {{ incident_id: arrayToList(values.incident_ids) }}
              </Trans>
            )}
          </Badge>
        </span>
      )}
      <Form
        className={`relative ${parsingNews ? 'opacity-50' : ''} ${
          !isEmpty(errors) ? 'form-has-errors' : ''
        }`}
      >
        <FieldContainer>
          <div className="flex items-center mb-1">
            <FontAwesomeIcon
              fixedWidth
              icon={faLink}
              title={t('Report Address')}
              className="mr-1"
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
          <RelatedIncidents
            incident={values}
            setFieldValue={setFieldValue}
            columns={['byURL']}
            triggerSearch={values['url']?.length}
          />
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
            triggerSearch={values['authors']?.length}
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
            triggerSearch={values['date_published']?.length}
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
            <FontAwesomeIcon fixedWidth icon={faNewspaper} title={t('Text')} className="mr-1" />
            <Label popover="text" label={'*' + t('Text')} />
          </div>
          <div
            className="mb-2"
            style={{
              position: 'relative',
              ...styles,
            }}
            onBlur={() => setFieldTouched('text', true)}
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
          <div className="flex items-center mb-1">
            <FontAwesomeIcon fixedWidth icon={faFile} title={t('Report Type')} className="mr-1" />
            <Label popover="report_type" label={t('Report Type')} />
          </div>
          <Button.Group>
            <Button
              color={!values.is_incident_report ? 'light' : 'dark'}
              onClick={() => {
                setFieldValue('is_incident_report', true);
              }}
            >
              {t('Incident', { ns: 'translation' })}
            </Button>
            <Button
              color={!values.is_incident_report ? 'dark' : 'light'}
              onClick={() => {
                setFieldValue('is_incident_report', false);
              }}
            >
              {t('Issue', { ns: 'translation' })}
            </Button>
          </Button.Group>
        </FieldContainer>

        <FieldContainer>
          <div className={`form-group`}>
            <div className="flex items-center">
              <Label popover="incident_id" label={t('Incident IDs')} />
            </div>
            <div className="mt-1">
              <IncidentsField
                id="incident_ids"
                name="incident_ids"
                placeHolder={t('Leave empty to report a new incident')}
              />
            </div>
          </div>
        </FieldContainer>

        {values?.incident_ids?.length == 0 && (
          <FieldContainer>
            <TextInputGroup
              name="incident_date"
              label={t('Incident Date')}
              placeholder={t('Incident Date')}
              type="date"
              disabled={parsingNews}
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
          <SubmissionButton
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
          />
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
