import React from 'react';
import MultiLineChart from 'components/visualizations/MultiLineChart';
import AiidHelmet from 'components/AiidHelmet';
import Layout from 'components/Layout';
import { graphql } from 'gatsby';

const countByDate = (items, series, startDate) =>
  items.reduce((points, item, i) => {
    if (series == 'incidents') {
      console.log(item);
    }
    const date = new Date(Date.parse(item.date_submitted));

    if (date < startDate) {
      if (series == 'incidents') {
        console.log('date', date, 'is less than startDate', startDate);
      }
      return [{ date: startDate, count: i + 1, series }];
    }
    const result = points.concat([{ date, count: i + 1, series }]);

    if (series == 'incidents') {
      console.log(`result`, result);
    }

    return result;
  }, []);

export default function IncidentsOverTimePage({ data, ...props }) {
  const metaTitle = 'Incidents Over Time';

  const startDate = new Date(2022, 2, 28);

  console.log(`data.allMongodbAiidprodIncidents`, data.allMongodbAiidprodIncidents);

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

  console.log(`incidentsByDate`, incidentsByDate);

  const incidentsData = countByDate(incidentsByDate, 'incidents', startDate);

  console.log(`incidentsData`, incidentsData);

  const reportsData = countByDate(data.allMongodbAiidprodReports.nodes, 'reports', startDate);

  console.log(`reportsData`, reportsData);

  const params = {
    x: (d) => d.date,
    y: (d) => d.count,
    z: (d) => d.series,
    title: (d) => d.count + ' ' + d.series,
    width: 500,
    height: 500,
    color: (z) => ({ incidents: '#021b35', reports: '#ec9982' }[z]),
    xDomain: [startDate.valueOf(), new Date().valueOf()],
    //voronoi: true, // if true, show Voronoi overlay
  };

  console.log(`params.yDomain`, params.yDomain);

  return (
    <Layout {...props}>
      <AiidHelmet {...{ metaTitle }}>
        <meta property="og:type" content="website" />
      </AiidHelmet>

      <div className={'titleWrapper'}>
        <h1 className="tw-styled-heading">{metaTitle}</h1>
      </div>
      <div className="flex">
        <MultiLineChart
          id="test-chart"
          data={reportsData}
          params={{ ...params, yDomain: [1400, 2100], yLabel: 'Reports' }}
        />
        <MultiLineChart
          id="incidents-chart"
          data={incidentsData}
          params={{ ...params, yDomain: [175, 350], yLabel: 'Incidents' }}
        />
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
        ref_number
        source_domain
        submitters
      }
    }
  }
`;
