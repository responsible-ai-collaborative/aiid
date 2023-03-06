import { format, fromUnixTime } from 'date-fns';
import { LocalizedLink } from 'gatsby-theme-i18n';
import React from 'react';
import { Card } from 'react-bootstrap';
import { Highlight } from 'react-instantsearch-dom';
import styled from 'styled-components';
import { VIEW_TYPES } from 'utils/discover';
import WebArchiveLink from '../../../components/ui/WebArchiveLink';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowCircleLeft,
  faArrowCircleRight,
  faChevronCircleLeft,
  faChevronCircleRight,
  faCheckCircle,
  faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons';

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
  const centerLeftBias = (item?.bias_labels || []).some(
    (biasLabel) => biasLabel.label == 'center-left'
  );

  const centerRightBias = (item?.bias_labels || []).some(
    (biasLabel) => biasLabel.label == 'center-right'
  );

  const leftBias = (item?.bias_labels || []).some((biasLabel) => biasLabel.label == 'left');

  const rightBias = (item?.bias_labels || []).some((biasLabel) => biasLabel.label == 'right');

  const leastBiased = (item?.bias_labels || []).some(
    (biasLabel) => biasLabel.label == 'least biased'
  );

  const questionable = (item?.bias_labels || []).some(
    (biasLabel) => biasLabel.label == 'questionable'
  );

  const biasTitle =
    'The bias of this source was assessed as follows:\n\n' +
    (item?.bias_labels || [])
      .map((biasLabel) => `- "${biasLabel.label}" by ${biasLabel.labeler}`)
      .join('\n');

  return (
    <div className="bootstrap">
      <SubdomainCard {...props}>
        {leastBiased && (
          <FontAwesomeIcon
            icon={faCheckCircle}
            className="text-green-500 mr-1 mt-px"
            title={biasTitle}
          />
        )}
        {questionable && (
          <span className="text-red-500 mr-1 mt-px">
            <FontAwesomeIcon
              icon={faExclamationCircle}
              className="text-inherit"
              title={biasTitle}
            />
          </span>
        )}
        {centerLeftBias && (
          <FontAwesomeIcon
            icon={faChevronCircleLeft}
            className="text-inherit mr-1 mt-px"
            title={biasTitle}
          />
        )}
        {centerRightBias && (
          <FontAwesomeIcon
            icon={faChevronCircleRight}
            className="text-inherit mr-1 mt-px"
            title={biasTitle}
          />
        )}
        {leftBias && (
          <FontAwesomeIcon
            icon={faArrowCircleLeft}
            className="text-inherit mr-1 mt-px"
            title={biasTitle}
          />
        )}
        {rightBias && (
          <FontAwesomeIcon
            icon={faArrowCircleRight}
            className="text-inherit mr-1 mt-px"
            title={biasTitle}
          />
        )}
        <WebArchiveLink url={item.url} date={item.date_submitted}>
          {item.source_domain} &middot; {format(fromUnixTime(item.epoch_date_published), 'yyyy')}
        </WebArchiveLink>
      </SubdomainCard>
    </div>
  );
}

export default {};
