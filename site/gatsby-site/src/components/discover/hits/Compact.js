import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Highlight, Snippet } from 'react-instantsearch-dom';
import { Image } from 'utils/cloudinary';
import styled from 'styled-components';
import { fill } from '@cloudinary/base/actions/resize';
import WebArchiveLink from '../../WebArchiveLink';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faNewspaper,
  faIdCard,
  faUserShield,
  faFlag,
  faHashtag,
} from '@fortawesome/free-solid-svg-icons';
import md5 from 'md5';
import { Link } from 'gatsby';

const TitleHighlight = styled(Highlight)`
  font-weight: bold;
`;

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

const IncidentCardImage = styled(Image)`
  object-fit: cover;
  position: absolute;
  z-index: 0;
  width: 100%;
  height: 100%;
`;

const StyledCardBody = styled(Card.Body)`
  position: relative;
  padding: 0;
`;

const StyledSubTitle = styled(Card.Subtitle)`
  color: #fff;
`;

const StyledCardTitle = styled(Card.Title)`
  a {
    color: #fff;
  }
`;

const Contents = styled.div`
  background: #000000b3;
  color: #fff;
  bottom: 0;
  position: absolute;
  left: 0;
  right: 0;
  z-index: 1;
  min-height: 40%;
`;

const StyledCard = styled(Card)`
  height: 320px;
  overflow: hidden;

  :hover {
    background: #00000000;
  }

  animation: all 0s;
`;

export default function Compact({
  item,
  authorsModal,
  submittersModal,
  flagReportModal,
  toggleFilterByIncidentId,
}) {
  return (
    <StyledCard>
      <StyledCardBody className="d-flex flex-column ">
        <Contents className="ps-4 pe-4 pt-3">
          <StyledCardTitle>
            <Link
              to={`/cite/${item.incident_id}#${item.mongodb_id}`}
              className="text-decoration-none"
            >
              <TitleHighlight hit={item} attribute="title" className="h6" />
            </Link>
          </StyledCardTitle>

          <StyledSubTitle className="mb-2">
            {item.source_domain} &middot;{' '}
            {item.date_published ? item.date_published.substring(0, 4) : 'Needs publish date'}
          </StyledSubTitle>

          {item._snippetResult.text.matchLevel === 'full' && (
            <blockquote className="mt-4">
              <Snippet attribute="text" hit={item} />
            </blockquote>
          )}
        </Contents>

        <IncidentCardImage
          publicID={item.cloudinary_id ? item.cloudinary_id : `legacy/${md5(item.image_url)}`}
          alt={item.title}
          height="240px"
          transformation={fill().height(240)}
        />
      </StyledCardBody>

      <Card.Footer className="d-flex justify-content-between">
        <WebArchiveLink
          url={item.url}
          date={item.date_submitted}
          className="btn btn-link px-1"
          title={'Authors'}
        >
          <FontAwesomeIcon icon={faNewspaper} className="fa-newspaper" title="Read the Source" />
        </WebArchiveLink>

        <Button
          variant="link"
          title="Authors"
          onClick={() =>
            authorsModal.openFor({
              title: 'Authors',
              body: () => item.authors.join(', '),
            })
          }
        >
          <FontAwesomeIcon icon={faIdCard} className="fa-id-card" />
        </Button>

        <Button
          variant="link"
          title="Submitters"
          className="px-1"
          onClick={() =>
            submittersModal.openFor({
              title: 'Submitters',
              body: () => item.submitters.join(', '),
            })
          }
        >
          <FontAwesomeIcon icon={faUserShield} className="fa-user-shield" />
        </Button>

        <Button
          variant="link"
          title="Flag Report"
          className="px-1"
          onClick={() =>
            flagReportModal.openFor({
              title: 'Submitters',
              body: getFlagModalContent,
            })
          }
        >
          <FontAwesomeIcon icon={faFlag} className="fa-flag" />
        </Button>

        {toggleFilterByIncidentId && (
          <Button
            variant="link"
            aria-hidden="true"
            className="d-flex align-items-center px-1"
            onClick={() => toggleFilterByIncidentId(item.incident_id + '')}
          >
            <FontAwesomeIcon icon={faHashtag} className="fa-hashtag" title="Incident ID" />
            {item.incident_id}
          </Button>
        )}
      </Card.Footer>
    </StyledCard>
  );
}
