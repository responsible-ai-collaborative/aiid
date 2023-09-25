import { Badge } from 'flowbite-react';
import React from 'react';

const StepContainer = (props) => {
  return (
    <div
      className={`relative border rounded-lg mt-8 mb-6 shadow-md dark:bg-gray-800 dark:border-gray-700 ${props.className}`}
    >
      <div className={`${props.childClassName}`}>
        {props.children}
        <div className="absolute -top-3 bg-white px-2 text-xl whitespace-nowrap">
          <Badge color={props.color ? props.color : 'info'}>{props.name}</Badge>
        </div>
      </div>
    </div>
  );
};

export default StepContainer;
