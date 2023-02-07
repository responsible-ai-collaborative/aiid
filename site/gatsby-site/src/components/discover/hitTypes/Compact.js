import React from 'react';
import { Image } from 'utils/cloudinary';
import styled from 'styled-components';
import { fill } from '@cloudinary/base/actions/resize';
import md5 from 'md5';
import Actions from '../Actions';
import { HeaderTitle, SourceDomainSubtitle } from './shared';
import Card from 'elements/Card';
import { useTranslation } from 'react-i18next';

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
  line-height: 1.1 !important;
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
  viewType,
}) {
  const { t } = useTranslation();

  return (
    <StyledCard>
      <StyledCardBody className="flex flex-col ">
        <input type="hidden" data-cy="date-published" value={item.epoch_date_published} />
        <input type="hidden" data-cy="date-submitted" value={item.epoch_date_submitted} />
        <input type="hidden" data-cy="incident-date" value={item.epoch_incident_date} />
        <Contents className="pl-6 pr-6 pt-3">
          <StyledHeaderTitle item={item} viewType={viewType} />
          <StyledSubTitle item={item} className="my-2 small" />
        </Contents>

        <IncidentCardImage
          publicID={item.cloudinary_id ? item.cloudinary_id : `legacy/${md5(item.image_url)}`}
          alt={item.title}
          height="240px"
          transformation={fill().height(240)}
          itemIdentifier={t('Report {{report_number}}', {
            report_number: item.report_number,
          }).replace(' ', '.')}
        />
      </StyledCardBody>

      <Card.Footer className="flex justify-between">
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
