import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';

export default function DateLabel({ date, className = '' }) {
  const [formmated, setFormatted] = useState('');

  useEffect(() => setFormatted(format(date, 'yyyy-MM-dd')), []);

  if (!formmated) {
    return (
      <span role="status" className={className}>
        <span
          role="status"
          style={{ height: '1ch' }}
          className="animate-pulse inline-block bg-gray-200 rounded-full dark:bg-gray-700 w-24"
        ></span>
      </span>
    );
  }

  return <span className={className}>{formmated}</span>;
}
