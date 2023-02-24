import React, { useCallback, useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Spinner } from 'flowbite-react';
import { useFormikContext } from 'formik';
import * as yup from 'yup';
import TextInputGroup from '../../components/forms/TextInputGroup';
import useToastContext, { SEVERITY } from '../../hooks/useToast';
import { dateRegExp } from '../../utils/date';
import { getCloudinaryPublicID } from '../../utils/cloudinary';
import PreviewImageInputGroup from 'components/forms/PreviewImageInputGroup';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { graphql, useStaticQuery } from 'gatsby';
import Label from './Label';
import Typeahead from './Typeahead';
import { Editor } from '@bytemd/react';
import 'bytemd/dist/index.css';
import getSourceDomain from '../../utils/getSourceDomain';
import supportedLanguages from '../../components/i18n/languages.json';
import { useLocalization } from 'gatsby-theme-i18n';
import { Trans, useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTag,
  faPenNib,
  faMedal,
  faCalendar,
  faImage,
  faLink,
  faLanguage,
  faDownload,
  faNewspaper,
  faAlignLeft,
  faTenge,
} from '@fortawesome/free-solid-svg-icons';
import IncidentsField from 'components/incidents/IncidentsField';
import VariantForm from 'components/variants/VariantForm';

// set in form //
// * title: "title of the report" # (string) The title of the report that is indexed.
// * text: "Long text for the report" # (string) This is the complete text for the report in the MongoDB instance, and a shortened subset in the Algolia index
// * date_downloaded:`2019-07-25` # (Date) Date the report was downloaded.
// * submitters: Array(string) # People that submitted the incident report
// * authors: Array(string) # People that wrote the incident report
// * date_published: `2019-07-25` # (Date or null) The publication date of the report.
// * image_url: "http://si.wsj.net/public/resources/images/BN-IM269_YouTub_P_2015051817" # (string) The URL for the image that is indexed. This will be stored on the server as a hash of the URL.
// * url: "https://blogs.wsj.com/digits/2015/05/19/googles-youtube-kids-app-criti" # The fully qualified URL to the report as hosted on the web.

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
  authors: yup
    .string()
    .min(3, '*Authors must have at least 3 characters')
    .max(200, "*Authors can't be longer than 200 characters")
    .required('*Author is required. Anonymous or the publication can be entered.'),
  submitters: yup
    .string()
    .min(3, '*Submitter must have at least 3 characters')
    .max(200, "*Submitter list can't be longer than 200 characters")
    .required('*Submitter is required. Anonymous can be entered.'),
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
  editor_notes: yup.string().nullable(),
  incident_ids: yup.array().of(yup.number().positive()),
  is_incident_report: yup.boolean().required(),
  text_inputs: yup.string().nullable(),
  text_outputs: yup.string().nullable(),
});

const IncidentReportForm = () => {
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldTouched,
    setFieldValue,
    setValues,
  } = useFormikContext();

  const { t } = useTranslation(['submit']);

  const data = useStaticQuery(graphql`
    query IncidentReportFormQuery {
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

  const TextInputGroupProps = { values, errors, touched, handleChange, handleBlur, schema };

  const addToast = useToastContext();

  const [parsingNews, setParsingNews] = useState(false);

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

  useEffect(() => {
    Object.keys(errors).map((key) => {
      setFieldTouched(key, true);
    });
  }, [errors]);

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
          error: e,
        });
      }

      setParsingNews(false);
    },
    [values]
  );

  const { config } = useLocalization();

  return (
    <div>
      <Form
        onSubmit={(event) => {
          event.preventDefault();
        }}
        className="mx-auto"
        data-cy="report"
      >
        <TextInputGroup
          name="url"
          label={t('Report Address')}
          placeholder={t('Report URL')}
          icon={faLink}
          addOnComponent={
            <Button
              className="outline-secondary whitespace-nowrap"
              disabled={!!errors.url || !values?.url || parsingNews}
              onClick={() => parseNewsUrl(values.url)}
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

        <TextInputGroup
          name="title"
          label="Title"
          icon={faTenge}
          placeholder="Report title"
          className="mt-3"
          {...TextInputGroupProps}
        />
        <TextInputGroup
          name="authors"
          label="Author CSV"
          icon={faPenNib}
          placeholder="Author CSV"
          className="mt-3"
          {...TextInputGroupProps}
        />
        <TextInputGroup
          name="submitters"
          label="Submitter CSV"
          icon={faMedal}
          placeholder="Submitter CSV"
          className="mt-3"
          {...TextInputGroupProps}
        />
        <TextInputGroup
          name="date_published"
          label="Date Published"
          icon={faCalendar}
          type="date"
          placeholder="YYYY-MM-DD"
          className="mt-3"
          {...TextInputGroupProps}
        />
        <TextInputGroup
          name="date_downloaded"
          label="Date Downloaded"
          icon={faDownload}
          type="date"
          placeholder="YYYY-MM-DD"
          className="mt-3"
          {...TextInputGroupProps}
        />
        <PreviewImageInputGroup
          cloudinary_id={values.cloudinary_id}
          name="image_url"
          label="Image Address"
          icon={faImage}
          placeholder="Image URL"
          className="mt-3"
          {...TextInputGroupProps}
        />

        <Form.Group
          className={'mt-3' + (touched['text'] && errors['text'] ? ' is-invalid' : '')}
          data-color-mode="light"
          data-cy="text"
        >
          <div className="flex items-center">
            <FontAwesomeIcon
              fixedWidth
              icon={faNewspaper}
              title={t('Text')}
              className="mb-2 mr-1"
            />
            <Label popover="text" label={t('Text')} />
          </div>
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

        <Form.Group className="mt-3">
          <div className="flex items-center">
            <FontAwesomeIcon
              fixedWidth
              icon={faLanguage}
              title={t('Language')}
              className="mb-2 mr-1"
            />
            <Label popover="language" label={t('Language')} />
          </div>
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
          <div className="flex items-center">
            <FontAwesomeIcon fixedWidth icon={faTag} title={t('Tags')} className="mb-2 mr-1" />
            <Label popover="tags" label={t('Tags')} />
          </div>
          <div className="bootstrap">
            <Typeahead
              id="submit-report-tags"
              inputProps={{ id: 'submit-report-tags-input' }}
              allowNew
              multiple
              onBlur={handleBlur}
              onChange={(value) => {
                setFieldTouched('tags', true);
                setFieldValue(
                  'tags',
                  value.map((v) => (v.label ? v.label : v))
                );
              }}
              selected={values.tags}
              options={tags}
              placeholder="Choose several tags..."
            />
          </div>
        </Form.Group>

        <div className="mt-3 bootstrap">
          <Label popover={'incident_ids'} label="Incident IDs" />
          <IncidentsField id="incident_ids" name="incident_ids" />
        </div>

        <TextInputGroup
          name="editor_notes"
          label="Editor Notes"
          icon={faAlignLeft}
          type="textarea"
          as="textarea"
          rows={8}
          className="mt-3"
          {...TextInputGroupProps}
        />

        <h4 className="mt-3">Translations</h4>

        {config
          .filter((c) => c.code !== values.language)
          .map((c) => {
            const name = `translations_${c.code}`;

            return (
              <div className="mt-5" key={name} data-cy={`translation-${c.code}`}>
                <h5>{c.name}</h5>

                <Form.Group className="mt-3">
                  <div className="flex items-center">
                    <FontAwesomeIcon
                      fixedWidth
                      icon={faTenge}
                      title={t('Title')}
                      className="mb-2 mr-1"
                    />
                    <Label label={t('Title')} />
                  </div>
                  <Form.Control
                    type="text"
                    value={values[name].title}
                    onChange={(e) => setFieldValue(`${name}.title`, e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mt-3">
                  <div className="flex items-center">
                    <FontAwesomeIcon
                      fixedWidth
                      icon={faNewspaper}
                      title={t('Text')}
                      className="mb-2 mr-1"
                    />
                    <Label label={t('Text')} />
                  </div>
                  <Editor
                    value={values[name].text}
                    onChange={(value) => setFieldValue(`${name}.text`, value)}
                  />
                </Form.Group>
              </div>
            );
          })}

        <h4 className="mt-3">Variant fields</h4>

        <div className="mt-3">
          <VariantForm />
        </div>
      </Form>
    </div>
  );
};

export default IncidentReportForm;
