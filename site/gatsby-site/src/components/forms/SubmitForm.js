import React, { useEffect, useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import { CSVReader } from 'react-papaparse';
import { useQueryParams, StringParam, ArrayParam, encodeDate, withDefault } from 'use-query-params';
import Link from 'components/ui/Link';
import { useUserContext } from 'contexts/userContext';
import useToastContext, { SEVERITY } from '../../hooks/useToast';
import { format, parse } from 'date-fns';
import { useMutation, useQuery } from '@apollo/client';
import { FIND_SUBMISSIONS, INSERT_SUBMISSION } from '../../graphql/submissions';
import { UPSERT_ENTITY } from '../../graphql/entities';
import isString from 'lodash/isString';
import { stripMarkdown } from 'utils/typography';
import isArray from 'lodash/isArray';
import { Trans, useTranslation } from 'react-i18next';
import { useLocalization } from 'gatsby-theme-i18n';
import useLocalizePath from 'components/i18n/useLocalizePath';
import { graphql, useStaticQuery } from 'gatsby';
import { processEntities, RESPONSE_TAG } from '../../utils/entities';
import SubmissionWizard from '../submissions/SubmissionWizard';
import getSourceDomain from 'utils/getSourceDomain';
import { StyledHeading } from 'components/styles/Docs';
import { Helmet } from 'react-helmet';

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
  authors: withDefault(StringParam, ''),
  submitters: withDefault(StringParam, ''),
  incident_date: withDefault(CustomDateParam, ''),
  date_published: withDefault(CustomDateParam, ''),
  date_downloaded: withDefault(CustomDateParam, ''),
  image_url: withDefault(StringParam, ''),
  incident_id: withDefault(StringParam, ''),
  text: withDefault(StringParam, ''),
  editor_notes: withDefault(StringParam, ''),
  tags: withDefault(ArrayParam, []),
  language: withDefault(StringParam, 'en'),
};

const SubmitForm = () => {
  const { isRole, loading } = useUserContext();

  const [query] = useQueryParams(queryConfig);

  const initialValues = {
    url: '',
    title: '',
    incident_date: '',
    date_published: '',
    date_downloaded: '',
    image_url: '',
    incident_id: '',
    text: '',
    authors: [],
    submitters: [],
    developers: [],
    deployers: [],
    harmed_parties: [],
    editor_notes: '',
    language: 'en',
    tags: [],
  };

  const [submission, setSubmission] = useState(initialValues);

  const [isIncidentResponse, setIsIncidentResponse] = useState(false);

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
    const queryParams = { ...query };

    for (const key of ['authors', 'submitters', 'developers', 'deployers', 'harmed_parties']) {
      if (queryParams[key] && !Array.isArray(queryParams[key])) {
        queryParams[key] = [queryParams[key]];
      }
    }

    if (queryParams.tags && queryParams.tags.includes(RESPONSE_TAG)) {
      setIsIncidentResponse(true);
    }

    setSubmission(queryParams);
  }, []);

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
      const date_submitted = format(new Date(), 'yyyy-MM-dd');

      const url = new URL(values?.url);

      const source_domain = getSourceDomain(url);

      const submission = {
        ...values,
        source_domain,
        incident_id: !values.incident_id || values.incident_id == '' ? 0 : values.incident_id,
        date_submitted,
        date_modified: date_submitted,
        authors: isString(values.authors) ? values.authors.split(',') : values.authors,
        submitters: values.submitters
          ? !isArray(values.submitters)
            ? values.submitters.split(',').map((s) => s.trim())
            : values.submitters
          : ['Anonymous'],
        plain_text: await stripMarkdown(values.text),
        embedding: values.embedding || undefined,
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

      await insertSubmission({ variables: { submission } });

      setSubmission(initialValues);

      addToast({
        message: (
          <Trans i18n={i18n} ns="submit">
            Report successfully added to review queue. You can see your submission{' '}
            <Link to={localizePath({ path: '/apps/submitted', language: locale })}>here</Link>.
          </Trans>
        ),
        severity: SEVERITY.success,
      });
    } catch (e) {
      addToast({
        message: (
          <Trans i18n={i18n} ns="submit">
            Was not able to create the report, please review the form and try again.
          </Trans>
        ),
        severity: SEVERITY.warning,
      });
      throw e;
    }
  };

  const incident_id = submission.incident_id;

  return (
    <>
      <Helmet>
        <title>{t(isIncidentResponse ? 'New Incident Response' : 'New Incident Report')}</title>
      </Helmet>
      <div className={'titleWrapper'}>
        <StyledHeading data-cy="submit-form-title">
          <Trans ns="submit">
            {isIncidentResponse ? 'New Incident Response' : 'New Incident Report'}
          </Trans>
        </StyledHeading>
      </div>
      <p>
        {isIncidentResponse ? (
          <>
            {incident_id ? (
              <Trans ns="submit" i18nKey={'submitFormResponseDescription1'}>
                The following form will create a new incident response {}for incident{' '}
                <Link to={`/cite/${incident_id}`}>#{{ incident_id }}</Link> for{' '}
                <Link to="/apps/submitted">review</Link> and inclusion into the AI Incident
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
        <SubmissionWizard
          submitForm={handleSubmit}
          initialValues={submission}
          urlFromQueryString={query.url}
        />

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
          <Container className="mt-5 p-0 bootstrap">
            ``
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
            <div className="flex justify-center my-3">
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
          </Container>
        )}
      </div>
    </>
  );
};

export default SubmitForm;
