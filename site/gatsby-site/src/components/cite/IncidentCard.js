import React from 'react';
import styled from 'styled-components';
import md5 from 'md5';
import { Image } from 'utils/cloudinary';
import { fill } from '@cloudinary/base/actions/resize';
import { getParagraphs } from 'utils/typography';
import { useUserContext } from 'contexts/userContext';
import Actions from 'components/discover/Actions';
import { Button, Card } from 'react-bootstrap';

const IncidentCardImage = styled(Image)`
  height: 480px;
  object-fit: cover;
  width: 100%;
`;

const ImageContainer = styled.div`
  height: 480px;
`;

const IncidentCard = ({ item, authorsModal, submittersModal, flagReportModal }) => {
  const { isRole } = useUserContext();

  return (
    <Card id={`r${item.mongodb_id}`}>
      <Card.Body>
        <Card.Title as="h2" className="d-flex justify-content-between">
          <a className="link-dark" href={`#r${item.mongodb_id}`}>
            {item.title}
          </a>
          {isRole('incident_editor') && (
            <Button
              className="text-nowrap"
              variant="link"
              data-cy="edit-report"
              href={`/cite/edit?reportNumber=${item.report_number}`}
            >
              Edit Report
            </Button>
          )}
        </Card.Title>

        <Card.Subtitle>
          {item.source_domain} &middot;{' '}
          {item.date_published ? item.date_published.substring(0, 4) : 'Needs publish date'}
        </Card.Subtitle>

        <Card.Text className="mt-4">{getParagraphs(item.text)}</Card.Text>
      </Card.Body>

      <div className="align-bottom">
        <ImageContainer>
          <IncidentCardImage
            publicID={item.cloudinary_id ? item.cloudinary_id : `legacy/${md5(item.image_url)}`}
            alt={item.title}
            transformation={fill().height(480)}
          />
        </ImageContainer>
      </div>

      <Card.Footer className="d-flex justify-content-around">
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
