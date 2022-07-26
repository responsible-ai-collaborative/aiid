import React from 'react';
import { Card } from 'react-bootstrap';
import { Image } from 'utils/cloudinary';
import styled from 'styled-components';
import { fill } from '@cloudinary/base/actions/resize';
import md5 from 'md5';
import Actions from '../Actions';
import { HeaderTitle, SourceDomainSubtitle } from './shared';

const StyledCard = styled(Card)`
  height: 240px;

  :hover {
    background: #00000000;
  }

  animation: all 0s;
`;

const StyledCardBody = styled(Card.Body)`
  position: relative;
  padding: 0;
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

const IncidentCardImage = styled(Image)`
  object-fit: cover;
  position: absolute;
  z-index: 0;
  width: 100%;
  height: 100%;
  bottom: 0;
  left: 0;
`;

const StyledHeaderTitle = styled(HeaderTitle)`
  a {
    color: white !important;
  }
  a:hover {
    opacity: 0.9;
  }
  font-size: 1rem;
  * {
    font-size: 1rem;
  }
  max-height: 5em;
  overflow: hidden;
`;

const StyledSubTitle = styled(SourceDomainSubtitle)`
  color: var(--bs-gray-400);
  :hover {
    opacity: 0.9;
  }
  a:hover {
    color: var(--bs-gray-400);
  }
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
          <StyledHeaderTitle item={item} />
          <StyledSubTitle item={item} className="my-2 small" />
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
