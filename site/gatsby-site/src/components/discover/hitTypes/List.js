import React, { useState } from 'react';
import { Image } from 'utils/cloudinary';
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

export default function Details({ item, toggleFilterByIncidentId, viewType }) {
  const [viewMore, setViewMore] = useState(false);

  const { t } = useTranslation();

  return (
    <Card className="overflow-hidden">
      <Card.Body>
        <div className="flex gap-3">
          <Image
            className="img-thumbnail w-32 h-20 object-cover rounded-lg"
            publicID={item.cloudinary_id ? item.cloudinary_id : `legacy/${md5(item.image_url)}`}
            alt={viewType === VIEW_TYPES.INCIDENTS ? item.incident_title : item.title}
            transformation={fill().height(320)}
            itemIdentifier={t('Report {{report_number}}', {
              report_number: item.report_number,
            }).replace(' ', '.')}
          />
          <div>
            <HeaderTitle item={item} viewType={viewType} className="text-xl" />

            <div>
              <SourceDomainSubtitle item={item} className="mb-2 text-muted-gray d-inline-block" />
              <TranslationBadge originalLanguage={item.language} />
            </div>

            <div className="flex justify-start gap-4">
              <Actions toggleFilterByIncidentId={toggleFilterByIncidentId} item={item} />
            </div>
          </div>
        </div>
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
      </Card.Body>
    </Card>
  );
}
