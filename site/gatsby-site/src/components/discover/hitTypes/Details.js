import React from 'react';
import { Card } from 'react-bootstrap';
import { Highlight, Snippet } from 'react-instantsearch-dom';
import { Image } from 'utils/cloudinary';
import styled from 'styled-components';
import { fill } from '@cloudinary/base/actions/resize';

import md5 from 'md5';
import { navigate } from 'gatsby';
import Actions from '../Actions';

const IncidentCardImage = styled(Image)`
  height: ${({ height }) => height};
  object-fit: cover;
  width: 100%;
`;

const StyledLabel = styled.p`
  margin: 0.6em 0;
`;

const TitleHighlight = styled(Highlight)`
  font-weight: bold;
`;

export default function Details({
  item,
  authorsModal,
  submittersModal,
  flagReportModal,
  toggleFilterByIncidentId,
}) {
  return (
    <Card className="h-100" data-cy={item.mongodb_id}>
      <IncidentCardImage
        className="card-img-top"
        publicID={item.cloudinary_id ? item.cloudinary_id : `legacy/${md5(item.image_url)}`}
        alt={item.title}
        height="240px"
        transformation={fill().height(480)}
      />
      <Card.Body className="d-flex flex-column ">
        <Card.Title>
          <TitleHighlight hit={item} attribute="title" />
        </Card.Title>

        <Card.Subtitle className="mb-2 text-muted">
          {item.source_domain} &middot;{' '}
          {item.date_published ? item.date_published.substring(0, 4) : 'Needs publish date'}
        </Card.Subtitle>

        {item._snippetResult.text.matchLevel === 'full' && (
          <blockquote className="mt-4">
            <Snippet attribute="text" hit={item} />
          </blockquote>
        )}

        <Card.Text className="flex-fill">{item.text.substr(0, 400) + '...'}</Card.Text>

        <div className="align-bottom">
          {toggleFilterByIncidentId && (
            <button
              type="button"
              className="btn btn-secondary btn-sm w-100"
              onClick={() => {
                navigate(`/cite/${item.incident_id}#r${item.mongodb_id}`);
              }}
            >
              <StyledLabel>Show Details on Incident #{item.incident_id}</StyledLabel>
            </button>
          )}
        </div>
      </Card.Body>

      <Card.Footer className="d-flex justify-content-between">
        <Actions
          authorsModal={authorsModal}
          flagReportModal={flagReportModal}
          submittersModal={submittersModal}
          toggleFilterByIncidentId={toggleFilterByIncidentId}
          item={item}
        />
      </Card.Footer>
    </Card>
  );
}
