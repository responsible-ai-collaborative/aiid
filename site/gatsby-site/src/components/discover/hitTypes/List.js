import React from 'react';
import Actions from '../Actions';
import { HeaderTitle } from './shared';
import TranslationBadge from 'components/i18n/TranslationBadge';
import { VIEW_TYPES } from 'utils/discover';
import ReportCard from 'components/reports/ReportCard';

export default function List({ item, toggleFilterByIncidentId, viewType }) {
  const actions = <Actions toggleFilterByIncidentId={toggleFilterByIncidentId} item={item} />;

  item.title = viewType === VIEW_TYPES.INCIDENTS ? item.incident_title : item.title;
  item.text = viewType === VIEW_TYPES.INCIDENTS ? item.incident_description : item.text;

  const reportTitle = (
    <div className="flex justify-between w-full">
      <div className="w-[80%]">
        <HeaderTitle item={item} viewType={viewType} className="text-xl hover:text-blue-500" />
      </div>
      {item.is_translated && (
        <div className="pl-2 pt-1 w-[20%] flex justify-end">
          <TranslationBadge originalLanguage={item.language} />
        </div>
      )}
    </div>
  );

  return <ReportCard item={item} actions={actions} reportTitle={reportTitle} />;
}
