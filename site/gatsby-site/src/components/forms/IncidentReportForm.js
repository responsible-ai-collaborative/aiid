import React, { useCallback, useEffect, useState } from 'react';
import { Checkbox, Select } from 'flowbite-react';
import { Form, useFormikContext } from 'formik';
import * as yup from 'yup';
import TextInputGroup from '../../components/forms/TextInputGroup';
import useToastContext, { SEVERITY } from '../../hooks/useToast';
import { dateTimeRegExp } from '../../utils/date';
import { getCloudinaryPublicID } from '../../utils/cloudinary';
import PreviewImageInputGroup from 'components/forms/PreviewImageInputGroup';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { graphql, useStaticQuery } from 'gatsby';
import Label from './Label';
import { Editor } from '@bytemd/react';
import 'bytemd/dist/index.css';
import getSourceDomain from '../../utils/getSourceDomain';
import supportedLanguages from '../../components/i18n/languages.json';
import { useLocalization } from 'plugins/gatsby-theme-i18n';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTag,
  faPenNib,
  faMedal,
  faImage,
  faLink,
  faLanguage,
  faDownload,
  faNewspaper,
  faAlignLeft,
  faTenge,
  faCalendar,
} from '@fortawesome/free-solid-svg-icons';
import IncidentsField from 'components/incidents/IncidentsField';
import VariantForm from 'components/variants/VariantForm';
import { Typeahead } from 'react-bootstrap-typeahead';
import FlowbiteSearchInput from './FlowbiteSearchInput';

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
    .matches(dateTimeRegExp, '*Date is not valid, must be `YYYY-MM-DD`')
    .required('*Date published is required'),
  date_downloaded: yup
    .string()
    .matches(dateTimeRegExp, '*Date is not valid, must be `YYYY-MM-DD`')
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
  cloudinary_id: yup.string().nullable(),
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
    if (values?.date_published) {
      const publishedDate = new Date(values.date_published);

      const formattedDate = publishedDate.toISOString().split('T')[0];

      setFieldValue('date_published', formattedDate);
    }

    if (values?.date_downloaded) {
      const publishedDate = new Date(values.date_downloaded);

      const formattedDate = publishedDate.toISOString().split('T')[0];

      setFieldValue('date_downloaded', formattedDate);
    }
  }, [values?.date_published, values?.date_downloaded]);

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
        <div>
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
            btnClick={() => parseNewsUrl(values.url)}
            loading={parsingNews}
            btnDisabled={!!errors.url || !values?.url || parsingNews}
            btnText={t('Fetch info')}
            handleChange={(e) => {
              setFieldTouched('url', true);
              TextInputGroupProps.handleChange(e);
            }}
          />
        </div>

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
          label={t('Date Published')}
          type="date"
          placeholder={t('YYYY-MM-DD')}
          className="mt-3"
          icon={faCalendar}
          {...TextInputGroupProps}
        />

        <TextInputGroup
          name="date_downloaded"
          label={t('Date Downloaded')}
          type="date"
          placeholder={t('YYYY-MM-DD')}
          className="mt-3"
          icon={faDownload}
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

        <div
          className={'mt-3' + (touched['text'] && errors['text'] ? ' is-invalid' : '')}
          data-color-mode="light"
          data-cy="text"
        >
          <div className="flex items-center mb-2">
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
        </div>

        <div className="mt-3">
          <div className="flex items-center mb-2">
            <FontAwesomeIcon
              fixedWidth
              icon={faLanguage}
              title={t('Language')}
              className="mb-2 mr-1"
            />
            <Label popover="language" label={t('Language')} />
          </div>
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
        </div>

        <div className="mt-3">
          <div className="flex items-center mb-2">
            <FontAwesomeIcon fixedWidth icon={faTag} title={t('Tags')} className="mb-2 mr-1" />
            <Label popover="tags" label={t('Tags')} />
          </div>
          <div>
            <Typeahead
              className="Typeahead submit-report-tags"
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
        </div>

        <div className="flex flex-col mt-3">
          <Label popover={'incident_ids'} label="Incident IDs" />
          <IncidentsField id="incident_ids" name="incident_ids" />
        </div>

        <TextInputGroup
          name="editor_notes"
          label={t('Editor Notes')}
          placeholder={t('Editor Notes')}
          icon={faAlignLeft}
          type="textarea"
          as="textarea"
          rows={8}
          className="mt-3"
          {...TextInputGroupProps}
        />

        <div className="mt-3">
          <div className="flex items-center">
            <Label popover="quiet" label={t('Quiet')} />
          </div>
          <div className="mt-1">
            <Checkbox
              name="quiet"
              checked={values.quiet}
              onChange={(e) => {
                setFieldValue('quiet', e.target.checked);
              }}
            />
          </div>
        </div>

        <h4 className="mt-3">Translations</h4>

        {config
          .filter((c) => c.code !== values.language)
          .map((c) => {
            const name = `translations_${c.code}`;

            return (
              <div className="mt-5" key={name} data-cy={`translation-${c.code}`}>
                <h5>{c.name}</h5>

                <div className="mt-3">
                  <div className="flex items-center">
                    <FontAwesomeIcon
                      fixedWidth
                      icon={faTenge}
                      title={t('Title')}
                      className="mb-2 mr-1"
                    />
                    <Label label={t('Title')} />
                  </div>
                  <input
                    type="text"
                    value={values[name].title}
                    onChange={(e) => setFieldValue(`${name}.title`, e.target.value)}
                    className={`bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white ${
                      errors && touched && touched[`${name}.title`] && errors[`${name}.title`]
                        ? 'border-red-600 focus:ring-red-500'
                        : 'border-gray-300 dark:border-gray-600 dark:focus:border-blue-500 focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-500'
                    }`}
                  />
                </div>

                <div className="mt-3">
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
                </div>
              </div>
            );
          })}

        <h4 className="mt-3">Variant fields</h4>

        <div className="mt-3">
          <VariantForm allFieldsForm={false} />
        </div>
      </Form>
    </div>
  );
};

export default IncidentReportForm;
