import React from 'react';
export default function TopImageCard({ className = '', ...props }) {
  return (
    <>
      <div
        className={`max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 pb-4 ${className}`}
        {...props}
      >
        {props.children}
      </div>
    </>
  );
}
