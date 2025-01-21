import React from 'react';

export default function FieldContainer({ className = '', children, ...props }) {
  return (
    <div className={`my-6 first:mt-1 ${className}`} {...props}>
      {children}
    </div>
  );
}
