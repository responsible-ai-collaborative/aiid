import React, { useState } from 'react';
import MultiLineChart from 'components/visualizations/MultiLineChart';
import AiidHelmet from 'components/AiidHelmet';
import Layout from 'components/Layout';
import { graphql } from 'gatsby';
import { TextInput, Label } from 'flowbite-react';
import { format } from 'date-fns';

const countByDate = (items, series, startDate) =>
  items.reduce((points, item, i) => {
    const date = new Date(Date.parse(item.date_submitted));

    const newPoint = { date, count: i + 1, series };

    const previous = points[points.length - 1];

    if (date < startDate) {
      return [{ ...newPoint, date: startDate }];
    }

    if (previous && date.valueOf() == previous.date.valueOf()) {
      return points.slice(0, points.length - 1).concat([newPoint]);
    }

    return points.concat([newPoint]);
  }, []);

export default function IncidentsOverTimePage({ data, ...props }) {
  const metaTitle = 'Incidents Over Time';

  const [startDate, setStartDate] = useState(new Date(2020, 10, 7));

  const [startAtZero, setStartAtZero] = useState(false);

  const incidentsByDate = data.allMongodbAiidprodIncidents.nodes
    .map((incident) => {
      const reports = data.allMongodbAiidprodReports.nodes.filter((report) =>
        incident.reports.includes(report.report_number)
      );

      const earliestReport = reports.sort((a, b) => a.date_submitted - b.date_submitted)[0];

      return {
        ...incident,
        date_submitted: earliestReport.date_submitted,
      };
    })
    .sort((a, b) => Date.parse(a.date_submitted) - Date.parse(b.date_submitted));

  const incidentsData = countByDate(incidentsByDate, 'incidents', startDate);

  const reportsData = countByDate(data.allMongodbAiidprodReports.nodes, 'reports', startDate);

  const params = {
    x: (d) => d.date,
    y: (d) => d.count,
    z: (d) => d.series,
    title: (d) => format(d.date, 'yyyy-MM-dd') + ' – ' + d.count + ' ' + d.series,
    width: 500,
    height: 500,
    color: (z) => ({ incidents: '#021b35', reports: '#ec9982' }[z]),
    xDomain: [startDate.valueOf(), new Date().valueOf()],
    startAtZero,
    //voronoi: true, // if true, show Voronoi overlay
  };

  return (
    <Layout {...props}>
      <AiidHelmet {...{ metaTitle }} path={props.location.pathname}>
        <meta property="og:type" content="website" />
      </AiidHelmet>

      <div className={'titleWrapper'}>
        <h1 className="tw-styled-heading">{metaTitle}</h1>
      </div>
      <div className="flex flex-wrap md:flex-nowrap">
        <MultiLineChart
          id="test-chart"
          data={reportsData}
          params={{ ...params, yLabel: '', chartTitle: 'Reports' }}
        />
        <MultiLineChart
          id="incidents-chart"
          data={incidentsData}
          params={{ ...params, modSize: 50, yLabel: '', chartTitle: 'Incidents' }}
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="from-date" value="From" />
          <TextInput
            type="date"
            id="from-date"
            value={format(startDate, 'yyyy-MM-dd')}
            onChange={(evt) => {
              setStartDate(Date.parse(evt.target.value));
            }}
            onKeyPress={(e) => {
              e.preventDefault();
            }}
          />
        </div>
        <div className="flex gap-2 items-center">
          <input
            type="checkbox"
            id="start-at-zero"
            className="rounded grow-0 inline"
            onChange={() => {
              setStartAtZero(!startAtZero);
            }}
          />
          <Label htmlFor="start-at-zero">y-axis starts at zero</Label>
        </div>
      </div>
    </Layout>
  );
}

export const pageQuery = graphql`
  query IncidentsOverTime {
    allMongodbAiidprodIncidents {
      nodes {
        incident_id
        title
        date
        reports
      }
    }

    allMongodbAiidprodReports(sort: { order: ASC, fields: date_submitted }, limit: 9999) {
      nodes {
        report_number
        title
        url
        authors
        date_downloaded
        date_modified
        date_published
        date_submitted
        description
        flag
        image_url
        language
        source_domain
        submitters
      }
    }
  }
`;
