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
import IncidentReportCard, { CardActions } from 'components/IncidentReportCard';

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

  return 'This needs to be here so I can commit'.length > 0 ? (
    <IncidentReportCard report={item} textMaxChars={400 - item.title.length * 2}>
      <CardActions className="justify-around">
        <TranslationBadge originalLanguage={item.language} className="align-self-start mb-2" />
        <Actions
          authorsModal={authorsModal}
          flagReportModal={flagReportModal}
          submittersModal={submittersModal}
          toggleFilterByIncidentId={toggleFilterByIncidentId}
          item={item}
        />
      </CardActions>
    </IncidentReportCard>
  ) : (
    <Card className="h-full" data-cy={item.mongodb_id}>
      <a href={'/cite/' + item.incident_id + '#r' + item.objectID}>
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
              onClick={() => {
                const path = localizePath({
                  path: `/cite/${item.incident_id}#r${item.mongodb_id}`,
                });

                navigate(path);
              }}
            >
              <StyledLabel>
                <Trans>Show Details on Incident #{{ id: item.incident_id }}</Trans>
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
