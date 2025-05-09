import React, { useCallback, useEffect, useState } from 'react';
import { Form, useFormikContext } from 'formik';
import TextInputGroup from '../../components/forms/TextInputGroup';
import TagsInputGroup from '../../components/forms/TagsInputGroup';
import PreviewImageInputGroup from '../../components/forms/PreviewImageInputGroup';
import useToastContext, { SEVERITY } from '../../hooks/useToast';
import { getCloudinaryPublicID } from '../../utils/cloudinary';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import Label from '../forms/Label';
import getSourceDomain from '../../utils/getSourceDomain';
import { Editor } from '@bytemd/react';
import 'bytemd/dist/index.css';
import supportedLanguages from '../../components/i18n/languages.json';
import { Trans, useTranslation } from 'react-i18next';
import RelatedIncidents from '../../components/RelatedIncidents';
import SemanticallyRelatedIncidents from '../../components/SemanticallyRelatedIncidents';
import { schema } from './schemas';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHandPointRight,
  faCode,
  faBolt,
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
  faStickyNote,
  faTenge,
  faGear,
} from '@fortawesome/free-solid-svg-icons';
import FlowbiteSearchInput from 'components/forms/FlowbiteSearchInput';
import { Checkbox, Select } from 'flowbite-react';
import IncidentsField from 'components/incidents/IncidentsField';
import { graphql, useStaticQuery } from 'gatsby';

const SubmissionForm = ({ onChange = null, promoType = null }) => {
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

        for (const key of [
          'authors',
          'submitters',
          'developers',
          'deployers',
          'harmed_parties',
          'implicated_systems',
        ]) {
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
          error: e,
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

  useEffect(() => {
    if (values._id) {
      // Only display form errors on Edit mode
      Object.keys(errors).map((key) => {
        setFieldTouched(key, true);
      });
    }
  }, [errors]);

  const staticQueryData = useStaticQuery(graphql`
    query SubmittedFormQuery {
      allMongodbAiidprodEntities {
        nodes {
          name
        }
      }
    }
  `);

  const entityNames = staticQueryData.allMongodbAiidprodEntities.nodes
    .map((node) => node.name)
    .sort();

  return (
    <div>
      <Form onSubmit={handleSubmit} className="mx-auto" data-cy="report" onChange={onChange}>
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
            TextInputGroupProps.handleChange(e);
          }}
          btnClick={() => parseNewsUrl(values.url)}
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

        <TextInputGroup
          name="title"
          label={t('Title')}
          icon={faTenge}
          placeholder={t('Report title')}
          className="mt-3"
          {...TextInputGroupProps}
        />

        <TagsInputGroup
          name="authors"
          label={t('Author(s)')}
          icon={faPenNib}
          placeholder={t('The author or authors of the report')}
          className="mt-3"
          {...TextInputGroupProps}
        />

        <RelatedIncidents
          incident={values}
          setFieldValue={setFieldValue}
          columns={['byAuthors']}
          triggerSearch={values['authors']?.length}
        />

        <TagsInputGroup
          name="submitters"
          placeholder={t("Enter your name for the leaderboard or leave blank for 'Anonymous'.")}
          label={t('Submitter(s)')}
          icon={faMedal}
          className="mt-3"
          data-cy="submitters-input"
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

        <RelatedIncidents
          incident={values}
          setFieldValue={setFieldValue}
          columns={['byDatePublished']}
          triggerSearch={values['date_published']?.length}
        />

        <TextInputGroup
          name="date_downloaded"
          label={t('Date Downloaded')}
          icon={faDownload}
          type="date"
          placeholder={t('YYYY-MM-DD')}
          className="mt-3"
          {...TextInputGroupProps}
        />

        <PreviewImageInputGroup
          cloudinary_id={values.cloudinary_id}
          name="image_url"
          label={t('Image Address')}
          icon={faImage}
          placeholder={t('Image URL')}
          className="mt-3"
          {...TextInputGroupProps}
        />

        <div
          className={'mt-3' + (touched['text'] && errors['text'] ? ' is-invalid' : '')}
          data-color-mode="light"
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
        </div>

        <SemanticallyRelatedIncidents incident={values} setFieldValue={setFieldValue} />

        <div className="mt-3">
          <div className="flex items-center">
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

        <TagsInputGroup
          name="tags"
          label={t('Tags')}
          icon={faTag}
          className="mt-3"
          placeholder={t('Tags')}
          {...TextInputGroupProps}
        />

        <div>
          <div className="flex items-center">
            <Label popover="incident_id" label={t('Incident IDs')} />
          </div>
          <div className="mt-1">
            <IncidentsField
              name="incident_ids"
              id={'incident_ids'}
              placeHolder={t('Leave empty to report a new incident')}
            />
          </div>
        </div>

        <RelatedIncidents
          incident={values}
          setFieldValue={setFieldValue}
          columns={['byIncidentId']}
          triggerSearch={values['incident_ids']?.length}
        />

        <div className="mt-3">
          <div className="flex items-center">
            <Label popover="quiet" label={t('Quiet')} />
          </div>
          <div className="mt-1">
            <Checkbox
              checked={values.quiet}
              onChange={(e) => {
                setFieldValue('quiet', e.target.checked);
              }}
            />
          </div>
        </div>

        {(!values.incident_ids || values.incident_ids.length === 0) &&
          promoType?.toLowerCase() !== 'issue' && (
            <div data-cy="incident-data-section">
              <hr className="my-4" />
              <h3 className="text-lg">Incident Data</h3>
              <TextInputGroup
                name="incident_title"
                label={t('Incident Title')}
                icon={faTenge}
                placeholder={t('Incident title')}
                className="mt-3"
                {...TextInputGroupProps}
              />
              <TextInputGroup
                name="incident_date"
                label={t('Incident Date')}
                icon={faCalendar}
                placeholder={t('Incident Date')}
                type="date"
                className="mt-3"
                disabled={values.incident_id}
                {...TextInputGroupProps}
              />
              <TextInputGroup
                name="description"
                label={t('Description')}
                icon={faAlignLeft}
                type="textarea"
                placeholder={t('Incident Description')}
                rows={3}
                className="mt-3"
                {...TextInputGroupProps}
              />
              <TagsInputGroup
                name="developers"
                label={t('Alleged developer of AI system')}
                icon={faCode}
                placeholder={t('Who created or built the technology involved in the incident?')}
                className="mt-3"
                options={entityNames}
                {...TextInputGroupProps}
              />

              <TagsInputGroup
                name="deployers"
                label={t('Alleged deployer of AI system')}
                icon={faHandPointRight}
                placeholder={t('Who employed or was responsible for the technology?')}
                className="mt-3"
                options={entityNames}
                {...TextInputGroupProps}
              />

              <TagsInputGroup
                name="harmed_parties"
                label={t('Alleged harmed or nearly harmed parties')}
                icon={faBolt}
                placeholder={t('Who experienced negative impacts?')}
                className="mt-3"
                options={entityNames}
                {...TextInputGroupProps}
              />

              <TagsInputGroup
                name="implicated_systems"
                label={t('Alleged implicated AI systems')}
                icon={faGear}
                placeholder={t('Which AI systems were involved?')}
                className="mt-3"
                options={entityNames}
                {...TextInputGroupProps}
              />
              <hr />
            </div>
          )}

        <TextInputGroup
          name="editor_notes"
          label={t('Editor Notes')}
          icon={faStickyNote}
          as="textarea"
          placeholder={t('Optional context and notes about the incident')}
          rows={8}
          className="mt-3"
          {...TextInputGroupProps}
        />
      </Form>
    </div>
  );
};

export default SubmissionForm;
