import useToastContext, { SEVERITY } from 'hooks/useToast';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { getCloudinaryPublicID } from 'utils/cloudinary';
import getSourceDomain from 'utils/getSourceDomain';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';
import { stripMarkdown } from 'utils/typography';
import { format } from 'date-fns';
import isString from 'lodash/isString';
import isArray from 'lodash/isArray';
import { useMutation } from '@apollo/client';
import { FIND_SUBMISSIONS, INSERT_SUBMISSION } from '../../../graphql/submissions';
import StepFour from './StepFour';

const NewSubmissionForm = () => {
  const [data, setData] = useState({
    authors: null,
    cloudinary_id: '',
    date_downloaded: '',
    date_published: null,
    image_url: '',
    submitters: '',
    text: '',
    title: '',
    url: '',
    source_domain: '',
    language: 'en',
    description: '',
    incident_id: '',
    embedding: undefined,
    developers: '',
    deployers: '',
    harmed_parties: '',
    incident_date: '',
  });

  const [currentStep, setCurrentStep] = useState(0);

  const [parsingNews, setParsingNews] = useState(false);

  const stepsRef = useRef(null);

  const [insertSubmission] = useMutation(INSERT_SUBMISSION, { refetchQueries: [FIND_SUBMISSIONS] });

  const handleNextStep = async (newData, final = false) => {
    setData((prev) => ({ ...prev, ...newData }));

    if (final) {
      const date_submitted = format(new Date(), 'yyyy-MM-dd');

      const description = data.description ? data.description : data.text;

      const submission = {
        ...data,
        incident_id: data.incident_id == '' ? 0 : data.incident_id,
        date_submitted,
        date_modified: date_submitted,
        description: description.substring(0, 200),
        authors: isString(data.authors) ? data.authors.split(',') : data.authors,
        submitters: data.submitters
          ? !isArray(data.submitters)
            ? data.submitters.split(',').map((s) => s.trim())
            : data.submitters
          : ['Anonymous'],
        plain_text: await stripMarkdown(data.text),
        embedding: data.embedding || undefined,
        developers: isString(data.developers) ? data.developers.split(',') : data.developers,
        deployers: isString(data.deployers) ? data.deployers.split(',') : data.deployers,
        harmed_parties: isString(data.harmed_parties)
          ? data.harmed_parties.split(',')
          : data.harmed_parties,
      };

      await insertSubmission({ variables: { submission } });
    }

    stepsRef?.current?.scrollIntoView();

    setCurrentStep((prev) => prev + 1);
  };

  const handlePreviousStep = (newData) => {
    setData((prev) => ({ ...prev, ...newData }));
    stepsRef?.current?.scrollIntoView();
    setCurrentStep((prev) => prev - 1);
  };

  const addToast = useToastContext();

  const { t } = useTranslation(['submit']);

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
          ...data,
          ...news,
          url: newsUrl,
          cloudinary_id,
        };

        for (const key of ['authors', 'submitters', 'developers', 'deployers', 'harmed_parties']) {
          if (newValues[key] && !Array.isArray(newValues[key])) {
            newValues[key] = [newValues[key]];
          }
        }

        setData(newValues);
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
    [data]
  );

  useEffect(() => {
    try {
      const url = new URL(data?.url);

      setData({
        ...data,
        source_domain: getSourceDomain(url),
      });
    } catch (e) {
      // eslint-disable-next-line no-empty
    } // just ignore it
  }, [data?.url]);

  const steps = [
    <StepOne
      key={'submission-step-1'}
      next={handleNextStep}
      data={data}
      name="Step 1 - main information"
      parseNewsUrl={parseNewsUrl}
      parsingNews={parsingNews}
    />,
    <StepTwo
      key={'submission-step-2'}
      next={handleNextStep}
      previous={handlePreviousStep}
      data={data}
      name="Step 2 - additional information"
    />,
    <StepThree
      key={'submission-step-3'}
      next={handleNextStep}
      previous={handlePreviousStep}
      data={data}
      name="Step 3 - Tell us more"
    />,
    <StepFour key={'submission-step-4'} />,
  ];

  return <div ref={stepsRef}>{steps[currentStep]}</div>;
};

export default NewSubmissionForm;
