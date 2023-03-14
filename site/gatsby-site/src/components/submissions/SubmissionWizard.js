import useToastContext, { SEVERITY } from 'hooks/useToast';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { getCloudinaryPublicID } from 'utils/cloudinary';
import StepOne from '../forms/SubmissionWizard/StepOne';
import StepTwo from '../forms/SubmissionWizard/StepTwo';
import StepThree from '../forms/SubmissionWizard/StepThree';

const SubmissionWizard = ({ submitForm, initialValues, urlFromQueryString }) => {
  const [data, setData] = useState(initialValues);

  const [currentStep, setCurrentStep] = useState(0);

  const [steps, setSteps] = useState([]);

  const [submissionFailed, setSubmissionFailed] = useState(false);

  const [submissionComplete, setSubmissionComplete] = useState(false);

  const [parsingNews, setParsingNews] = useState(false);

  const stepsRef = useRef(null);

  const handleNextStep = async (newData, final = false) => {
    setSubmissionFailed(false);
    setSubmissionComplete(false);
    setData((prev) => ({ ...prev, ...newData }));

    if (final) {
      try {
        await submitForm({ ...data, ...newData });
        setSubmissionComplete(true);
      } catch (error) {
        setTimeout(() => {
          setSubmissionFailed(true);
        }, 0);
        throw error;
      }
      setCurrentStep(0);
    } else {
      setCurrentStep((prev) => prev + 1);
    }

    stepsRef?.current?.scrollIntoView();
  };

  const handlePreviousStep = (newData) => {
    setData((prev) => ({ ...prev, ...newData }));
    stepsRef?.current?.scrollIntoView();
    setCurrentStep((prev) => prev - 1);
  };

  useEffect(() => {
    setData(initialValues);
  }, [initialValues]);

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

        for (const key of [
          'tags',
          'authors',
          'submitters',
          'developers',
          'deployers',
          'harmed_parties',
        ]) {
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
          error: e,
        });
      }

      setParsingNews(false);
    },
    [data]
  );

  const validateAndSubmitForm = async (
    last = false,
    setIsSubmitting,
    isValid,
    validateForm,
    setFieldTouched,
    values,
    submitForm
  ) => {
    setIsSubmitting(true);
    if (!isValid) {
      const invalidFields = await validateForm();

      Object.keys(invalidFields).map((key) => {
        setFieldTouched(key, true);
      });
      setIsSubmitting(false);
    } else {
      submitForm(values, last);
    }
  };

  useEffect(() => {
    const steps = [
      <StepOne
        key={'submission-step-1'}
        next={handleNextStep}
        data={data}
        name={t('Step 1 - main information')}
        parseNewsUrl={parseNewsUrl}
        parsingNews={parsingNews}
        validateAndSubmitForm={validateAndSubmitForm}
        submissionFailed={submissionFailed}
        submissionComplete={submissionComplete}
        urlFromQueryString={urlFromQueryString}
      />,
      <StepTwo
        key={'submission-step-2'}
        next={handleNextStep}
        previous={handlePreviousStep}
        data={data}
        name={t('Step 2 - additional information')}
        validateAndSubmitForm={validateAndSubmitForm}
        submissionFailed={submissionFailed}
        submissionComplete={submissionComplete}
      />,
      <StepThree
        key={'submission-step-3'}
        next={handleNextStep}
        previous={handlePreviousStep}
        data={data}
        name={t('Step 3 - Tell us more')}
        submissionFailed={submissionFailed}
        submissionComplete={submissionComplete}
      />,
    ];

    setSteps(steps);
  }, [data, submissionFailed, parsingNews, submissionComplete]);

  return <div ref={stepsRef}>{steps[currentStep]}</div>;
};

export default SubmissionWizard;
