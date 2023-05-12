import React from 'react';
import { Image } from 'utils/cloudinary';
import { fill } from '@cloudinary/base/actions/resize';
import md5 from 'md5';
import Actions from '../Actions';
import { HeaderTitle, SourceDomainSubtitle } from './shared';
import Card from 'elements/Card';
import { useTranslation } from 'react-i18next';

export default function Compact({ item, toggleFilterByIncidentId, viewType }) {
  const { t } = useTranslation();

  return (
    <Card className="h-[240px] hover:bg-black animate-all-0">
      <Card.Body className="flex flex-col relative p-0">
        <div className="pl-6 pr-6 pt-3 bg-[#000000b3] text-white bottom-0 absolute left-0 right-0 z-2 min-h-[40%]">
          <HeaderTitle
            item={item}
            viewType={viewType}
            className="text-base leading-4 text-white hover:opacity-90 max-h-[5em] overflow-hidden"
          />
          <SourceDomainSubtitle item={item} className="my-2 small text-gray-400 hover:opacity-90" />
        </div>

        <Image
          className="object-cover absolute z-0 w-full h-full bottom-0 left-0 rounded-t-lg"
          publicID={item.cloudinary_id ? item.cloudinary_id : `legacy/${md5(item.image_url)}`}
          alt={item.title}
          height={240}
          transformation={fill().height(240)}
          itemIdentifier={t('Report {{report_number}}', {
            report_number: item.report_number,
          }).replace(' ', '.')}
        />
      </Card.Body>

      <Card.Footer className="flex justify-between">
        <Actions toggleFilterByIncidentId={toggleFilterByIncidentId} item={item} />
      </Card.Footer>
    </Card>
  );
}
