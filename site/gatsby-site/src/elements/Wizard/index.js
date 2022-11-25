import { Button } from 'flowbite-react';
import React, { useEffect, useRef, useState } from 'react';
import { Trans } from 'react-i18next';

const Wizard = (props) => {
  return <>{props.children}</>;
};

Wizard.StepContainer = ({ header, currentWizardStep, ...props }) => {
  return (
    <div className={`p-6 border rounded-lg mt-6 relative ${currentWizardStep ? '' : 'hidden'}`}>
      <div className="absolute -top-5 bg-white px-4 text-primary-blue text-xl">{header}</div>
      {props.children}
    </div>
  );
};

Wizard.Progress = ({ name, steps = [], currentStep }) => {
  const [progress] = useState(100);

  const prevCurrentStepRef = useRef();

  useEffect(() => {
    prevCurrentStepRef.current = currentStep || 0;
  }, [currentStep]);

  return (
    <div className="w-full">
      <div className="flex flex-row items-center flex-nowrap">
        {steps.map((_step, index) => {
          return (
            <>
              <span
                className={`inline-flex items-center p-1 text-sm font-semibold ${
                  index < currentStep
                    ? 'text-green-500 border-green-500'
                    : 'text-gray-500 border-gray-300'
                } ${
                  index === currentStep ? 'bg-blue-500 ' : 'bg-gray-100'
                } border  rounded-full dark:bg-gray-700 dark:text-gray-300`}
              >
                <div className="h-6 w-6">
                  {index < currentStep ? (
                    <svg
                      aria-hidden="true"
                      className="w-full h-full"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  ) : (
                    <div
                      className={`flex w-full h-full justify-center items-center 
                    ${index === currentStep ? 'text-white ' : ''}`}
                    >
                      {index + 1}
                    </div>
                  )}
                </div>
              </span>
              {index < steps.length - 1 && (
                <div className={`w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mx-4`}>
                  <div
                    className={`${
                      currentStep >= index + 1 ? 'bg-green-500' : 'bg-gray-100'
                    } h-2.5 rounded-full dark:bg-blue-500  border border-gray-300`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              )}
            </>
          );
        })}
      </div>
      {steps.map((step, index) => {
        return <div key={`wizard-${name}-step-{${index}}`}></div>;
      })}
    </div>
  );
};

Wizard.Next = ({ onClick }) => {
  return (
    <Button onClick={onClick}>
      <Trans>Next</Trans>{' '}
      <svg
        aria-hidden="true"
        className="ml-2 -mr-1 w-4 h-4"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
          clipRule="evenodd"
        ></path>
      </svg>
    </Button>
  );
};

Wizard.Previous = ({ onClick }) => {
  return (
    <Button onClick={onClick}>
      <svg
        aria-hidden="true"
        className="mr-2 -ml-1 w-4 h-4"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
          clipRule="evenodd"
        ></path>
      </svg>
      <Trans>Previous</Trans>
    </Button>
  );
};

Wizard.displayName = 'Wizard';
Wizard.StepContainer.displayName = 'WizardStepContainer';
Wizard.Progress.displayName = 'WizardProgress';
Wizard.Previous.displayName = 'WizardPrevious';
Wizard.Next.displayName = 'WizardNext';

export default Wizard;
