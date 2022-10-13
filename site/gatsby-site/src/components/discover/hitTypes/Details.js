import React from 'react';
import Actions from '../Actions';
import IncidentReportCard, { CardActions } from 'components/IncidentReportCard';

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
      <CardActions className="justify-around">
        Pokemon go to the polls
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
      </CardActions>
    </IncidentReportCard>
  );
}
