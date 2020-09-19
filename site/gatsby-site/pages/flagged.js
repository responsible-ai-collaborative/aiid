import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { graphql } from 'gatsby';

import 'bootstrap/dist/css/bootstrap.min.css';
import ListGroup from 'react-bootstrap/ListGroup'
import Tab from 'react-bootstrap/Tab'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import uuid from 'react-uuid'

import { Layout, Link } from '$components';
import config from '../config';
import { Edit, StyledHeading, StyledMainWrapper } from '../src/components/styles/Docs';

const ReportList = ({items}) => {
  const uid = "#" + items["node"]["report_number"]
  const tabbedRender = [
    "description",
    "text"
  ]
  let untabbedRender = Object.keys(items["node"])
  tabbedRender.forEach(element => untabbedRender.splice(untabbedRender.indexOf(element), 1));
  return (
    <>
    <ListGroup>
      {untabbedRender.map((key, idx) =>
        <ListGroup.Item key={uid + key}>{key}: {items["node"][key]}</ListGroup.Item>
      )}
    </ListGroup>
    <Tab.Container defaultActiveKey={uid + "url"}>
      <Row>
        <Col xs={12} sm={6} lg={3}>
          <ListGroup>
            {tabbedRender.map((key, idx) => 
              <ListGroup.Item action eventKey={uid + key} key={uid + key}>
                {key}
              </ListGroup.Item>
            )}
          </ListGroup>
        </Col>
        <Col xs={12} sm={6} lg={9}>
          <Tab.Content>
            {tabbedRender.map((key, idx) => 
              <Tab.Pane eventKey={uid + key}  key={uid + key}>
                {items["node"][key]}
              </Tab.Pane>
            )}
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
    </>
  );
};

const IncidentList = ({group}) => {
  return (<>
      {group.map((value, index) => (
        <div key={uuid()}>
          <h2>Incident {value["edges"][0]["node"]["incident_id"]}</h2>
          {value["edges"].map((innerValue, innerIndex) => (
            <ReportList key={uuid()} items={innerValue} />
          ))}
        </div>
      ))}
      </>
  );
};

export default class FlaggedIncidents extends Component {
  
  render() {

    const { data } = this.props;

    if (!data) {
      return null;
    }
    const {
      allMongodbAiidprodIncidents: {
        group
      }
    } = data;

    // sort by value
    group.sort(function (a, b) {
      return a["edges"][0]["node"]["incident_id"] -
        b["edges"][0]["node"]["incident_id"];
    });

    return (
      <Layout {...this.props}>
        <Helmet>
          <title>Incident List</title>
        </Helmet>
        <div className={'titleWrapper'}>
          <StyledHeading>Flagged Incident List</StyledHeading>
        </div>
        <StyledMainWrapper>
          <p className="paragraph">
            The following incident reports have been flagged by users and are pending review by editors.
          </p>
          <IncidentList group={group} />
        </StyledMainWrapper>
      </Layout>
    );
  }
}

export const pageQuery = graphql`
query AllFlaggedIncidents {
  allMongodbAiidprodIncidents(filter: {flag: {eq: true}}, sort: {order: ASC, fields: incident_id}) {
    group(field: incident_id) {
      edges {
        node {
          id
          incident_id
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
          incident_date
          language
          ref_number
          source_domain
          submitters
          text
        }
      }
    }
  }
}
`;