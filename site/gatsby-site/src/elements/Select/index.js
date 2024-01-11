import React from 'react';

export default function Select(props) {
  const className = `
    block w-full p-2.5 pr-6 text-sm rounded-lg border

    dark:placeholder-gray-400

    dark:bg-gray-700
         bg-gray-50

    dark:text-white
         text-gray-900

    dark:focus:border-blue-500
         focus:border-blue-500
          dark:border-gray-600
               border-gray-300

    dark:focus:ring-blue-500
         focus:ring-blue-500

    ${props.className || ''}
  `;

  return <select {...{ ...props, className }}>{props.children}</select>;
}
