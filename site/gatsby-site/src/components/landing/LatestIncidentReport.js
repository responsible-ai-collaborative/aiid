import React from 'react';
import styled from 'styled-components';
import md5 from 'md5';
import { format } from 'date-fns';
import { Image } from '../../utils/cloudinary';
import { fill } from '@cloudinary/base/actions/resize';
import Link from 'components/ui/Link';
import ReportText from 'components/reports/ReportText';
import { Trans } from 'react-i18next';
import Card from 'elements/Card';

const ThumbnailImg = styled(Image)`
  object-fit: cover;
  height: 100%;
  width: 100%;
`;

const LatestIncidentReport = ({ report }) => {
  const { image_url, cloudinary_id, title, text, epoch_date_submitted, incident_id } = report;

  return (
    <Card
      className={
        'border rounded-lg break-words flex flex-col md:flex-row break bg-white min-w-0 relative rounded-t-lg md:rounded-l-lg md:rounded-r-none '
      }
    >
      <div>
        <ThumbnailImg
          publicID={cloudinary_id ? cloudinary_id : `legacy/${md5(image_url)}`}
          transformation={fill().height(480)}
          alt={title}
        />
      </div>
      <div>
        <Card.Body>
          <Card.Title as="h5">
            <Link to={`/cite/${incident_id}`}>{title}</Link>
          </Card.Title>
          <Card.Subtitle>{format(epoch_date_submitted * 1000, 'MMM d, yyyy')}</Card.Subtitle>
          <Card.Text>
            <ReportText maxChars={240} text={text} />
            <Link to={`/cite/${incident_id}`}>
              (<Trans>Read More</Trans>)
            </Link>
          </Card.Text>
        </Card.Body>
      </div>
    </Card>
  );
};

export default LatestIncidentReport;
