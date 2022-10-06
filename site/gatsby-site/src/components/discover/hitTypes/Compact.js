import React from 'react';
import Actions from '../Actions';
import IncidentReportCard, { CardActions } from 'components/IncidentReportCard';

export default function Compact({
  item,
  authorsModal,
  submittersModal,
  flagReportModal,
  toggleFilterByIncidentId,
}) {
  return (
    <IncidentReportCard report={item} text={false} data-cy={item.mongodb_id}>
      <CardActions className="justify-around">
        <Actions
          authorsModal={authorsModal}
          flagReportModal={flagReportModal}
          submittersModal={submittersModal}
          toggleFilterByIncidentId={toggleFilterByIncidentId}
          item={item}
        />
      </CardActions>
    </IncidentReportCard>
  );
}
