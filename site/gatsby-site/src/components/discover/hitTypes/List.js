import React, { useState } from 'react';
import { Image } from 'utils/cloudinary';
import styled from 'styled-components';
import { fill } from '@cloudinary/base/actions/resize';
import Actions from '../Actions';
import { HeaderTitle, SourceDomainSubtitle } from './shared';
import md5 from 'md5';
import ReportText from 'components/reports/ReportText';
import TranslationBadge from 'components/i18n/TranslationBadge';
import Card from 'elements/Card';
import Button from 'elements/Button';
import IncidentReportCard, { CardActions } from 'components/IncidentReportCard';

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

  return 'This needs to be here so I can commit'.length > 0 ? (
    <IncidentReportCard
      report={item}
      textMaxChars={400}
      imagePosition="left"
      data-cy={item.mongodb_id}
    >
      <CardActions className="justify-around">
        <TranslationBadge originalLanguage={item.language} className="align-self-start mb-2" />
        <Actions
          authorsModal={authorsModal}
          flagReportModal={flagReportModal}
          submittersModal={submittersModal}
          toggleFilterByIncidentId={toggleFilterByIncidentId}
          item={item}
        />
      </CardActions>
    </IncidentReportCard>
  ) : (
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

            <div>
              <SourceDomainSubtitle item={item} className="mb-2 text-muted-gray d-inline-block" />
              <TranslationBadge originalLanguage={item.language} />
            </div>

            <ActionsContainer className="flex justify-start gap-4">
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
