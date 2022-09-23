import { Badge, Button, Spinner } from 'flowbite-react';
import { Formik, Form, useFormikContext } from 'formik';
import React, { useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import TextInputGroup from '../TextInputGroup';
import * as yup from 'yup';
import Label from '../Label';
import FlowbiteSearchInput from '../FlowbiteSearchInput';
import RelatedIncidents from 'components/RelatedIncidents';
import { dateRegExp } from 'utils/date';
import StepContainer from './StepContainer';
import { isEmpty } from 'lodash';
import TagsInputGroup from '../TagsInputGroup';

const StepOne = (props) => {
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
    submitters: yup
      .string()
      .min(3, '*Submitter must have at least 3 characters')
      .max(200, "*Submitter list can't be longer than 200 characters")
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
  });

  const handleSubmit = (values) => {
    props.next(values);
  };

  return (
    <StepContainer name={props.name}>
      <Formik
        initialValues={props.data}
        onSubmit={handleSubmit}
        validationSchema={stepOneValidationSchema}
        enableReinitialize
      >
        <FormDetails parsingNews={props.parsingNews} parseNewsUrl={props.parseNewsUrl} schema={stepOneValidationSchema}/>
      </Formik>
    </StepContainer>
  );
};

const FormDetails = ({ parsingNews, parseNewsUrl, schema }) => {
  const { t } = useTranslation(['submit']);

  const { values, errors, touched, handleChange, handleBlur, setFieldValue, setFieldTouched } =
    useFormikContext();

  useEffect(() => {
    if (!values['date_downloaded']) {
      setFieldValue('date_downloaded', new Date().toISOString().substr(0, 10));
    }
  }, []);

  const fetchNews = async (url) => {
    await parseNewsUrl(url);
    Object.keys(errors).map((key) => {
      setFieldTouched(key, true);
    });
  };

  return (
    <>
      {parsingNews && (
        <div className="absolute top-1/2 left-1/2 z-10">
          <Spinner size="xl" />
        </div>
      )}
      {values.incident_id && <span className='flex mb-4' data-cy='prefilled-incident-id'><Badge><Trans>Adding a new report to incident {values.incident_id}</Trans></Badge></span>}
      <Form className={`relative z-2 ${parsingNews ? 'opacity-50' : ''}`}>
        <Label label={t('Report Address')} popover="url"></Label>
        <FlowbiteSearchInput
          name="url"
          label={t('Report Address')}
          placeholder={t('Report URL')}
          defaultValue={values?.url || ''}
          dataCy='fetch-info'
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

        <TextInputGroup
          name="title"
          label={t('Title')}
          placeholder={t('Report title')}
          className="mt-3"
          values={values}
          errors={errors}
          touched={touched}
          handleChange={handleChange}
          handleBlur={handleBlur}
          schema={schema}
        />

        <TagsInputGroup
          name="authors"
          label={t('Author(s)')}
          placeholder={t('The author or authors of the report')}
          className="mt-3"
          errors={errors}
          touched={touched}
          schema={schema}
        />

        <RelatedIncidents incident={values} setFieldValue={setFieldValue} columns={['byAuthors']} />

        <TagsInputGroup
          name="submitters"
          placeholder={t('Your name as you would like it to appear in the leaderboard')}
          label={t('Submitter(s)')}
          className="mt-3"
          errors={errors}
          touched={touched}
          schema={schema}
        />

        <TextInputGroup
          name="date_published"
          label={t('Date Published')}
          type="date"
          placeholder={t('YYYY-MM-DD')}
          className="mt-3"
          values={values}
          errors={errors}
          touched={touched}
          handleChange={handleChange}
          handleBlur={handleBlur}
          schema={schema}
        />
        <RelatedIncidents
          incident={values}
          setFieldValue={setFieldValue}
          columns={['byDatePublished']}
        />

        <TextInputGroup
          name="date_downloaded"
          label={t('Date Downloaded')}
          type="date"
          placeholder={t('YYYY-MM-DD')}
          className="mt-3"
          values={values}
          errors={errors}
          touched={touched}
          handleChange={handleChange}
          handleBlur={handleBlur}
          schema={schema}
        />
        <div className="flex justify-end mt-4">
          <Button type="submit" data-cy="to-step-2">
            <Trans>Next</Trans>
          </Button>
        </div>
      </Form>
    </>
  );
};

export default StepOne;
