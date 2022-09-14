import React from 'react';

const Wizard = ({ name, steps = [], currentStep = 0 }) => {
  return (
    <div className="w-full">
      <div className="flex flex-row items-center flex-nowrap">
        {steps.map((_step, index) => {
          return (
            <>
              <span
                className={`inline-flex items-center p-1 text-sm font-semibold ${
                  index < currentStep ? 'text-green-500' : 'text-gray-400'
                } ${
                  index === currentStep ? 'bg-blue-300 ' : 'bg-gray-100'
                } rounded-full dark:bg-gray-700 dark:text-gray-300`}
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
                    <div className={`flex w-full h-full justify-center items-center`}>
                      {index + 1}
                    </div>
                  )}
                </div>
              </span>
              {index < steps.length - 1 && (
                <div className={`w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mx-4`}>
                  <div
                    className={`${
                      currentStep >= index + 1 ? 'bg-green-500' : 'bg-gray-400'
                    } h-2.5 rounded-full dark:bg-blue-500 w-full`}
                    style={{ width: '100%' }}
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

export default Wizard;
