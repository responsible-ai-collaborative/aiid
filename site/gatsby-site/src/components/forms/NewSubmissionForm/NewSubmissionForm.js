import useToastContext, { SEVERITY } from 'hooks/useToast';
import React, { useCallback, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { getCloudinaryPublicID } from 'utils/cloudinary';
import getSourceDomain from 'utils/getSourceDomain';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';

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
  });

  const [currentStep, setCurrentStep] = useState(0);

  const [parsingNews, setParsingNews] = useState(false);

  const handleNextStep = (newData, final = false) => {
    setData((prev) => ({ ...prev, ...newData }));

    if (final) {
      console.log('Full submission!', newData);
      return;
    }

    setCurrentStep((prev) => prev + 1);
  };

  const handlePreviousStep = (newData) => {
    setData((prev) => ({ ...prev, ...newData }));
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

  console.log('data', data);

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
      name="Step 1"
      parseNewsUrl={parseNewsUrl}
      parsingNews={parsingNews}
    />,
    <StepTwo
      key={'submission-step-2'}
      next={handleNextStep}
      previous={handlePreviousStep}
      data={data}
      name="Step 2"
    />,
    <StepThree
      key={'submission-step-3'}
      next={handleNextStep}
      previous={handlePreviousStep}
      data={data}
      name="Step 3"
    />,
  ];

  return (
    <div>
      <h1>New Submission Form</h1>
      {steps[currentStep]}
    </div>
  );
};

export default NewSubmissionForm;
