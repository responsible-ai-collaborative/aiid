import React, { useCallback, useEffect, useState } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';
import { useFormikContext } from 'formik';
import * as yup from 'yup';
import TextInputGroup from 'components/forms/TextInputGroup';
import useToastContext, { SEVERITY } from '../../hooks/useToast';
import { dateRegExp } from 'utils/date';
import { getCloudinaryPublicID, PreviewImageInputGroup } from 'utils/cloudinary';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { graphql, useStaticQuery } from 'gatsby';
import * as POP_OVERS from '../ui/PopOvers';
import Label from '../forms/Label';
import TagsControl from 'components/forms/TagsControl';
import IncidentIdField from 'components/incidents/IncidentIdField';
import getSourceDomain from '../../utils/getSourceDomain';
import { Editor } from '@bytemd/react';
import 'bytemd/dist/index.css';
import supportedLanguages from 'components/i18n/languages.json';

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
// * ref_number: 25 # (int) The reference number scoped to the incident ID.
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
  authors: yup
    .string()
    .min(3, '*Authors must have at least 3 characters')
    .max(200, "*Authors can't be longer than 200 characters")
    .required('*Author is required. Anonymous or the publication can be entered.'),
  submitters: yup
    .string()
    .min(3, '*Submitter must have at least 3 characters')
    .max(200, "*Submitter list can't be longer than 200 characters"),
  text: yup
    .string()
    .min(80, '*Text must have at least 80 characters')
    .max(50000, "*Text can't be longer than 50000 characters")
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

  const TextInputGroupProps = { values, errors, touched, handleChange, handleBlur };

  const addToast = useToastContext();

  const [parsingNews, setParsingNews] = useState(false);

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
          message: <>Please verify all information programmatically pulled from the report</>,
          severity: SEVERITY.info,
        });

        const cloudinary_id = getCloudinaryPublicID(news.image_url);

        setValues({
          ...values,
          ...news,
          cloudinary_id,
        });
      } catch (e) {
        const message =
          e.message == 'Parser error'
            ? `Error fetching news. Scraping was blocked by ${newsUrl}, Please enter the text manually.`
            : `Error reaching news info endpoint, please try again in a few seconds.`;

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
    <>
      <Form onSubmit={handleSubmit} className="mx-auto" data-cy="report">
        <TextInputGroup
          name="url"
          label="Report Address"
          placeholder="Report URL"
          addOnComponent={
            <Button
              className="outline-secondary"
              disabled={!!errors.url || !touched.url || parsingNews}
              onClick={() => parseNewsUrl(values.url)}
            >
              {' '}
              {!parsingNews ? (
                <>Fetch info</>
              ) : (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />{' '}
                  Fetching...
                </>
              )}
            </Button>
          }
          {...TextInputGroupProps}
          handleChange={(e) => {
            setFieldTouched('url', true);
            TextInputGroupProps.handleChange(e);
          }}
        />

        <TextInputGroup
          name="title"
          label="Title"
          placeholder="Report title"
          className="mt-3"
          {...TextInputGroupProps}
        />
        <TextInputGroup
          name="authors"
          label="Author CSV"
          placeholder="Author CSV"
          className="mt-3"
          {...TextInputGroupProps}
        />
        <TextInputGroup
          name="submitters"
          label="Submitter CSV"
          placeholder="Submitter CSV"
          className="mt-3"
          {...TextInputGroupProps}
        />
        <TextInputGroup
          name="date_published"
          label="Date Published"
          type="date"
          placeholder="YYYY-MM-DD"
          className="mt-3"
          {...TextInputGroupProps}
        />
        <TextInputGroup
          name="date_downloaded"
          label="Date Downloaded"
          type="date"
          placeholder="YYYY-MM-DD"
          className="mt-3"
          {...TextInputGroupProps}
        />
        <PreviewImageInputGroup
          publicID={values.cloudinary_id}
          name="image_url"
          label="Image Address"
          placeholder="Image URL"
          className="mt-3"
          {...TextInputGroupProps}
        />

        <Form.Group className="mt-3" data-color-mode="light">
          <Label popover={POP_OVERS.text} label={'Text'} />
          <Editor value={values.text} onChange={(value) => setFieldValue('text', value)} />
        </Form.Group>

        <Form.Group className="mt-3">
          <Label popover={POP_OVERS['language']} label={'Language'} />
          <Form.Select
            name="language"
            placeholder="Report Language"
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

        <Form.Group className="mt-3">
          <Label popover={POP_OVERS['language']} label={'Tags'} />
          <TagsControl name={'tags'} />
        </Form.Group>

        <IncidentIdField
          name="incident_id"
          className="mt-3"
          placeHolder="Leave empty to report a new incident"
          showIncidentData={false}
        />

        {!values.incident_id && (
          <TextInputGroup
            name="incident_date"
            label="Incident Date"
            placeholder="Incident Date"
            type="date"
            className="mt-3"
            disabled={values.incident_id}
            {...TextInputGroupProps}
          />
        )}

        <TextInputGroup
          name="editor_notes"
          label="Editor Notes"
          as="textarea"
          placeholder="Optional context and notes about the incident"
          rows={8}
          className="mt-3"
          {...TextInputGroupProps}
        />
      </Form>
    </>
  );
};

export default SubmissionForm;
