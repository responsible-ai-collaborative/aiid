import React, { useEffect, useRef, useState } from 'react';
import { CSVReader } from 'react-papaparse';
import {
  useQueryParams,
  StringParam,
  ArrayParam,
  encodeDate,
  withDefault,
  NumericArrayParam,
} from 'use-query-params';
import Link from 'components/ui/Link';
import { useUserContext } from 'contexts/UserContext';
import useToastContext, { SEVERITY } from '../../hooks/useToast';
import { format, parse, getUnixTime } from 'date-fns';
import { useMutation, useQuery } from '@apollo/client';
import { FIND_SUBMISSIONS, INSERT_SUBMISSION } from '../../graphql/submissions';
import { UPSERT_ENTITY } from '../../graphql/entities';
import isString from 'lodash/isString';
import { stripMarkdown } from 'utils/typography';
import { Trans, useTranslation } from 'react-i18next';
import { useLocalization } from 'plugins/gatsby-theme-i18n';
import useLocalizePath from 'components/i18n/useLocalizePath';
import { graphql, useStaticQuery } from 'gatsby';
import { processEntities, RESPONSE_TAG } from '../../utils/entities';
import SubmissionWizard from '../submissions/SubmissionWizard';
import getSourceDomain from 'utils/getSourceDomain';
import { Helmet } from 'react-helmet';
import { Button } from 'flowbite-react';
import { getCloudinaryPublicID } from 'utils/cloudinary';
import { SUBMISSION_INITIAL_VALUES } from 'utils/submit';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faSpinner } from '@fortawesome/free-solid-svg-icons';

const CustomDateParam = {
  encode: encodeDate,
  decode: (value) => {
    const result = parse(value, 'yyyy-MM-dd', new Date());

    if (result.toString() == 'Invalid Date') {
      return undefined;
    }

    return value;
  },
};

const queryConfig = {
  url: withDefault(StringParam, ''),
  title: withDefault(StringParam, ''),
  authors: withDefault(ArrayParam, []),
  submitters: withDefault(ArrayParam, []),
  incident_date: withDefault(CustomDateParam, ''),
  date_published: withDefault(CustomDateParam, ''),
  date_downloaded: withDefault(CustomDateParam, ''),
  image_url: withDefault(StringParam, ''),
  incident_ids: withDefault(NumericArrayParam, []),
  text: withDefault(StringParam, ''),
  editor_notes: withDefault(StringParam, ''),
  tags: withDefault(ArrayParam, []),
  incident_editors: withDefault(ArrayParam, []),
  language: withDefault(StringParam, 'en'),
};

const SubmitForm = () => {
  const { isRole, loading, user } = useUserContext();

  const [query] = useQueryParams(queryConfig);

  const [isIncidentResponse, setIsIncidentResponse] = useState(false);

  const isClient = typeof window !== 'undefined';

  const [submission, setSubmission] = useState({});

  const [submissionReset, setSubmissionReset] = useState({ reset: false, forceUpdate: false });

  const [savingInLocalStorage, setSavingInLocalStorage] = useState(false);

  const {
    entities: { nodes: allEntities },
  } = useStaticQuery(graphql`
    {
      entities: allMongodbAiidprodEntities {
        nodes {
          entity_id
          name
        }
      }
    }
  `);

  useEffect(() => {
    let submission = { ...query, cloudinary_id: '' };

    if (submission.tags && submission.tags.includes(RESPONSE_TAG)) {
      setIsIncidentResponse(true);
    }

    if (submission.image_url) {
      submission.cloudinary_id = getCloudinaryPublicID(submission.image_url);
    }

    if (
      isEqual(submission, SUBMISSION_INITIAL_VALUES) &&
      isClient &&
      localStorage.getItem('formValues')
    ) {
      submission = {
        ...SUBMISSION_INITIAL_VALUES,
        ...JSON.parse(localStorage.getItem('formValues')),
      };
    }

    if (!loading && user) {
      submission.user = { link: user.id };

      if (user.first_name && user.last_name) {
        submission.submitters = [`${user.first_name} ${user.last_name}`];
      }
    }
    setSubmission(submission);
  }, [loading, user?.profile]);

  const [displayCsvSection] = useState(false);

  const [csvData, setCsvData] = useState([]);

  const [csvIndex, setCsvIndex] = useState(0);

  const addToast = useToastContext();

  const { i18n, t } = useTranslation(['submit']);

  const { locale } = useLocalization();

  // See https://github.com/apollographql/apollo-client/issues/5419
  useQuery(FIND_SUBMISSIONS);

  const [insertSubmission] = useMutation(INSERT_SUBMISSION, { refetchQueries: [FIND_SUBMISSIONS] });

  const [createEntityMutation] = useMutation(UPSERT_ENTITY);

  useEffect(() => {
    if (csvData[csvIndex]) {
      setSubmission(csvData[csvIndex]);
    }
  }, [csvIndex, csvData]);

  const handleCSVError = (_err, _file, _inputElem, reason) => {
    addToast({
      message: t(`Unable to upload: `) + reason,
      severity: SEVERITY.danger,
      error: _err,
    });
  };

  const previousRecord = () => {
    setCsvIndex(Math.max(0, csvIndex - 1));
  };

  const nextRecord = () => {
    setCsvIndex(Math.min(csvData.length - 1, csvIndex + 1));
  };

  const localizePath = useLocalizePath();

  const handleSubmit = async (values) => {
    try {
      const now = new Date();

      const date_submitted = format(now, 'yyyy-MM-dd');

      const url = new URL(values?.url);

      const source_domain = getSourceDomain(url);

      delete values.is_incident_report;

      const submission = {
        ...values,
        source_domain,
        date_submitted,
        date_modified: date_submitted,
        epoch_date_modified: getUnixTime(now),
        authors: isString(values.authors) ? values.authors.split(',') : values.authors,
        submitters: values.submitters.length ? values.submitters : ['Anonymous'],
        plain_text: await stripMarkdown(values.text),
        embedding: values.embedding || undefined,
        incident_editors: { link: values.incident_editors },
      };

      submission.deployers = await processEntities(
        allEntities,
        values.deployers,
        createEntityMutation
      );

      submission.developers = await processEntities(
        allEntities,
        values.developers,
        createEntityMutation
      );

      submission.harmed_parties = await processEntities(
        allEntities,
        values.harmed_parties,
        createEntityMutation
      );

      submission.implicated_systems = await processEntities(
        allEntities,
        values.implicated_systems,
        createEntityMutation
      );

      await insertSubmission({ variables: { data: submission } });

      addToast({
        message: (
          <Trans i18n={i18n} ns="submit">
            Report successfully added to review queue. You can see your submission{' '}
            <Link to={localizePath({ path: '/apps/submitted', language: locale })}>here</Link>.
          </Trans>
        ),
        severity: SEVERITY.success,
      });

      clearForm();
    } catch (e) {
      addToast({
        message: (
          <Trans i18n={i18n} ns="submit">
            Was not able to create the report, please review the form and try again.
          </Trans>
        ),
        severity: SEVERITY.warning,
        error: e,
      });
    }
  };

  const clearForm = () => {
    const submission = { ...SUBMISSION_INITIAL_VALUES };

    if (user) {
      submission.user = { link: user.id };

      if (user.first_name && user.last_name) {
        submission.submitters = [`${user.first_name} ${user.last_name}`];
      }
    }
    setSubmission(submission);
    setSubmissionReset((prevState) => ({
      ...prevState,
      reset: true,
      forceUpdate: !prevState.forceUpdate, // toggle forceUpdate value
    }));
    localStorage.setItem('formValues', JSON.stringify(submission));
  };

  const submissionRef = useRef(null);

  if (!submission || isEmpty(submission)) return <></>;

  return (
    <>
      <Helmet>
        <title>{t(isIncidentResponse ? 'New Incident Response' : 'New Incident Report')}</title>
      </Helmet>
      <div className={'titleWrapper flex flex-row justify-between'}>
        <h1 data-cy="submit-form-title">
          <Trans ns="submit">
            {isIncidentResponse ? 'New Incident Response' : 'New Incident Report'}
          </Trans>
        </h1>
        <div className="flex items-center justify-center mt-2">
          <span className="text-gray-400 text-sm">
            {savingInLocalStorage ? (
              <>
                <FontAwesomeIcon icon={faSpinner} className="mr-1" />{' '}
                <Trans ns="submit">Saving as draft...</Trans>
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faCheck} className="mr-1" />
                <Trans ns="submit">Draft saved</Trans>
              </>
            )}
          </span>
          <Button
            color="gray"
            size={'xs'}
            className={'ml-2'}
            onClick={() => clearForm()}
            data-cy="clear-form"
          >
            <Trans i18n={i18n} ns="submit">
              Clear Form
            </Trans>
          </Button>
        </div>
      </div>
      <p ref={submissionRef}>
        {isIncidentResponse ? (
          <>
            {submission.incident_ids.length > 0 ? (
              <Trans ns="submit" i18nKey={'submitFormResponseDescription1'}>
                The following form will create a new incident response {}for incident{' '}
                <Link to={`/cite/${submission.incident_ids[0]}`}>
                  #{{ incident_id: submission.incident_ids[0] }}
                </Link>{' '}
                for <Link to="/apps/submitted">review</Link> and inclusion into the AI Incident
                Database.
              </Trans>
            ) : (
              <Trans ns="submit" i18nKey={'submitFormResponseDescription2'}>
                The following form will create a new incident response for{' '}
                <Link to="/apps/submitted">review</Link> and inclusion into the AI Incident
                Database.
              </Trans>
            )}{' '}
            <Trans ns="submit" i18nKey={'submitFormResponseDescription3'}>
              Fields beginning with an asterisk (*) are required. Please carefully check your
              entries for content issues (e.g., accidental copy and paste of advertisements). For
              details on the database ingestion process, please check the{' '}
              <Link to="/research/1-criteria/">research pages</Link> or{' '}
              <Link to="/contact">contact us with questions</Link>.
            </Trans>
          </>
        ) : (
          <Trans ns="submit" i18nKey={'submitFormDescription'}>
            The following form will create a new incident report for{' '}
            <Link to="/apps/submitted">review</Link> and inclusion into the AI Incident Database.
            Fields beginning with an asterisk (*) are required. Please carefully check your entries
            for content issues (e.g., accidental copy and paste of advertisements). For details on
            the database ingestion process, please check the{' '}
            <Link to="/research/1-criteria/">research pages</Link> or{' '}
            <Link to="/contact">contact us with questions</Link>.
          </Trans>
        )}
      </p>

      <div className="my-5">
        {submission && (
          <SubmissionWizard
            submitForm={handleSubmit}
            initialValues={submission}
            urlFromQueryString={query.url}
            submissionReset={submissionReset}
            setSavingInLocalStorage={setSavingInLocalStorage}
            scrollToTop={() => {
              setTimeout(() => {
                // This is needed to make it work in Firefox
                submissionRef.current.scrollIntoView();
              }, 0);
            }}
            clearForm={clearForm}
          />
        )}

        <p className="mt-4">
          <Trans ns="submit" i18nKey="submitReviewDescription">
            Submitted reports are added to a{' '}
            <Link locale={locale} to="/apps/submitted">
              review queue{' '}
            </Link>{' '}
            to be resolved to a new or existing incident record. Incidents are reviewed and merged
            into the database after enough incidents are pending.
          </Trans>
        </p>

        {!loading && isRole('submitter') && displayCsvSection && (
          <div className="mt-5 p-0">
            <h2>
              <Trans ns="submit">Advanced: Add by CSV</Trans>
            </h2>
            <p>
              <Trans ns="submit" i18nKey="CSVDescription">
                The header row of the file is assumed to match the names of the inputs in the form.
                Each row will be processed, one at a time, so that it flows through the form
                validations before submitting.
              </Trans>
            </p>
            <p>
              Record {csvIndex + 1} of {csvData.length}
            </p>
            <div className="flex justify-center my-3 gap-4">
              <Button className="me-4" onClick={previousRecord}>
                &lt; <Trans>Previous</Trans>
              </Button>
              <Button onClick={nextRecord}>
                <Trans>Next</Trans> &gt;
              </Button>
            </div>
            <CSVReader
              onDrop={(data) => {
                setCsvData(data);
                addToast({
                  message: 'File uploaded',
                  severity: SEVERITY.info,
                });
              }}
              onError={handleCSVError}
              config={{ header: true }}
              noDrag
              addRemoveButton
            >
              <span>
                <Trans>Click to upload</Trans>
              </span>
            </CSVReader>
          </div>
        )}
      </div>
    </>
  );
};

export default SubmitForm;
