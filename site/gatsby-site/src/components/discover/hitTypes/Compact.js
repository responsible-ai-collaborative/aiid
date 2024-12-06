import React from 'react';
import { Image } from 'utils/cloudinary';
import { fill } from '@cloudinary/base/actions/resize';

import md5 from 'md5';
import Actions from '../Actions';
import useLocalizePath from 'components/i18n/useLocalizePath';

import { SourceDomainSubtitle, HeaderTitle } from './shared';
import { useTranslation } from 'react-i18next';
import TranslationBadge from 'components/i18n/TranslationBadge';
import Card from 'elements/Card';
import { VIEW_TYPES } from 'utils/discover';

export default function Compact({ item, toggleFilterByIncidentId, viewType }) {
  const localizePath = useLocalizePath();

  const { t } = useTranslation();

  const detailsPath =
    viewType === VIEW_TYPES.INCIDENTS
      ? localizePath({
          path: `/cite/${item.incident_id}`,
        })
      : item.is_incident_report
      ? localizePath({
          path: `/cite/${item.incident_id}#r${item.objectID}`,
        })
      : localizePath({
          path: `/reports/${item.report_number}`,
        });

  return (
    <Card className="h-full" data-cy={item.mongodb_id} data-cy-report-number={item.report_number}>
      <input type="hidden" data-cy="date-published" value={item.epoch_date_published} />
      <input type="hidden" data-cy="date-submitted" value={item.epoch_date_submitted} />
      <input type="hidden" data-cy="incident-date" value={item.epoch_incident_date} />
      <div className="relative block h-[18rem]">
        <Image
          className={`absolute inset-0 card-img-top rounded-t-lg object-cover w-full`}
          publicID={item.cloudinary_id ? item.cloudinary_id : `legacy/${md5(item.image_url)}`}
          alt={item.title}
          transformation={fill().height(480)}
          itemIdentifier={t('Report {{report_number}}', {
            report_number: item.report_number,
          }).replace(' ', '.')}
        />
        <div className="absolute inset-0 flex justify-center items-end">
          <div
            className="
            w-full
            backdrop-blur-md
            p-3
            pb-2
            rounded-md
            bg-white/60
            top-0
            inset-x-0
            shadow-lg
            m-4
          "
          >
            <a href={detailsPath}>
              <HeaderTitle
                item={item}
                viewType={viewType}
                className="mb-1 leading-tight text-xl hover:text-blue-500 text-black hover:text-black"
              />
            </a>
            <SourceDomainSubtitle item={item} className="mb-2 [&>div>a]:text-black" />
            {item.is_translated && (
              <TranslationBadge
                originalLanguage={item.language}
                className="align-self-start mb-2"
              />
            )}
          </div>
        </div>
      </div>
      <Card.Footer className="flex justify-between">
        <Actions toggleFilterByIncidentId={toggleFilterByIncidentId} item={item} />
      </Card.Footer>
    </Card>
  );
}
