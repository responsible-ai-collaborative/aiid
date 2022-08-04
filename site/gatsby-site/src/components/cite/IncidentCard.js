import React from 'react';
import styled from 'styled-components';
import md5 from 'md5';
import { Image } from 'utils/cloudinary';
import { fill } from '@cloudinary/base/actions/resize';
import { useUserContext } from 'contexts/userContext';
import Actions from 'components/discover/Actions';
import ReportText from 'components/reports/ReportText';
import WebArchiveLink from 'components/ui/WebArchiveLink';
import TranslationBadge from 'components/i18n/TranslationBadge';

const IncidentCardContainer = styled.div`
  border: 1.5px solid #d9deee;
  border-radius: 5px;
  box-shadow: 0 2px 5px 0px #e3e5ec;
  display: flex;
  flex-direction: column;
  .subhead {
    color: var(--bs-gray-600);
    a:not(:hover) {
      color: inherit;
    }
    margin: 0;
    padding-top: 10px;
  }
`;

const IncidentCardImage = styled(Image)`
  height: 480px;
  object-fit: cover;
  width: 100%;
`;

const ImageContainer = styled.div`
  height: 480px;
`;

const CardBody = styled.div`
  padding: 1.25rem 1.25rem 0 1.25rem !important;
`;

const CardFooter = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`;

const IncidentCard = ({ item, authorsModal, submittersModal, flagReportModal }) => {
  const { isRole } = useUserContext();

  return (
    <IncidentCardContainer id={`r${item.report_number}`}>
      <div className="card-header">
        <div className="d-flex justify-content-between">
          <a href={`#r${item.report_number}`}>
            <span>{item.title}</span>
          </a>
          {isRole('incident_editor') && (
            <a data-cy="edit-report" href={`/cite/edit?report_number=${item.report_number}`}>
              Edit
            </a>
          )}
        </div>
        <p className="subhead">
          <WebArchiveLink url={item.url}>
            {item.source_domain} &middot;{' '}
            {item.date_published ? item.date_published.substring(0, 4) : 'Needs publish date'}
          </WebArchiveLink>
          <TranslationBadge className="mx-2" originalLanguage={item.language} />
        </p>
      </div>
      <CardBody className="card-body">
        <ReportText text={item.text} />
      </CardBody>
      <div className="align-bottom">
        <ImageContainer>
          <IncidentCardImage
            publicID={item.cloudinary_id ? item.cloudinary_id : `legacy/${md5(item.image_url)}`}
            alt={item.title}
            transformation={fill().height(480)}
          />
        </ImageContainer>
      </div>
      <CardFooter className="card-footer text-muted">
        <Actions
          item={item}
          authorsModal={authorsModal}
          flagReportModal={flagReportModal}
          submittersModal={submittersModal}
        />
      </CardFooter>
    </IncidentCardContainer>
  );
};

export default IncidentCard;
