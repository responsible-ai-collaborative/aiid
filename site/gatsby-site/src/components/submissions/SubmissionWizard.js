import React, { useCallback, useEffect, useRef, useState } from 'react';
import getSourceDomain from 'utils/getSourceDomain';
import StepOne from '../forms/SubmissionWizard/StepOne';
import StepTwo from '../forms/SubmissionWizard/StepTwo';
import StepThree from '../forms/SubmissionWizard/StepThree';
import StepFour from '../forms/SubmissionWizard/StepFour';

const SubmissionWizard = ({ submitForm, initialValues }) => {
  const [data, setData] = useState(initialValues);

  const [currentStep, setCurrentStep] = useState(0);

  const stepsRef = useRef(null);

  const handleNextStep = useCallback(
    async (newData, final = false) => {
      setData((prev) => ({ ...prev, ...newData }));

      if (final) {
        await submitForm({ ...data, ...newData });
        setCurrentStep(3);
      } else {
        setCurrentStep((prev) => prev + 1);
      }

      stepsRef?.current?.scrollIntoView();
    },
    [stepsRef]
  );

  const handlePreviousStep = useCallback(
    (newData) => {
      setData((prev) => ({ ...prev, ...newData }));
      stepsRef?.current?.scrollIntoView();
      setCurrentStep((prev) => prev - 1);
    },
    [stepsRef]
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

export default SubmissionWizard;
