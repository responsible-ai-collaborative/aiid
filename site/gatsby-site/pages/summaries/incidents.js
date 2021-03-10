import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { graphql } from 'gatsby';

import Button from 'react-bootstrap/Button';

import Layout from 'components/Layout';
import Link from 'components/Link';
import { StyledHeading, StyledMainWrapper } from 'components/styles/Docs';

const ReportList = ({ items }) => {
  return (
    <ul>
      {items.map(({ node: { id, url, title } }) => (
        <li key={id}>
          <a href={url}>{title}</a>
        </li>
      ))}
    </ul>
  );
};

const IncidentList = ({ group }) => {
  return (
    <>
      {group.map((value, idx) => (
        <div key={`incident-${idx}`}>
          <h2>
            Incident {value['edges'][0]['node']['incident_id']}{' '}
            <Button
              variant="outline-primary"
              href={'/cite/' + value['edges'][0]['node']['incident_id']}
            >
              Citation
            </Button>
            <Button
              variant="outline-primary"
              href={'/discover/index.html?incident_id=' + value['edges'][0]['node']['incident_id']}
            >
              Discover
            </Button>
          </h2>
          <ReportList items={value['edges']} />
        </div>
      ))}
    </>
  );
};

export default class Incidents extends Component {
  render() {
    const { data } = this.props;

    if (!data) {
      return null;
    }
    const {
      allMongodbAiidprodIncidents: { group },
    } = data;

    // sort by value
    group.sort(function (a, b) {
      return a['edges'][0]['node']['incident_id'] - b['edges'][0]['node']['incident_id'];
    });

    return (
      <Layout {...this.props}>
        <Helmet>
          <title>Incident List</title>
        </Helmet>
        <div className={'titleWrapper'}>
          <StyledHeading>Incident List</StyledHeading>
        </div>
        <StyledMainWrapper>
          <p className="paragraph">
            This is a simple numeric listing of all incidents and their reports within the database.
            If you would like to explore the contents of the reports, you should work through the
            <Link to="/about_apps/1-discover"> Discover app</Link>.
          </p>
          <IncidentList group={group} />
        </StyledMainWrapper>
      </Layout>
    );
  }
}

export const pageQuery = graphql`
  query AllIncidentsPart {
    allMongodbAiidprodIncidents(
      filter: { flag: { eq: null } }
      sort: { order: ASC, fields: incident_id }
    ) {
      group(field: incident_id) {
        edges {
          node {
            id
            incident_id
            report_number
            title
            url
          }
        }
      }
    }
  }
`;
