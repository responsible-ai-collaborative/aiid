import React, { Fragment } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import Card from '../../elements/Card';
import Citation from './Citation';

const IncidentStatsCard = ({
  incidentId,
  reportCount,
  incidentDate,
  editors,
  suggestedCitationFormat,
}) => {
  const { t } = useTranslation();

  const STATS = [
    {
      key: 'incidentId',
      label: t('Incident ID'),
    },
    {
      key: 'reportCount',
      label: t('Report Count'),
    },
    {
      key: 'incidentDate',
      label: t('Incident Date'),
    },
    {
      key: 'editors',
      label: t('Editors'),
    },
  ];

  if (reportCount === 0) {
    return null;
  }

  const stats = {
    incidentId,
    reportCount,
    incidentDate,
    editors,
  };

  return (
    <Card className="flex flex-col shadow-card rounded-5px border-border-light-gray border-1.5">
      <Card.Header>
        <h4 className="m-0">
          <Trans>Incident Stats</Trans>
        </h4>
      </Card.Header>
      <Card.Body className="grid max-w-full p-5 grid-cols-2 lg:grid-cols-1fr-3fr">
        {STATS.map((stat) => (
          <Fragment key={stat.key}>
            <div className="pr-4 my-0.5">{stat.label}</div>
            <div>{stats[stat.key]}</div>
          </Fragment>
        ))}
        <Fragment key={``}>
          <div className="pr-4 my-0.5">
            <Trans>Suggested citation format</Trans>
          </div>
          <div>
            <Citation
              nodes={suggestedCitationFormat.nodes}
              incidentDate={suggestedCitationFormat.incidentDate}
              incident_id={suggestedCitationFormat.incident_id}
              editors={suggestedCitationFormat.editors}
            />
          </div>
        </Fragment>
      </Card.Body>
    </Card>
  );
};

export default IncidentStatsCard;
