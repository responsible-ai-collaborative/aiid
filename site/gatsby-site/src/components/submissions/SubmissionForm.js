import React, { useCallback, useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Spinner } from 'flowbite-react';
import { useFormikContext } from 'formik';
import * as yup from 'yup';
import TextInputGroup from '../../components/forms/TextInputGroup';
import TagsInputGroup from '../../components/forms/TagsInputGroup';
import useToastContext, { SEVERITY } from '../../hooks/useToast';
import { dateRegExp } from '../../utils/date';
import { getCloudinaryPublicID, PreviewImageInputGroup } from '../../utils/cloudinary';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { graphql, useStaticQuery } from 'gatsby';
import Label from '../forms/Label';
import IncidentIdField from '../../components/incidents/IncidentIdField';
import getSourceDomain from '../../utils/getSourceDomain';
import { Editor } from '@bytemd/react';
import 'bytemd/dist/index.css';
import supportedLanguages from '../../components/i18n/languages.json';
import { Trans, useTranslation } from 'react-i18next';
import RelatedIncidents from '../../components/RelatedIncidents';
import SemanticallyRelatedIncidents from '../../components/SemanticallyRelatedIncidents';

// set in form //
// * title: "title of the report" # (string) The title of the report that is indexed.
// * text: "Long text for the report" # (string) This is the complete text for the report in the MongoDB instance, and a shortened subset in the Algolia index
// * date_downloaded:`2019-07-25` # (Date) Date the report was downloaded.
// * submitters: Array(string) # People that submitted the incident report
// * authors: Array(string) # People that wrote the incident report
// * date_published: `2019-07-25` # (Date or null) The publication date of the report.
// * image_url: "http://si.wsj.net/public/resources/images/BN-IM269_YouTub_P_2015051817" # (string) The URL for the image that is indexed. This will be stored on the server as a hash of the URL.
// * url: "https://blogs.wsj.com/digits/2015/05/19/googles-youtube-kids-app-criti" # The fully qualified URL to the report as hosted on the web.
// * tags: Array(string) # Open tag set tags applied to the report
// * incident_date: `2019-07-25` (Date or null) The date in which the incident took place

// set in DB function //
// * source_domain: "blogs.wsj.com" # (string) The domain name hosting the report.
// * incident_id: 1 # (int) The incrementing primary key for incidents, which are a collection of reports.
// * date_submitted:`2019-07-25` # (Date) Date the report was submitted to the AIID. This determines citation order.
// * report_number: 2379 # (int) the incrementing primary key for the report. This is a global resource identifier.
// * date_modified: `2019-07-25` # (Date or null) Date the report was edited.
// * language: "en" # (string) The language identifier of the report.

// Schema for yup
export const schema = yup.object().shape({
  title: yup
    .string()
    .min(6, '*Title must have at least 6 characters')
    .max(500, "*Titles can't be longer than 500 characters")
    .required('*Title is required'),
  description: yup
    .string()
    .min(3, 'Description must have at least 3 characters')
    .max(500, "Description can't be longer than 500 characters"),
  developers: yup.string().when(['_id', 'incident_id'], {
    is: (_id, incident_id) => _id !== undefined && (incident_id == '' || incident_id === undefined),
    then: yup
      .string()
      .min(3, 'Alleged Developer must have at least 3 characters')
      .max(200, "Alleged Developers can't be longer than 200 characters"),
  }),
  deployers: yup.string().when(['_id', 'incident_id'], {
    is: (_id, incident_id) => _id !== undefined && (incident_id == '' || incident_id === undefined),
    then: yup
      .string()
      .min(3, 'Alleged Deployers must have at least 3 characters')
      .max(200, "Alleged Deployers can't be longer than 200 characters"),
  }),
  harmed_parties: yup.string().when(['_id', 'incident_id'], {
    is: (_id, incident_id) => _id !== undefined && (incident_id == '' || incident_id === undefined),
    then: yup
      .string()
      .min(3, 'Harmed Parties must have at least 3 characters')
      .max(200, "Harmed Parties can't be longer than 200 characters"),
  }),
  authors: yup
    .string()
    .min(3, '*Authors must have at least 3 characters')
    .max(200, "*Authors can't be longer than 200 characters")
    .required('*Author is required. Anonymous or the publication can be entered.'),
  submitters: yup
    .string()
    .max(200, "*Submitter list can't be longer than 200 characters")
    .test(
      'len',
      '*Submitter must have at least 3 characters',
      (val) => val === undefined || val.length == 0 || 3 <= val.length
    ),
  text: yup
    .string()
    .min(80, `*Text must have at least 80 characters`)
    .max(50000, `*Text can’t be longer than 50000 characters`)
    .required('*Text is required'),
  date_published: yup
    .string()
    .matches(dateRegExp, '*Date is not valid, must be `YYYY-MM-DD`')
    .required('*Date published is required'),
  date_downloaded: yup
    .string()
    .matches(dateRegExp, '*Date is not valid, must be `YYYY-MM-DD`')
    .required('*Date downloaded required'),
  url: yup
    .string()
    .url('*Must enter URL in http://www.example.com format')
    .required('*URL required'),
  image_url: yup
    .string()
    .matches(
      /((https?):\/\/)(\S)*$/,
      '*Must enter URL in http://www.example.com/images/preview.png format'
    ),
  incident_id: yup.number().positive().integer('*Must be an incident number or empty'),
  incident_date: yup.date().when('incident_id', {
    is: (incident_id) => incident_id == '' || incident_id === undefined,
    then: yup.date().required('*Incident Date required'),
  }),
  editor_notes: yup.string(),
});

const SubmissionForm = () => {
  const data = useStaticQuery(graphql`
    query SubmissionFormQuery {
      allMongodbAiidprodReports {
        edges {
          node {
            tags
          }
        }
      }
    }
  `);

  const tags = [];

  for (const node of data.allMongodbAiidprodReports.edges) {
    if (node.node.tags) {
      for (const tag of node.node.tags) {
        if (!tags.includes(tag)) {
          tags.push(tag);
        }
      }
    }
  }

  const {
    values,
    errors,
    touched,
    setValues,
    setFieldValue,
    setFieldTouched,
    handleChange,
    handleSubmit,
    handleBlur,
  } = useFormikContext();

  const { t } = useTranslation(['submit']);

  const TextInputGroupProps = { values, errors, touched, handleChange, handleBlur, schema };

  const addToast = useToastContext();

  const [parsingNews, setParsingNews] = useState(false);

  useEffect(() => {
    if (!values['date_downloaded']) {
      setFieldValue('date_downloaded', new Date().toISOString().substr(0, 10));
    }
  }, []);

  const parseNewsUrl = useCallback(
    async (newsUrl) => {
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
          ...values,
          ...news,
          cloudinary_id,
        };

        for (const key of ['authors', 'submitters', 'developers', 'deployers', 'harmed_parties']) {
          if (newValues[key] && !Array.isArray(newValues[key])) {
            newValues[key] = [newValues[key]];
          }
        }

        setValues(newValues);
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
    },
    [values]
  );

  useEffect(() => {
    try {
      const url = new URL(values?.url);

      setFieldValue('source_domain', getSourceDomain(url));
    } catch (e) {
      // eslint-disable-next-line no-empty
    } // just ignore it
  }, [values?.url]);

  useEffect(() => {
    setFieldValue('cloudinary_id', values.image_url ? getCloudinaryPublicID(values.image_url) : '');
  }, [values.image_url]);

  return (
    <div className="bootstrap">
      <Form onSubmit={handleSubmit} className="mx-auto" data-cy="report">
        <TextInputGroup
          name="url"
          label={t('Report Address')}
          placeholder={t('Report URL')}
          addOnComponent={
            <Button
              className="outline-secondary rounded-l-none"
              disabled={!!errors.url || !touched.url || parsingNews}
              onClick={() => parseNewsUrl(values.url)}
              data-cy="fetch-info"
            >
              {!parsingNews ? (
                <Trans ns="submit">Fetch info</Trans>
              ) : (
                <div className="flex gap-2">
                  <Spinner size="sm" />
                  <Trans ns="submit">Fetching...</Trans>
                </div>
              )}
            </Button>
          }
          {...TextInputGroupProps}
          handleChange={(e) => {
            setFieldTouched('url', true);
            TextInputGroupProps.handleChange(e);
          }}
        />
        <RelatedIncidents incident={values} setFieldValue={setFieldValue} columns={['byURL']} />

        <TextInputGroup
          name="title"
          label={t('Title')}
          placeholder={t('Report title')}
          className="mt-3"
          {...TextInputGroupProps}
        />

        <TagsInputGroup
          name="authors"
          label={t('Author(s)')}
          placeholder={t('The author or authors of the report')}
          className="mt-3"
          {...TextInputGroupProps}
        />

        <RelatedIncidents incident={values} setFieldValue={setFieldValue} columns={['byAuthors']} />

        <TagsInputGroup
          name="submitters"
          placeholder={t('Your name as you would like it to appear in the leaderboard')}
          label={t('Submitter(s)')}
          className="mt-3"
          {...TextInputGroupProps}
        />

        <TextInputGroup
          name="date_published"
          label={t('Date Published')}
          type="date"
          placeholder={t('YYYY-MM-DD')}
          className="mt-3"
          {...TextInputGroupProps}
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
          {...TextInputGroupProps}
        />
        <PreviewImageInputGroup
          publicID={values.cloudinary_id}
          name="image_url"
          label={t('Image Address')}
          placeholder={t('Image URL')}
          className="mt-3"
          {...TextInputGroupProps}
        />

        <Form.Group
          className={'mt-3' + (touched['text'] && errors['text'] ? ' is-invalid' : '')}
          data-color-mode="light"
        >
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
        </Form.Group>
        <Form.Control.Feedback type="invalid">
          <Trans ns="validation">{errors['text'] && touched['text'] ? errors['text'] : null}</Trans>
        </Form.Control.Feedback>

        <SemanticallyRelatedIncidents incident={values} setFieldValue={setFieldValue} />

        <Form.Group className="mt-3">
          <Label popover="language" label={t('Language')} />
          <Form.Select
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
          </Form.Select>
        </Form.Group>

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
            {...TextInputGroupProps}
          />
        )}

        <details className="mt-3">
          <summary data-cy="extra-fields">{t('Tell us more...')}</summary>

          <TagsInputGroup name="tags" label={t('Tags')} className="mt-3" {...TextInputGroupProps} />

          {!values.incident_id && (
            <>
              <TextInputGroup
                name="description"
                label={t('Description')}
                as="textarea"
                placeholder={t('Incident Description')}
                rows={3}
                className="mt-3"
                {...TextInputGroupProps}
              />

              <TagsInputGroup
                name="developers"
                label={t('Alleged developer of AI system')}
                placeholder={t('Who created or built the technology involved in the incident?')}
                className="mt-3"
                {...TextInputGroupProps}
              />

              <TagsInputGroup
                name="deployers"
                label={t('Alleged deployer of AI system')}
                placeholder={t('Who employed or was responsible for the technology?')}
                className="mt-3"
                {...TextInputGroupProps}
              />

              <TagsInputGroup
                name="harmed_parties"
                label={t('Alleged harmed or nearly harmed parties')}
                placeholder={t('Who experienced negative impacts?')}
                className="mt-3"
                {...TextInputGroupProps}
              />
            </>
          )}

          <TextInputGroup
            name="editor_notes"
            label={t('Editor Notes')}
            as="textarea"
            placeholder={t('Optional context and notes about the incident')}
            rows={8}
            className="mt-3"
            {...TextInputGroupProps}
          />
        </details>
      </Form>
    </div>
  );
};

export default SubmissionForm;
