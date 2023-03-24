import React from 'react';

export default function FieldContainer({ className = '', children }) {
  return <div className={`my-6 first:mt-1 ${className}`}>{children}</div>;
}
