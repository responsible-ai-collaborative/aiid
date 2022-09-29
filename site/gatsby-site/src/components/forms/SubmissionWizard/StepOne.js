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
import IsIncidentReportField from 'components/submissions/IsIncidentReportField';
import useToastContext, { SEVERITY } from 'hooks/useToast';
import { getCloudinaryPublicID } from 'utils/cloudinary';
import { Editor } from '@bytemd/react';
import SemanticallyRelatedIncidents from 'components/SemanticallyRelatedIncidents';

const StepOne = (props) => {
  const stepOneValidationSchema = yup.object().shape({
    is_incident_report: yup.bool().required(),
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
  });

  const handleSubmit = (values, last = false) => {
    props.next(values, last);
  };

  return (
    <StepContainer name={props.name}>
      <Formik
        initialValues={props.data}
        onSubmit={(values) => handleSubmit(values)}
        validationSchema={stepOneValidationSchema}
        enableReinitialize
      >
        <FormDetails schema={stepOneValidationSchema} />
      </Formik>
    </StepContainer>
  );
};

const FormDetails = ({ schema }) => {
  const { t } = useTranslation(['submit']);

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    submitForm,
    setFieldTouched,
  } = useFormikContext();

  useEffect(() => {
    if (!values['date_downloaded']) {
      setFieldValue('date_downloaded', new Date().toISOString().substr(0, 10));
    }
  }, []);

  const addToast = useToastContext();

  const [parsingNews, setParsingNews] = useState(false);

  const parseNewsUrl = async (newsUrl) => {
    setParsingNews(true);

    try {
      const url = `/api/parseNews?url=${encodeURIComponent(newsUrl)}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Parser error');
      }

      const news = await response.json();

      addToast({
        message: (
          <Trans>Please verify all information programmatically pulled from the report</Trans>
        ),
        severity: SEVERITY.info,
      });

      const cloudinary_id = getCloudinaryPublicID(news.image_url);

      const newValues = {
        ...news,
        url: newsUrl,
        cloudinary_id,
      };

      for (const field in newValues) {
        setFieldValue(field, ['authors'].includes(field) ? [newValues[field]] : newValues[field]);
      }
    } catch (e) {
      const message =
        e.message == 'Parser error'
          ? t(
              `Error fetching news. Scraping was blocked by {{newsUrl}}. Please enter the text manually.`,
              { newsUrl }
            )
          : t(`Error reaching news info endpoint, please try again in a few seconds.`);

      addToast({
        message: <>{message}</>,
        severity: SEVERITY.danger,
      });
    }

    setParsingNews(false);
  };

  const styles = {
    border: errors['text'] && touched['text'] ? '1px solid red' : 'none',
    borderRadius: errors['text'] && touched['text'] ? '4px' : 'none',
    padding: errors['text'] && touched['text'] ? '0.5rem' : '0',
  };

  return (
    <>
      {parsingNews && (
        <div className="absolute top-1/2 left-1/2 z-10">
          <Spinner size="xl" />
        </div>
      )}
      {values.incident_id && (
        <span className="flex mb-4" data-cy="prefilled-incident-id">
          <Badge>
            <Trans>Adding a new report to incident {values.incident_id}</Trans>
          </Badge>
        </span>
      )}
      <Form className={`relative z-2 ${parsingNews ? 'opacity-50' : ''}`}>
        <Label label={t('Is this an Incident Report?')} popover="is_incident_report"></Label>
        <IsIncidentReportField className="mb-4" />

        <Label label={t('Report Address')} popover="url"></Label>
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
          btnClick={() => parseNewsUrl(values.url)}
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
          className="mt-3 mb-2"
          values={values}
          errors={errors}
          touched={touched}
          handleChange={handleChange}
          handleBlur={handleBlur}
          schema={schema}
        />

        <Label popover="text" label={'*' + t('Text')} />
        <div
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
              setFieldTouched('text', true);
            }}
          />
        </div>
        <span className="text-red-700 text-sm">
          <Trans ns="validation">{errors['text'] && touched['text'] ? errors['text'] : null}</Trans>
        </span>

        <SemanticallyRelatedIncidents incident={values} setFieldValue={setFieldValue} />
        <div className="flex justify-end mt-4 gap-2">
          <Button
            gradientDuoTone="greenToBlue"
            onClick={() => {
              submitForm();
            }}
          >
            <Trans ns="submit">Submit</Trans>
          </Button>
          <Button
            data-cy="to-step-2"
            color={'light'}
            onClick={() => {
              submitForm();
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
      </Form>
    </>
  );
};

export default StepOne;
