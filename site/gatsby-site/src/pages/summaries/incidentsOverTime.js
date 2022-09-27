import React from 'react';
import MultiLineChart from 'components/visualizations/MultiLineChart';
import AiidHelmet from 'components/AiidHelmet';
import Layout from 'components/Layout';
import { graphql } from 'gatsby';

export default function IncidentsOverTimePage(props) {
  const metaTitle = 'Incidents Over Time';

  return (
    <Layout {...props}>
      <AiidHelmet {...{ metaTitle }}>
        <meta property="og:type" content="website" />
      </AiidHelmet>

      <div className={'titleWrapper'}>
        <h1 className="tw-styled-heading">{metaTitle}</h1>
      </div>
      <MultiLineChart
        id="test-chart"
        data={[
          {
            series: 'incidents',
            date: new Date(1999, 0, 1),
            count: 10,
          },
          {
            series: 'incidents',
            date: new Date(2005, 0, 1),
            count: 20,
          },
          {
            series: 'incidents',
            date: new Date(2020, 0, 1),
            count: 45,
          },
          {
            series: 'reports',
            date: new Date(1999, 0, 1),
            count: 21,
          },
          {
            series: 'reports',
            date: new Date(2005, 0, 1),
            count: 38,
          },
          {
            series: 'reports',
            date: new Date(2020, 0, 1),
            count: 67,
          },
        ]}
        params={{
          x: (d) => d.date,
          y: (d) => d.count,
          z: (d) => d.series,
          title: (d) => d.count + ' ' + d.series,
          yLabel: 'Incidents',
          width: 500,
          height: 500,
          color: (z) => ({ incidents: '#021b35', reports: '#ec9982' }[z]),
          xDomain: [new Date(1995, 0, 1).valueOf(), new Date(2022, 0, 1).valueOf()],
          yDomain: [0, 70],
          //voronoi: true, // if true, show Voronoi overlay
        }}
      />
    </Layout>
  );
}

export const pageQuery = graphql`
  query IncidentsOverTime {
    allMongodbAiidprodIncidents(sort: { order: ASC, fields: incident_id }) {
      nodes {
        incident_id
        title
        date
        reports
      }
    }

    allMongodbAiidprodReports(filter: { flag: { eq: true } }) {
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
