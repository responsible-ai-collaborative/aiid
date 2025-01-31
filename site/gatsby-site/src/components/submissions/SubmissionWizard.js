import useToastContext, { SEVERITY } from 'hooks/useToast';
import React, { useCallback, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { getCloudinaryPublicID } from 'utils/cloudinary';
import StepOne from '../forms/SubmissionWizard/StepOne';
import StepTwo from '../forms/SubmissionWizard/StepTwo';
import StepThree from '../forms/SubmissionWizard/StepThree';
import { useUserContext } from 'contexts/UserContext';

const SubmissionWizard = ({
  submitForm,
  initialValues,
  urlFromQueryString,
  submissionReset,
  setSavingInLocalStorage,
  scrollToTop,
}) => {
  const [data, setData] = useState(initialValues);

  useEffect(() => {
    setData({ ...initialValues });
  }, [initialValues]);

  const [currentStep, setCurrentStep] = useState(0);

  const [steps, setSteps] = useState([]);

  const [submissionFailed, setSubmissionFailed] = useState(false);

  const [submissionComplete, setSubmissionComplete] = useState(false);

  const [parsingNews, setParsingNews] = useState(false);

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

    scrollToTop();
  };

  const handlePreviousStep = (newData) => {
    setData((prev) => ({ ...prev, ...newData }));
    scrollToTop();
    setCurrentStep((prev) => prev - 1);
  };

  const addToast = useToastContext();

  const { t } = useTranslation(['submit']);

  const { loading, user } = useUserContext();

  const parseNewsUrl = useCallback(
    async (newsUrl) => {
      setParsingNews(true);

      try {
        const url = `/api/parseNews?url=${encodeURIComponent(newsUrl)}`;

        const response = await fetch(url);

        if (!response.ok) {
          let errorText = 'Parser error';

          let responseErrorText = null;

          try {
            responseErrorText = await response.text();
          } catch (e) {
            responseErrorText = 'Could not read parser error:' + '\n\n' + e.message;
          }

          if (responseErrorText) {
            errorText += '\n\n' + responseErrorText;
          }
          throw new Error(errorText);
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

        if (!loading && user) {
          newValues.user = { link: user.id };

          if (user.first_name && user.last_name) {
            newValues.submitters = [`${user.first_name} ${user.last_name}`];
          }
        }

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
        const message = e.message.startsWith('Parser error')
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
        submissionReset={submissionReset}
        setSavingInLocalStorage={setSavingInLocalStorage}
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
        submissionReset={submissionReset}
        setSavingInLocalStorage={setSavingInLocalStorage}
      />,
      <StepThree
        key={'submission-step-3'}
        next={handleNextStep}
        previous={handlePreviousStep}
        data={data}
        name={t('Step 3 - Tell us more')}
        validateAndSubmitForm={validateAndSubmitForm}
        submissionFailed={submissionFailed}
        submissionComplete={submissionComplete}
        submissionReset={submissionReset}
        setSavingInLocalStorage={setSavingInLocalStorage}
      />,
    ];

    setSteps(steps);
  }, [data, submissionFailed, parsingNews, submissionComplete, submissionReset]);

  return <div>{steps[currentStep]}</div>;
};

export default SubmissionWizard;
