import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Image } from 'utils/cloudinary';
import styled from 'styled-components';
import { fill } from '@cloudinary/base/actions/resize';
import Actions from '../Actions';
import { HeaderTitle, SourceDomainSubtitle } from './shared';
import md5 from 'md5';
import ReportText from 'components/reports/ReportText';

const StyledCard = styled(Card)`
  overflow: hidden;
`;

const StyledCardBody = styled(Card.Body)``;

const Contents = styled.div`
  display: flex;
`;

const IncidentCardImage = styled(Image)`
  width: 120px;
  height: 80px !important;
  object-fit: cover;
`;

const Text = styled.div``;

const ActionsContainer = styled.div``;

export default function Details({
  item,
  authorsModal,
  submittersModal,
  flagReportModal,
  toggleFilterByIncidentId,
}) {
  const [viewMore, setViewMore] = useState(false);

  return (
    <StyledCard>
      <StyledCardBody>
        <Contents className="gap-3">
          <IncidentCardImage
            className="img-thumbnail"
            publicID={item.cloudinary_id ? item.cloudinary_id : `legacy/${md5(item.image_url)}`}
            alt={item.title}
            transformation={fill().height(320)}
          />
          <Text>
            <HeaderTitle item={item} />

            <SourceDomainSubtitle item={item} className="mb-2 text-muted" />

            <ActionsContainer className="d-flex justify-content-start gap-4">
              <Actions
                authorsModal={authorsModal}
                flagReportModal={flagReportModal}
                submittersModal={submittersModal}
                toggleFilterByIncidentId={toggleFilterByIncidentId}
                item={item}
              />
            </ActionsContainer>
          </Text>
        </Contents>
        <Card.Text className="mt-2">
          {viewMore ? (
            <ReportText text={item.text} />
          ) : (
            <ReportText text={item.text} maxChars={400} />
          )}

          <Button
            onClick={() => setViewMore((view) => !view)}
            variant="link"
            className="d-inline px-1 py-0"
          >
            {viewMore ? <>less</> : <>more...</>}
          </Button>
        </Card.Text>
      </StyledCardBody>
    </StyledCard>
  );
}
