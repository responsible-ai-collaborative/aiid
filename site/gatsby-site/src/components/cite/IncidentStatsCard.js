import React, { Fragment } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import Card from '../../elements/Card';

const IncidentStatsCard = ({
  incidentId,
  reportCount,
  incidentDate,
  editors,
  taxonomiesWithClassifications,
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
    <Card
      data-cy="citation"
      className="flex flex-col shadow-card rounded-5px border-border-light-gray border-1.5"
    >
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

        <div className="pr-4 my-0.5">Applied Taxonomies</div>
        <div>
          {taxonomiesWithClassifications.map((t, i) => {
            const color = { CSETv1: 'orange', GMF: 'blue' }[t] || 'gray';

            return (
              <>
                {i > 0 && ', '}
                <a
                  href={`#${t}-classifications`}
                  className={`
                  inline-block  px-2.5 py-0.5 rounded
                  font-semibold text-xs
                  bg-${color}-200 text-${color}-800
                `}
                >
                  {t}
                </a>
              </>
            );
          })}
        </div>
      </Card.Body>
    </Card>
  );
};

export default IncidentStatsCard;
