import { useTranslation } from 'react-i18next';
import StepOne from '../forms/SubmissionWizard/StepOne';
import StepTwo from '../forms/SubmissionWizard/StepTwo';
import StepThree from '../forms/SubmissionWizard/StepThree';
import { useEffect, useRef, useState } from 'react';

const SubmissionWizard = ({ submitForm, initialValues, editMode = false }) => {
  const [data, setData] = useState(initialValues);

  const [currentStep, setCurrentStep] = useState(0);

  const [steps, setSteps] = useState([]);

  const [submissionFailed, setSubmissionFailed] = useState(false);

  const [submissionComplete, setSubmissionComplete] = useState(false);

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

  const { t } = useTranslation(['submit']);

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
        validateAndSubmitForm={validateAndSubmitForm}
        submissionFailed={submissionFailed}
        submissionComplete={submissionComplete}
        editMode={editMode}
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
        editMode={editMode}
      />,
      <StepThree
        key={'submission-step-3'}
        next={handleNextStep}
        previous={handlePreviousStep}
        data={data}
        name={t('Step 3 - Tell us more')}
        submissionFailed={submissionFailed}
        submissionComplete={submissionComplete}
        editMode={editMode}
      />,
    ];

    setSteps(steps);
  }, [data, submissionFailed, submissionComplete]);

  return <div ref={stepsRef}>{steps[currentStep]}</div>;
};

export default SubmissionWizard;
