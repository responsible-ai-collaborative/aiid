import React from 'react';
import { Image } from 'utils/cloudinary';
import styled from 'styled-components';
import { fill } from '@cloudinary/base/actions/resize';

import md5 from 'md5';
import { navigate } from 'gatsby';
import Actions from '../Actions';
import ReportText from 'components/reports/ReportText';
import useLocalizePath from 'components/i18n/useLocalizePath';

import { SourceDomainSubtitle, HeaderTitle } from './shared';
import { Trans } from 'react-i18next';
import TranslationBadge from 'components/i18n/TranslationBadge';
import Card from 'elements/Card';

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

  const detailsPath = item.is_incident_report
    ? localizePath({
        path: `/cite/${item.incident_id}#r${item.objectID}`,
      })
    : localizePath({
        path: `/reports/${item.report_number}`,
      });

  return (
    <Card className="h-full" data-cy={item.mongodb_id}>
      <a href={detailsPath}>
        <IncidentCardImage
          className="card-img-top"
          publicID={item.cloudinary_id ? item.cloudinary_id : `legacy/${md5(item.image_url)}`}
          alt={item.title}
          height="240px"
          transformation={fill().height(480)}
        />
      </a>
      <Card.Body className="flex flex-col ">
        <HeaderTitle item={item} />
        <SourceDomainSubtitle item={item} className="mb-2 text-muted-gray" />

        <Card.Text className="flex-1-1-auto mb-4">
          <TranslationBadge originalLanguage={item.language} className="align-self-start mb-2" />
          <ReportText text={item.text} maxChars={400} />
        </Card.Text>

        <div className="align-bottom">
          {toggleFilterByIncidentId && (
            <button
              type="button"
              className="btn btn-secondary btn-sm w-full text-sm"
              onClick={() => navigate(detailsPath)}
            >
              <StyledLabel>
                {item.is_incident_report ? (
                  <Trans>Show Details on Incident #{{ id: item.incident_id }}</Trans>
                ) : (
                  <Trans>Show Details on Issue #{{ id: item.report_number }}</Trans>
                )}
              </StyledLabel>
            </button>
          )}
        </div>
      </Card.Body>

      <Card.Footer className="flex justify-between">
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
