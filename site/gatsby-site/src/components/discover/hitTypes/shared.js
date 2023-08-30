import { LocalizedLink } from 'plugins/gatsby-theme-i18n';
import React from 'react';
import { Highlight } from 'react-instantsearch-dom';
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
          <Highlight
            hit={item}
            attribute={props.viewType === VIEW_TYPES.INCIDENTS ? 'incident_title' : 'title'}
          />
        </LocalizedLink>
      </h5>
    </div>
  );
}

export default {};
