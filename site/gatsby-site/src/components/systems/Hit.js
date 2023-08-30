import React from 'react';
import hitModes from '../discover/hitTypes';
import { useQueryParam } from 'use-query-params';
import { DisplayModeEnumParam } from '../discover/queryParams';
import { LocalizedLink } from 'plugins/gatsby-theme-i18n';
import { VIEW_TYPES, citationReportUrl } from 'utils/discover';

export function HeaderTitle({ item, ...props }) {
  return (
    <div>
      <h5 {...props}>
        <LocalizedLink
          to={citationReportUrl(item, props.viewType)}
          className="no-underline font-bold text-inherit"
          title={item.title}
        >
          <div>{props.viewType === VIEW_TYPES.INCIDENTS ? item.incident_title : item.title}</div>
        </LocalizedLink>
      </h5>
    </div>
  );
}
export default function Hit(props) {
  const [display] = useQueryParam('display', DisplayModeEnumParam);

  const Component = hitModes[display].default;

  return <Component {...props} titleComponent={HeaderTitle} />;
}
