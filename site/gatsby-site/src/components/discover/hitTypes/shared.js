import React from 'react';
import { Card } from 'react-bootstrap';
import { Highlight } from 'react-instantsearch-dom';
import styled from 'styled-components';

const linkHoverHighlight = `
  a:not(:hover) { color: inherit; }
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

export function citationReportUrl(item) {
  return '/cite/' + item.incident_id + '#r' + item.objectID;
}

export function HeaderTitle({ item, ...props }) {
  return (
    <HeaderCard {...props}>
      <a href={citationReportUrl(item)}>
        <Highlight hit={item} attribute="title" />
      </a>
    </HeaderCard>
  );
}

export function SourceDomainSubtitle({ item, ...props }) {
  return (
    <SubdomainCard {...props}>
      <a href={item.url}>
        {item.source_domain} &middot;{' '}
        {item.date_published ? item.date_published.substring(0, 4) : 'Needs publish date'}
      </a>
    </SubdomainCard>
  );
}

export default {};
