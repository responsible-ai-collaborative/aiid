import React from 'react';
import md5 from 'md5';
import { Image } from 'utils/cloudinary';
import { fill } from '@cloudinary/base/actions/resize';
import { useUserContext } from 'contexts/userContext';
import Actions from 'components/discover/Actions';
import ReportText from 'components/reports/ReportText';
import Card from '../../elements/Card';

const IncidentCard = ({ item, authorsModal, submittersModal, flagReportModal }) => {
  const { isRole } = useUserContext();

  return (
    <Card id={`r${item.mongodb_id}`}>
      <Card.Header className="tw-flex-col">
        <div className="tw-flex tw-justify-between">
          <a href={`#r${item.mongodb_id}`}>
            <span>{item.title}</span>
          </a>
          {isRole('incident_editor') && (
            <a data-cy="edit-report" href={`/cite/edit?report_number=${item.report_number}`}>
              Edit
            </a>
          )}
        </div>
        <p className="tw-m-0 tw-opacity-40 tw-pt-2.5">
          {item.source_domain} &middot;{' '}
          {item.date_published ? item.date_published.substring(0, 4) : 'Needs publish date'}
        </p>
      </Card.Header>
      <Card.Body>
        <ReportText text={item.text} />
      </Card.Body>
      <div className="tw-align-bottom">
        <div className="tw-h-[480px]">
          <Image
            className="tw-h-[480px] tw-object-cover tw-w-full"
            publicID={item.cloudinary_id ? item.cloudinary_id : `legacy/${md5(item.image_url)}`}
            alt={item.title}
            transformation={fill().height(480)}
          />
        </div>
      </div>
      <Card.Footer className="tw-flex tw-w-full tw-flex-row tw-justify-around tw-items-center tw-text-dark-grey">
        <Actions
          item={item}
          authorsModal={authorsModal}
          flagReportModal={flagReportModal}
          submittersModal={submittersModal}
        />
      </Card.Footer>
    </Card>
  );
};

export default IncidentCard;
