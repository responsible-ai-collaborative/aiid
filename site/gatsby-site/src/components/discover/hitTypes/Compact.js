import React from 'react';
import Actions from '../Actions';
import IncidentReportCard, { CardChild } from 'components/IncidentReportCard';

export default function Compact({
  item,
  authorsModal,
  submittersModal,
  flagReportModal,
  toggleFilterByIncidentId,
  setExpandFilters,
}) {
  return (
    <IncidentReportCard report={item} text={false} data-cy={item.mongodb_id}>
      <CardChild className="justify-around" position="footer">
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
