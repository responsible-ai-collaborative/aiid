import React from 'react';
import { Highlight } from 'react-instantsearch-dom';
import styled from 'styled-components';
import md5 from 'md5';
import { Image } from 'utils/cloudinary';
import { fill } from '@cloudinary/base/actions/resize';
import { getParagraphs } from 'utils/typography';
import { useUserContext } from 'contexts/userContext';
import Actions from 'components/discover/Actions';

const IncidentCardContainer = styled.div`
  border: 1.5px solid #d9deee;
  border-radius: 5px;
  box-shadow: 0 2px 5px 0px #e3e5ec;
  display: flex;
  flex-direction: column;
  .subhead {
    margin: 0;
    opacity: 0.4;
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

const Text = styled.p`
  line-height: 1.3;
`;

const CardFooter = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`;

const cardNeedsBlockquote = (item) => {
  if (item.text && item.text.matchLevel === 'full') {
    return true;
  }
  return false;
};

const IncidentCard = ({ item, authorsModal, submittersModal, flagReportModal, showDetails }) => {
  const { isRole } = useUserContext();

  return (
    <IncidentCardContainer id={`r${item.mongodb_id}`}>
      <div className="card-header">
        <div className="d-flex justify-content-between">
          <a href={`#r${item.mongodb_id}`}>
            <span>{item.title}</span>
          </a>
          {isRole('incident_editor') && (
            <a data-cy="edit-report" href={`/cite/edit?reportNumber=${item.report_number}`}>
              edit
            </a>
          )}
        </div>
        <p className="subhead">
          {item.source_domain} &middot;{' '}
          {item.date_published ? item.date_published.substring(0, 4) : 'Needs publish date'}
        </p>
      </div>
      <CardBody className="card-body">
        {item._snippetResult && cardNeedsBlockquote(item._snippetResult) && (
          <blockquote>
            <Highlight
              hit={{
                _highlightResult: {
                  ...item._snippetResult,
                  text: {
                    ...item._snippetResult.text,
                    value: `...${item._snippetResult.text.value}...`,
                  },
                },
              }}
              attribute="text"
            />
          </blockquote>
        )}
        {showDetails ? (
          <div>{getParagraphs(item.text)}</div>
        ) : (
          <div>
            <Text>{item.text.substr(0, 400) + '...'}</Text>
          </div>
        )}
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
