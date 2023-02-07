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
import { useTranslation } from 'react-i18next';
import { VIEW_TYPES } from 'utils/discover';

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
  viewType,
}) {
  const [viewMore, setViewMore] = useState(false);

  const { t } = useTranslation();

  return (
    <StyledCard>
      <StyledCardBody>
        <input type="hidden" data-cy="date-published" value={item.epoch_date_published} />
        <input type="hidden" data-cy="date-submitted" value={item.epoch_date_submitted} />
        <input type="hidden" data-cy="incident-date" value={item.epoch_incident_date} />
        <Contents className="gap-3">
          <IncidentCardImage
            className="img-thumbnail"
            publicID={item.cloudinary_id ? item.cloudinary_id : `legacy/${md5(item.image_url)}`}
            alt={viewType === VIEW_TYPES.INCIDENTS ? item.incident_title : item.title}
            transformation={fill().height(320)}
            itemIdentifier={t('Report {{report_number}}', {
              report_number: item.report_number,
            }).replace(' ', '.')}
          />
          <Text>
            <HeaderTitle item={item} viewType={viewType} />

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
            <ReportText
              text={viewType === VIEW_TYPES.INCIDENTS ? item.incident_description : item.text}
            />
          ) : (
            <ReportText
              text={viewType === VIEW_TYPES.INCIDENTS ? item.incident_description : item.text}
              maxChars={400}
            />
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
