import React, { useEffect, useState } from 'react';
import AiidHelmet from 'components/AiidHelmet';
import { graphql } from 'gatsby';
import Link from 'components/ui/Link';
import { hasVariantData } from 'utils/variants';
import { Button } from 'flowbite-react';

const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

const ReportList = ({ items }) => {
  return (
    <ul className="pl-8 leading-6 my-4 list-revert">
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
    <div data-cy="incident-list">
      {incidents.map((incident) => (
        <div key={incident.incident_id} data-cy={`incident-${incident.incident_id}`}>
          <h2>Incident {incident.incident_id} </h2>
          <div className="flex gap-2 mb-2">
            <Button href={'/cite/' + incident.incident_id}>Citation</Button>
            <Button href={'/apps/discover?incident_id=' + incident.incident_id}>Discover</Button>
          </div>
          <div className="text-xl">“{incident.title}”</div>
          <ReportList items={incident.reports} />
        </div>
      ))}
    </div>
  );
};

export default function Incidents({ data, ...props }) {
  const [sortOrder, setSortOrder] = useState(SORT_ORDER.DESC); // Descending order by default

  const [sortedIncidents, setSortedIncidents] = useState([]);

  useEffect(() => {
    const incidents = [...data.allMongodbAiidprodIncidents.nodes]; // Copy the incidents array

    incidents.sort((a, b) => {
      if (sortOrder === SORT_ORDER.ASC) {
        return a.incident_id - b.incident_id;
      } else {
        return b.incident_id - a.incident_id;
      }
    });

    setSortedIncidents(incidents);
  }, [sortOrder, data]);

  return (
    <>
      <AiidHelmet path={props.location.pathname}>
        <title>Incident List</title>
      </AiidHelmet>
      <div className={'titleWrapper'}>
        <h1>Incident List</h1>
      </div>
      <div className="styled-main-wrapper">
        <p>
          This is a simple numeric listing of all incidents and their reports within the database.
          If you would like to explore the contents of the reports, you should work through the
          <Link to="/apps/discover"> Discover app</Link>.
        </p>
        <div className="flex gap-2 mb-5">
          <div className="font-medium">Sort by incident ID:</div>
          <button
            className={`text-blue-600 cursor-pointer disabled:cursor-default disabled:text-gray-600 no-underline ${
              sortOrder === SORT_ORDER.ASC ? 'font-bold' : ''
            }`}
            onClick={() => setSortOrder(SORT_ORDER.ASC)}
            disabled={sortOrder === SORT_ORDER.ASC}
          >
            ascending
          </button>
          |
          <button
            className={`text-blue-600 cursor-pointer disabled:cursor-default disabled:text-gray-600 no-underline ${
              sortOrder === SORT_ORDER.DESC ? 'font-bold' : ''
            }`}
            onClick={() => setSortOrder(SORT_ORDER.DESC)}
            disabled={sortOrder === SORT_ORDER.DESC}
          >
            descending
          </button>
        </div>
        <IncidentList incidents={sortedIncidents} />
      </div>
    </>
  );
}

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
