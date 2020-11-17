import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { graphql } from 'gatsby';

import 'bootstrap/dist/css/bootstrap.min.css';
import ListGroup from 'react-bootstrap/ListGroup'
import Tab from 'react-bootstrap/Tab'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

import BSON from "bson";

import uuid from 'react-uuid'

import {promoteReport} from '../../src/mongodb/api'
import {getUser} from '../../src/mongodb/authenticate'

import { Layout, Link } from '$components';
import config from '../../config';
import { Edit, StyledHeading, StyledMainWrapper } from '../../src/components/styles/Docs';

const ReportList = ({items}) => {
  const uid = "#???"
  const tabbedRender = [
    "description",
    "text"
  ]
  let untabbedRender = Object.keys(items["node"])
  delete untabbedRender["id"]
  tabbedRender.forEach(element => untabbedRender.splice(untabbedRender.indexOf(element), 1));
  return (
    <>
    <ListGroup>
      {untabbedRender.map((key, idx) =>
        <ListGroup.Item key={uid + key}>
          <span style={{ color: '#1cd3c6' }}>{key}</span>:
            {" "}{typeof(items["node"][key]) == "object" ? items["node"][key].join(", ") : items["node"][key]}
          </ListGroup.Item>
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
                {items["node"][key].split('\n').map((item, key) => {
                  return <span key={key}>{item}<br/></span>
                })}
              </Tab.Pane>
            )}
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
    </>
  );
};

const IncidentList = ({edges, admin}) => {

  const addReport = (id) => {
    const bs = new BSON.ObjectId(id["node"]["mongodb_id"]);
    promoteReport({"_id": bs}, console.log);
  }

  return (<>
      {edges.map((value, index) => (
        <div key={uuid()}>
          <h2>New Report {index + 1}
            <Button variant="outline-secondary" disabled={admin ? false : true} onClick={() => addReport(value)}>
              Add New {value["node"]["incident_id"] < 1 ? "Incident" : "Report"}
            </Button>
          </h2>
          <ReportList key={uuid()} items={value} />
        </div>
      ))}
      </>
  );
};

const QuickList = ({edges}) => {
  return (
      <ListGroup>
        {edges.map((key, idx) =>
          <ListGroup.Item key={uuid()}>
              <a href={edges[idx]["node"]["url"]}>{edges[idx]["node"]["url"]}</a>
          </ListGroup.Item>
        )}
      </ListGroup>
  );
}

export default class SubmittedIncidents extends Component {

  constructor(props) {
    super(props);
    this.state = { admin: false };
  }

  componentDidMount() {
    const that = this;
    getUser().then(function(user){
      that.setState((state, props) => {
        return {admin: user.type=="token"};
      });
    });
  }

  render() {

    const { data } = this.props;

    if (!data) {
      return null;
    }
    const {
      allMongodbAiidprodSubmissions,
      allMongodbAiidprodQuickadd
    } = data;
    const fullSubmissions = allMongodbAiidprodSubmissions["edges"];
    const quickSubmissions = allMongodbAiidprodQuickadd["edges"];

    // sort by value
    fullSubmissions.sort(function (a, b) {
      return a["node"]["incident_date"] -
        b["node"]["incident_date"];
    });
    quickSubmissions.sort(function (a, b) {
      return a["node"]["date_submitted"] -
        b["node"]["date_submitted"];
    });

    return (
      <Layout {...this.props}>
        <Helmet>
          <title>Submitted Incident Report List</title>
        </Helmet>
        <div className={'titleWrapper'}>
          <StyledHeading>Submitted Incident Report List</StyledHeading>
        </div>
        <StyledMainWrapper>
          <p className="paragraph">
            The following incident reports have been <Link to="/about_apps/2-submit">submitted </Link> by users and are pending review by editors.
            Only editors may promote these records to incident reports in the database.
          </p>
          <p>Please note that this list updates hourly. New submissions are not immediately shown.</p>
          <IncidentList edges={fullSubmissions} admin={this.state["admin"]} />
          <h1>Quick Add URLs</h1>
          <p>These reports were added anonymously by users in the <Link to="/apps/quickadd"> Quick Add </Link> form.</p>
          <QuickList edges={quickSubmissions} />
        </StyledMainWrapper>
      </Layout>
    );
  }
}

export const pageQuery = graphql`
query AllSubmittedReports {
  allMongodbAiidprodSubmissions {
    edges {
      node {
        title
        source_domain
        authors
        submitters
        incident_date
        incident_id
        url
        image_url
        date_downloaded
        date_published
        date_submitted
        date_modified
        text
        description
        language
        id
        mongodb_id
      }
    }
  }
  allMongodbAiidprodQuickadd {
    edges {
      node {
        date_submitted
        url
        source_domain
      }
    }
  }
}
`;