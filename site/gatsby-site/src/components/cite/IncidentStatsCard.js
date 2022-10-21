import React, { Fragment } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import Card from '../../elements/Card';

const IncidentStatsCard = ({ incidentId, reportCount, incidentDate, editors }) => {
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
    <Card className="tw-incident-stat-card">
      <Card.Header>
        <h4 className="m-0">
          <Trans>Incident Stats</Trans>
        </h4>
      </Card.Header>
      <Card.Body className="grid max-w-full p-5 grid-cols-2 lg:grid-cols-1fr-3fr items-center">
        {STATS.map((stat) => (
          <Fragment key={stat.key}>
            <div className="pr-4 my-0.5">{stat.label}</div>
            <div>{stats[stat.key]}</div>
          </Fragment>
        ))}
      </Card.Body>
    </Card>
  );
};

export default IncidentStatsCard;
