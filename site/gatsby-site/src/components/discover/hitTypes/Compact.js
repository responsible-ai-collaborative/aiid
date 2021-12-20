import React from 'react';
import { Card } from 'react-bootstrap';
import { Highlight, Snippet } from 'react-instantsearch-dom';
import { Image } from 'utils/cloudinary';
import styled from 'styled-components';
import { fill } from '@cloudinary/base/actions/resize';
import md5 from 'md5';
import { Link } from 'gatsby';
import Actions from './Actions';

const BlockQuote = styled.blockquote`
  color: var(--bs-gray-400);
  .ais-Snippet-highlighted {
    background: rgba(237, 74, 0, 0.98);
  }
`;

const TitleHighlight = styled(Highlight)`
  font-weight: bold;
`;

const IncidentCardImage = styled(Image)`
  object-fit: cover;
  position: absolute;
  z-index: 0;
  width: 100%;
  height: 100%;
  bottom: 0;
  left: 0;
`;

const StyledCardBody = styled(Card.Body)`
  position: relative;
  padding: 0;
`;

const StyledSubTitle = styled(Card.Subtitle)`
  color: var(--bs-gray-400);
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
  height: 240px;
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
          {item._snippetResult.text.matchLevel === 'full' ? (
            <>
              <StyledCardTitle>
                <Link
                  to={`/cite/${item.incident_id}#r${item.mongodb_id}`}
                  className="text-decoration-none"
                >
                  <TitleHighlight hit={item} attribute="title" className="h6" />
                </Link>
              </StyledCardTitle>
              <BlockQuote className="mt-4 small">
                <Snippet attribute="text" hit={item} />
              </BlockQuote>
            </>
          ) : (
            <>
              <StyledCardTitle>
                <Link
                  to={`/cite/${item.incident_id}#${item.mongodb_id}`}
                  className="text-decoration-none"
                >
                  <TitleHighlight hit={item} attribute="title" className="h6" />
                </Link>
              </StyledCardTitle>
              <StyledSubTitle className="my-2 small">
                {item.source_domain} &middot;{' '}
                {item.date_published ? item.date_published.substring(0, 4) : 'Needs publish date'}
              </StyledSubTitle>
            </>
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
        <Actions
          authorsModal={authorsModal}
          flagReportModal={flagReportModal}
          submittersModal={submittersModal}
          toggleFilterByIncidentId={toggleFilterByIncidentId}
          item={item}
        />
      </Card.Footer>
    </StyledCard>
  );
}
