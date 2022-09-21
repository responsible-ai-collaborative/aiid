import { Button, Spinner } from 'flowbite-react';
import { Formik, Form } from 'formik';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import TextInputGroup from '../TextInputGroup';
import * as yup from 'yup';
import Label from '../Label';
import FlowbiteSearchInput from '../FlowbiteSearchInput';
import RelatedIncidents from 'components/RelatedIncidents';
import { dateRegExp } from 'utils/date';
import StepContainer from './StepContainer';
import { isEmpty } from 'lodash';
// import { PreviewImageInputGroup } from 'utils/cloudinary';

const StepOne = (props) => {
  const { t } = useTranslation(['submit']);

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
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          setFieldValue,
          setFieldTouched,
        }) => {
          console.log('errors', errors);
          return (
            <>
              {props.parsingNews && (
                <div className="absolute top-1/2 left-1/2 z-10">
                  <Spinner size="xl" />
                </div>
              )}
              <Form className={`relative z-2 ${props.parsingNews ? 'opacity-50' : ''}`}>
                <Label label={t('Report Address')} popover="url"></Label>
                <FlowbiteSearchInput
                  name="url"
                  label={t('Report Address')}
                  placeholder={t('Report URL')}
                  defaultValue={values?.url || ''}
                  addOnComponent={
                    <Button
                      // className="outline-secondary"
                      disabled={!!errors.url || !touched.url || props.parsingNews}
                      onClick={() => props.parseNewsUrl(values.url)}
                      data-cy="fetch-info"
                    >
                      {!props.parsingNews ? (
                        <Trans ns="submit">Fetch info</Trans>
                      ) : (
                        <div className="flex gap-2">
                          <Spinner size="sm" />
                          <Trans ns="submit">Fetching...</Trans>
                        </div>
                      )}
                    </Button>
                  }
                  values={values}
                  errors={errors}
                  touched={touched}
                  handleBlur={handleBlur}
                  handleChange={(e) => {
                    setFieldTouched('url', true);
                    handleChange(e);
                  }}
                  btnClick={() => props.parseNewsUrl(values.url)}
                  loading={props.parsingNews}
                  btnDisabled={!!errors.url || !touched.url || props.parsingNews}
                  btnText={t('Fetch info')}
                />

                <RelatedIncidents
                  incident={values}
                  setFieldValue={setFieldValue}
                  columns={['byURL']}
                />

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
                />

                <TextInputGroup
                  name="authors"
                  label={t('Author CSV')}
                  placeholder={t('Author CSV')}
                  className="mt-3"
                  values={values}
                  errors={errors}
                  touched={touched}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                />

                <RelatedIncidents
                  incident={values}
                  setFieldValue={setFieldValue}
                  columns={['byAuthors']}
                />

                <TextInputGroup
                  name="submitters"
                  label={t('Submitter CSV')}
                  placeholder={t('Submitter CSV')}
                  className="mt-3"
                  values={values}
                  errors={errors}
                  touched={touched}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
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
                />
                <div className="flex justify-end mt-4">
                  <Button type="submit" disabled={!isEmpty(errors)}>
                    <Trans>Next</Trans>
                  </Button>
                </div>
              </Form>
            </>
          );
        }}
      </Formik>
    </StepContainer>
  );
};

export default StepOne;
