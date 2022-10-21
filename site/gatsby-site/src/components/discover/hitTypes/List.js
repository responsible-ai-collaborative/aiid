import React from 'react';
import Actions from '../Actions';
import TranslationBadge from 'components/i18n/TranslationBadge';
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
      textMaxChars={400}
      imagePosition="left"
      data-cy={item.mongodb_id}
    >
      <CardChild position="footer" className="justify-around flex-wrap w-auto">
        <TranslationBadge originalLanguage={item.language} className="align-self-start mb-2" />
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
