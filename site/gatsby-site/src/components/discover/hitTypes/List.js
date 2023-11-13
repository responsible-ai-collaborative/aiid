import React from 'react';
import Actions from '../Actions';
import { HeaderTitle } from './shared';
import TranslationBadge from 'components/i18n/TranslationBadge';
import { VIEW_TYPES } from 'utils/discover';
import ReportCard from 'components/reports/ReportCard';

export default function Details({ item, toggleFilterByIncidentId, viewType }) {
  const actions = <Actions toggleFilterByIncidentId={toggleFilterByIncidentId} item={item} />;

  item.title = viewType === VIEW_TYPES.INCIDENTS ? item.incident_title : item.title;
  item.text = viewType === VIEW_TYPES.INCIDENTS ? item.incident_description : item.text;

  const reportTitle = (
    <>
      <HeaderTitle item={item} viewType={viewType} className="text-xl hover:text-blue-500" />
      <div>
        <TranslationBadge originalLanguage={item.language} />
      </div>
    </>
  );

  return <ReportCard item={item} actions={actions} reportTitle={reportTitle} />;
}
