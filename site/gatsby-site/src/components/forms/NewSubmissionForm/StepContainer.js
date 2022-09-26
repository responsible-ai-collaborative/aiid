import React from 'react';

const StepContainer = (props) => {
  return (
    <div
      className={`p-6 border rounded-lg mt-8 mb-6 relative shadow-md dark:bg-gray-800 dark:border-gray-700`}
    >
      <div className="absolute -top-4 bg-white px-4 text-xl">{props.name}</div>
      {props.children}
    </div>
  );
};

export default StepContainer;
