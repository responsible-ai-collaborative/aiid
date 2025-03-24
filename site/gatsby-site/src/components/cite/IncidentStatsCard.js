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
      <div className="p-0 m-0 grid max-w-full grid-cols-2 lg:grid-cols-1fr-3fr [&>*:nth-child(4n)]:bg-gray-50">
        {STATS.map((stat, i) => (
          <Fragment key={stat.key}>
            <div
              className={`p-4 bg-gray-100 border-1 ${i == 0 ? 'border-t-0' : ''} border-gray-200`}
            >
              {stat.label}
            </div>
            <div
              className={`p-4 border-1 ${i == 0 ? 'border-t-0' : ''} border-gray-200`}
              data-testid={stat.label}
            >
              {stats[stat.key]}
            </div>
          </Fragment>
        ))}

        {taxonomiesWithClassifications.length > 0 && (
          <>
            <div className={`p-4 bg-gray-100 border-1 border-gray-200  rounded-bl`}>
              Applied Taxonomies
            </div>
            <div className={`p-4 border-1 border-gray-200 border-b-0 rounded-br`}>
              {taxonomiesWithClassifications
                .filter((t) => !t.includes('_Annotator,'))
                .map((t, i) => {
                  const taxonomyStyle =
                    {
                      CSETv1: 'text-orange-800 bg-orange-200',
                      GMF: 'text-blue-800 bg-blue-200',
                      MIT: 'text-[#760216] bg-gray-100', // "MIT Red" https://brand.mit.edu/color
                    }[t] || 'text-gray-800 bg-gray-200';

                  return (
                    <>
                      {i > 0 && ', '}
                      <a
                        data-cy={`taxonomy-tag-${t}`}
                        href={`#${t}-classifications`}
                        className={`
                        inline-block  px-2.5 py-0.5 rounded
                        font-semibold text-xs
                        ${taxonomyStyle}
                      `}
                      >
                        {t}
                      </a>
                    </>
                  );
                })}
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

export default IncidentStatsCard;
