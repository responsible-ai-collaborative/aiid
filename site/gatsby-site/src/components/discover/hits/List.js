import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Highlight, Snippet } from 'react-instantsearch-dom';
import { Image } from 'utils/cloudinary';
import styled from 'styled-components';
import { fill } from '@cloudinary/base/actions/resize';
import md5 from 'md5';
import Actions from './Actions';

const IncidentCardImage = styled(Image)`
  width: 120px;
  height: 80px;
  object-fit: cover;
`;

const TitleHighlight = styled(Highlight)`
  font-weight: bold;
`;

const StyledCardBody = styled(Card.Body)``;

const Contents = styled.div`
  display: flex;
`;

const StyledCard = styled(Card)`
  overflow: hidden;
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
            <Card.Title>
              <TitleHighlight hit={item} attribute="title" />
            </Card.Title>

            <Card.Subtitle className="mb-2 text-muted">
              {item.source_domain} &middot;{' '}
              {item.date_published ? item.date_published.substring(0, 4) : 'Needs publish date'}
            </Card.Subtitle>

            {item._snippetResult.text.matchLevel === 'full' && (
              <blockquote className="mt-4">
                <Snippet attribute="text" hit={item} />
              </blockquote>
            )}

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
          {viewMore ? item.text : item.text.slice(0, 400)}

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
