import React, { useEffect, useState } from 'react';
import HeadContent from 'components/HeadContent';
import { graphql } from 'gatsby';
import Link from 'components/ui/Link';
import { hasVariantData } from 'utils/variants';
import { Button } from 'flowbite-react';
import ListSkeleton from 'elements/Skeletons/List';
import { Trans, useTranslation } from 'react-i18next';
import Card from 'elements/Card';

const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

const ReportList = ({ items }) => {
  return (
    <ul className="pl-8 leading-6 mt-4 list-revert">
      {items
        .filter((report) => !hasVariantData(report))
        .map((report) => (
          <li key={report.report_number} data-cy={`report-${report.report_number}`}>
            <a href={report.url}>{report.title}</a>
          </li>
        ))}
    </ul>
  );
};

const IncidentList = ({ incidents }) => {
  return (
    <div data-cy="incident-list" className="space-y-4">
      {incidents.map((incident) => (
        <Card
          key={incident.incident_id}
          data-cy={`incident-${incident.incident_id}`}
          className="p-4"
        >
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-gray-900">
              <Link to={'/cite/' + incident.incident_id} className="hover:text-blue-600">
                <Trans>Incident</Trans> {incident.incident_id}{' '}
              </Link>
            </h2>
            <div className="flex gap-2">
              <Button
                color={'light'}
                href={'/apps/discover?incident_id=' + incident.incident_id}
                className="text-sm"
              >
                <Trans>Discover</Trans>
              </Button>
            </div>
          </div>
          <div className="text-base text-gray-700 italic">&ldquo;{incident.title}&rdquo;</div>
          <ReportList items={incident.reports} />
        </Card>
      ))}
    </div>
  );
};

export default function Incidents({ data }) {
  const [sortOrder, setSortOrder] = useState(SORT_ORDER.DESC); // Descending order by default

  const [sortedIncidents, setSortedIncidents] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const incidents = [...data.allMongodbAiidprodIncidents.nodes];

    incidents.sort((a, b) => {
      if (sortOrder === SORT_ORDER.ASC) {
        return a.incident_id - b.incident_id;
      } else {
        return b.incident_id - a.incident_id;
      }
    });

    setSortedIncidents(incidents);
    setIsLoading(false);
  }, [sortOrder, data]);

  return (
    <>
      <div className={'titleWrapper'}>
        <h1>
          <Trans ns="incidents">Incident List</Trans>
        </h1>
      </div>
      <div className="styled-main-wrapper">
        <p>
          <Trans ns="incidents">
            This is a simple numeric listing of all incidents and their reports within the database.
            If you would like to explore the contents of the reports, you should work through the
            <Link to="/apps/discover"> Discover app</Link>.
          </Trans>
        </p>
        <div className="flex gap-2 mb-5">
          <div className="font-medium">
            <Trans ns="incidents">Sort by incident ID</Trans>:
          </div>
          <button
            className={`text-blue-600 cursor-pointer disabled:cursor-default disabled:text-gray-600 no-underline ${
              sortOrder === SORT_ORDER.ASC ? 'font-bold' : ''
            }`}
            onClick={() => setSortOrder(SORT_ORDER.ASC)}
            disabled={sortOrder === SORT_ORDER.ASC}
            data-cy="sort-ascending-button"
          >
            <Trans ns="incidents">ascending</Trans>
          </button>
          |
          <button
            className={`text-blue-600 cursor-pointer disabled:cursor-default disabled:text-gray-600 no-underline ${
              sortOrder === SORT_ORDER.DESC ? 'font-bold' : ''
            }`}
            onClick={() => setSortOrder(SORT_ORDER.DESC)}
            disabled={sortOrder === SORT_ORDER.DESC}
            data-cy="sort-descending-button"
          >
            <Trans ns="incidents">descending</Trans>
          </button>
        </div>
        {isLoading && <ListSkeleton />}
        {!isLoading && <IncidentList incidents={sortedIncidents} />}
      </div>
    </>
  );
}

export const Head = (props) => {
  const {
    location: { pathname },
  } = props;

  const { t } = useTranslation('incidents');

  const metaTitle = t('Incident List', { ns: 'incidents' });

  const metaDescription = t('Summary of all the incidents present in the database', {
    ns: 'incidents',
  });

  return <HeadContent path={pathname} metaTitle={metaTitle} metaDescription={metaDescription} />;
};

export const pageQuery = graphql`
  query AllIncidentsPart {
    allMongodbAiidprodIncidents {
      nodes {
        incident_id
        title
        date
        reports {
          report_number
          title
          url
          inputs_outputs
        }
      }
    }
  }
`;
