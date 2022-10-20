import React from 'react';
import Actions from '../Actions';
import IncidentReportCard, { CardFooter } from 'components/IncidentReportCard';

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
      <CardFooter className="justify-around">
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
      </CardFooter>
    </IncidentReportCard>
  );
}
