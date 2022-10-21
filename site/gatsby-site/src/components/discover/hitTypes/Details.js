import React from 'react';
import Actions from '../Actions';
import IncidentReportCard, { CardChild } from 'components/IncidentReportCard';

export default function Details({
  item,
  authorsModal,
  submittersModal,
  flagReportModal,
  toggleFilterByIncidentId,
  setExpandFilters,
}) {
  return (
    <IncidentReportCard
      report={item}
      textMaxChars={400 - item.title.length * 2}
      data-cy={item.mongodb_id}
    >
      <CardChild position="footer" className="justify-around mt-auto flex-wrap w-full">
        <Actions
          {...{
            authorsModal,
            flagReportModal,
            submittersModal,
            toggleFilterByIncidentId,
            item,
            setExpandFilters,
          }}
        />
      </CardChild>
    </IncidentReportCard>
  );
}
