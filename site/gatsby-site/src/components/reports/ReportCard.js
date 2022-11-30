import React from 'react';
import md5 from 'md5';
import { Image } from 'utils/cloudinary';
import { fill } from '@cloudinary/base/actions/resize';
import { useUserContext } from 'contexts/userContext';
import Actions from 'components/discover/Actions';
import ReportText from 'components/reports/ReportText';
import Card from '../../elements/Card';
import WebArchiveLink from 'components/ui/WebArchiveLink';
import TranslationBadge from 'components/i18n/TranslationBadge';
import { Badge } from 'flowbite-react';
import { RESPONSE_TAG } from 'utils/entities';
import { Trans } from 'react-i18next';

const ReportCard = ({ item, className }) => {
  const { isRole, loading } = useUserContext();

  const authors = item.authors.join(', ');

  return (
    <Card id={`r${item.report_number}`} className={`shadow-card IncidentCard ${className}`}>
      <Card.Header className="flex-col">
        <div className="flex justify-between">
          <a href={`#r${item.report_number}`}>
            <span>{item.title}</span>
          </a>
          {!loading && isRole('incident_editor') && (
            <a data-cy="edit-report" href={`/cite/edit?report_number=${item.report_number}`}>
              Edit
            </a>
          )}
        </div>
        <div className="m-0 pt-2.5 flex flex-wrap">
          <WebArchiveLink url={item.url} className="text-dark-gray">
            {item.source_domain} &middot;{' '}
            {item.date_published ? item.date_published.substring(0, 4) : 'Needs publish date'}
          </WebArchiveLink>
          <div className="flex ">
            <TranslationBadge className="mx-2" originalLanguage={item.language} />
            {item.tags && item.tags.includes(RESPONSE_TAG) && (
              <div className="flex-1">
                <Badge color={'success'}>
                  <Trans>{{ authors }} post-incident response</Trans>
                </Badge>
              </div>
            )}
          </div>
        </div>
      </Card.Header>
      <Card.Body className="flex-col">
        <ReportText text={item.text} />
      </Card.Body>
      <div className="align-bottom">
        <div className="h-[480px]">
          <Image
            className="h-[480px] object-cover w-full"
            publicID={item.cloudinary_id ? item.cloudinary_id : `legacy/${md5(item.image_url)}`}
            alt={item.title}
            transformation={fill().height(480)}
          />
        </div>
      </div>
      <Card.Footer className="flex w-full flex-row justify-around items-center text-dark-gray">
        <Actions item={item} />
      </Card.Footer>
    </Card>
  );
};

export default ReportCard;
