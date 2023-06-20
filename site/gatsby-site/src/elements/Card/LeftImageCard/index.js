import React from 'react';
export default function LeftImageCard({ className = '', ...props }) {
  return (
    <>
      <div
        className={`flex flex-col items-center bg-white rounded-lg border  shadow-md md:flex-row dark:border-gray-700 dark:bg-gray-800 h-full ${className}`}
        {...props}
      >
        {props.children}
      </div>
    </>
  );
}
