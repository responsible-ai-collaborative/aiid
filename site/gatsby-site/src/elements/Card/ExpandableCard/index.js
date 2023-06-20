import React from 'react';
export default function ExpandableCard({ className = '', ...props }) {
  return (
    <>
      <div
        className={`inline-block w-full bg-white rounded-lg border  shadow-md dark:border-gray-700 dark:bg-gray-800 p-4 relative ${className}`}
        {...props}
      >
        {props.children}
      </div>
    </>
  );
}
