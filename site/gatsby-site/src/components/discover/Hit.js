import React from 'react';
import { Card } from 'react-bootstrap';
import { Highlight } from 'react-instantsearch-dom';
import { Image } from 'utils/cloudinary';
import styled from 'styled-components';
import { fill } from '@cloudinary/base/actions/resize';
import WebArchiveLink from '../WebArchiveLink';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faNewspaper,
  faIdCard,
  faUserShield,
  faFlag,
  faHashtag,
} from '@fortawesome/free-solid-svg-icons';
import md5 from 'md5';
import { navigate } from 'gatsby';

const IncidentCardImage = styled(Image)`
  height: ${({ height }) => height};
  object-fit: cover;
  width: 100%;
`;

const StyledLabel = styled.p`
  margin: 0.6em 0;
`;

const cardNeedsBlockquote = (item) => {
  if (item.text && item.text.matchLevel === 'full') {
    return true;
  }
  return false;
};

const getFlagModalContent = () => (
  <div className="modal-body">
    <p>Is there a problem with this content? Examples of &quot;problems`&quot;` include,</p>
    <ul>
      <li>The text contents of the report are not parsed properly</li>
      <li>The authors of the report are not associated with the report</li>
      <li>The report is associated with the wrong incident</li>
      <li>The text contents of the report are not parsed properly</li>
    </ul>
    <p>
      Flagged content will still be displayed within the database, but a database editor will
      periodically review the incident reports that have been flagged. Please note that the content
      contained within incident reports (e.g., the commentary within a news article) does not need
      to be correct or consistent across articles. If an article is wrong, misleading, or
      fraudulent, the best response is to submit additional incident reports that correct the
      record. The incident database is meant to capture the complete state of knowledge and
      discourse for incidents, not as an arbiter of what happened in individual incidents. In future
      versions of the database it will additionally be possible to apply tags to incident reports to
      classNameify their content.
    </p>
    <p>Please do NOT flag content if,</p>
    <ul>
      <li>You disagree with the report</li>
      <li>The linked report has disappeared from the web</li>
      <li>The report should not be considered an `&quot;`incident`&quot;`</li>
    </ul>
    <button type="button" className="btn btn-danger btn-sm w-100" data-dismiss="modal">
      Flag Report
    </button>
  </div>
);

export default function Hit({
  item,
  authorsModal,
  submittersModal,
  flagReportModal,
  toggleFilterByIncidentId,
}) {
  return (
    <Card>
      <IncidentCardImage
        className="card-img-top"
        publicID={item.cloudinary_id ? item.cloudinary_id : `legacy/${md5(item.image_url)}`}
        alt={item.title}
        height="240px"
        transformation={fill().height(480)}
      />
      <Card.Body>
        <Card.Title>
          <Highlight hit={item} attribute="title" />
        </Card.Title>

        <Card.Subtitle className="mb-2 text-muted">
          {item.source_domain} &middot;{' '}
          {item.date_published ? item.date_published.substring(0, 4) : 'Needs publish date'}
        </Card.Subtitle>

        <Card.Text>
          {item._snippetResult && cardNeedsBlockquote(item._snippetResult) && (
            <blockquote>
              <Highlight
                hit={{
                  _highlightResult: {
                    ...item._snippetResult,
                    text: {
                      ...item._snippetResult.text,
                      value: `...${item._snippetResult.text.value}...`,
                    },
                  },
                }}
                attribute="text"
              />
            </blockquote>
          )}
          {item.text.substr(0, 400) + '...'}
        </Card.Text>

        <div className="align-bottom">
          {toggleFilterByIncidentId && (
            <button
              type="button"
              className="btn btn-secondary btn-sm w-100"
              onClick={() => {
                navigate(`/cite/${item.incident_id}#${item.mongodb_id}`);
              }}
            >
              <StyledLabel>Show Details on Incident #{item.incident_id}</StyledLabel>
            </button>
          )}
        </div>
      </Card.Body>

      <Card.Footer>
        <WebArchiveLink url={item.url} date={item.date_submitted} className="card-link">
          <FontAwesomeIcon
            icon={faNewspaper}
            className="far fa-newspaper"
            title="Read the Source"
          />
        </WebArchiveLink>

        <button className="card-link">
          <FontAwesomeIcon
            icon={faIdCard}
            className="pointer far fa-id-card"
            title="Authors"
            onClick={() =>
              authorsModal.openFor({
                title: 'Authors',
                body: () => item.authors.join(', '),
              })
            }
          />
        </button>

        <button
          className="card-link"
          title="Submitters"
          onClick={() =>
            submittersModal.openFor({
              title: 'Submitters',
              body: () => item.submitters.join(', '),
            })
          }
        >
          <FontAwesomeIcon icon={faUserShield} className="pointer fas fa-user-shield" />
        </button>

        <button
          className="card-link"
          title="Flag Report"
          onClick={() =>
            flagReportModal.openFor({
              title: 'Submitters',
              body: getFlagModalContent,
            })
          }
        >
          <FontAwesomeIcon icon={faFlag} className="pointer far fa-flag" />
        </button>

        {toggleFilterByIncidentId && (
          <button
            className="card-link"
            aria-hidden="true"
            onClick={() => toggleFilterByIncidentId(item.incident_id + '')}
          >
            <FontAwesomeIcon icon={faHashtag} className="fas fa-hashtag" title="Incident ID" />
            {item.incident_id}
          </button>
        )}
      </Card.Footer>
    </Card>
  );
}
