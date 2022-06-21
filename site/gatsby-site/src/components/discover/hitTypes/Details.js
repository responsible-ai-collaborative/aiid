import React from 'react';
import { Card } from 'react-bootstrap';
import { Image } from 'utils/cloudinary';
import styled from 'styled-components';
import { fill } from '@cloudinary/base/actions/resize';

import md5 from 'md5';
import { navigate } from 'gatsby';
import Actions from '../Actions';
import ReportText from 'components/reports/ReportText';
import useLocalizePath from 'components/i18n/useLocalizePath';

import { SourceDomainSubtitle, HeaderTitle } from './shared';

const IncidentCardImage = styled(Image)`
  height: ${({ height }) => height};
  object-fit: cover;
  width: 100%;
`;

const StyledLabel = styled.p`
  margin: 0.6em 0;
`;

export default function Details({
  item,
  authorsModal,
  submittersModal,
  flagReportModal,
  toggleFilterByIncidentId,
}) {
  const localizePath = useLocalizePath();

  return (
    <Card className="h-100" data-cy={item.mongodb_id}>
      <a href={'/cite/' + item.incident_id + '#r' + item.objectID}>
        <IncidentCardImage
          className="card-img-top"
          publicID={item.cloudinary_id ? item.cloudinary_id : `legacy/${md5(item.image_url)}`}
          alt={item.title}
          height="240px"
          transformation={fill().height(480)}
        />
      </a>
      <Card.Body className="d-flex flex-column ">
        <HeaderTitle item={item} />

        <SourceDomainSubtitle item={item} className="mb-2 text-muted" />

        <Card.Text className="flex-fill">
          <ReportText text={item.text} maxChars={400} />
        </Card.Text>

        <div className="align-bottom">
          {toggleFilterByIncidentId && (
            <button
              type="button"
              className="btn btn-secondary btn-sm w-100"
              onClick={() => {
                const path = localizePath({
                  path: `/cite/${item.incident_id}#r${item.mongodb_id}`,
                });

                navigate(path);
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
