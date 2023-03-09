import React from 'react';
import { formatInTimeZone } from 'date-fns-tz';

export default function DateLabel({ date, className = '' }) {
  const formmated = formatInTimeZone(date, 'UTC', 'yyyy-MM-dd');

  return <span className={className}>{formmated}</span>;
}
