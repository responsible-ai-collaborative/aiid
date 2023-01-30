import { format, fromUnixTime } from 'date-fns';
import { LocalizedLink } from 'gatsby-theme-i18n';
import React from 'react';
import { Card } from 'react-bootstrap';
import { Highlight } from 'react-instantsearch-dom';
import styled from 'styled-components';
import { VIEW_TYPES } from 'utils/discover';
import WebArchiveLink from '../../../components/ui/WebArchiveLink';

const linkHoverHighlight = `
  a:not(:hover) {
    color: inherit;
  }
`;

const HeaderCard = styled(Card.Title)`
  a {
    font-weight: bold;
  }
  ${linkHoverHighlight}
`;

const SubdomainCard = styled(Card.Subtitle)`
  ${linkHoverHighlight}
`;

export function citationReportUrl(item, viewType) {
  let path = null;

  if (viewType === VIEW_TYPES.INCIDENTS) {
    path = '/cite/' + item.incident_id;
  } else {
    if (item.is_incident_report) {
      path = '/cite/' + item.incident_id + '#r' + item.objectID;
    } else {
      path = `/reports/${item.report_number}`;
    }
  }

  return path;
}

export function HeaderTitle({ item, ...props }) {
  return (
    <div className="bootstrap">
      <HeaderCard {...props}>
        <LocalizedLink
          to={citationReportUrl(item, props.viewType)}
          className="no-underline"
          title={item.title}
        >
          <Highlight
            hit={item}
            attribute={props.viewType === VIEW_TYPES.INCIDENTS ? 'incident_title' : 'title'}
          />
        </LocalizedLink>
      </HeaderCard>
    </div>
  );
}

export function SourceDomainSubtitle({ item, ...props }) {
  return (
    <div className="bootstrap">
      <SubdomainCard {...props}>
        <WebArchiveLink url={item.url} date={item.date_submitted}>
          {item.source_domain} &middot; {format(fromUnixTime(item.epoch_date_published), 'yyyy')}
        </WebArchiveLink>
      </SubdomainCard>
    </div>
  );
}

export default {};
