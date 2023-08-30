import WebArchiveLink from 'components/ui/WebArchiveLink';
import { format, fromUnixTime } from 'date-fns';
import React from 'react';

export function SourceDomainSubtitle({ item, className }) {
  return (
    <div className={`${className} text-inherit`}>
      <WebArchiveLink url={item.url} date={item.date_submitted}>
        {item.source_domain} &middot; {format(fromUnixTime(item.epoch_date_published), 'yyyy')}
      </WebArchiveLink>
    </div>
  );
}
