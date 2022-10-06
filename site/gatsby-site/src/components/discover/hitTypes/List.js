import React from 'react';
import Actions from '../Actions';
import TranslationBadge from 'components/i18n/TranslationBadge';
import IncidentReportCard, { CardActions } from 'components/IncidentReportCard';

export default function Details({
  item,
  authorsModal,
  submittersModal,
  flagReportModal,
  toggleFilterByIncidentId,
}) {
  return (
    <IncidentReportCard
      report={item}
      textMaxChars={400}
      imagePosition="left"
      data-cy={item.mongodb_id}
    >
      <CardActions className="justify-around">
        <TranslationBadge originalLanguage={item.language} className="align-self-start mb-2" />
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
