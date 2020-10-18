import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { graphql } from 'gatsby';

import { Spinner, Button } from 'react-bootstrap';

import * as Realm from "realm-web";

import uuid from 'react-uuid'

import { Layout, Link } from '$components';
import config from '../../config';

const REALM_APP_ID = config["realm"]["review_db"]["realm_app_id"];
const DB_SERVICE = config["realm"]["review_db"]["db_service"]
const DB_NAME = config["realm"]["review_db"]["db_name"]
const DB_COLLECTION = config["realm"]["review_db"]["db_collection"]
const app = new Realm.App({
  id: REALM_APP_ID,
  timeout: 10000 // timeout in number of milliseconds
});

// https://docs.mongodb.com/realm/web/mongodb/

let user = undefined;

async function login(callback) {
  user = await app.logIn(Realm.Credentials.anonymous());
  callback();
  console.log(`Logged in ${user}`);
}

// For future use, this is an example query
async function runQuery(query, callback) {
  console.log("querying incident:");
  const mongo = app.services.mongodb(DB_SERVICE);
  const mongoCollection = mongo.db(DB_NAME).collection(DB_COLLECTION);
  const incident1 = await mongoCollection.find(query);
  callback();
  console.log(incident1);
}

async function createReportForReview(newReportData, callback) {
  console.log("Creating report:");
  console.log(newReportData);
  const result = await user.functions.createReportForReview(newReportData);
  callback();
  return;
}

async function quickAddReport(newReportData, callback) {
  console.log("Creating quick add report:");
  console.log(newReportData);
  const result = await user.functions.quickAdd(newReportData);
  callback();
  return;
}

class API extends Component {
  constructor(props) {
    super()
    const spinner = (
      <Button variant="primary" disabled block>
        <Spinner
          as="span"
          animation="grow"
          size="sm"
          role="status"
          aria-hidden="true"
        />
        Connecting to Database...
      </Button>
    );
    this.state = {loadingMessage: spinner}
  }

  componentDidUpdate(prevProps) {
    if (this.props.newIncidentData !== prevProps.newIncidentData && this.props.newIncidentData !== {}) {
      if("title" in this.props.newIncidentData) {
        createReportForReview(this.props.newIncidentData, this.props.createCallback)
      } else {
        quickAddReport(this.props.newIncidentData, this.props.createCallback)
      }
    }
  }

  componentDidMount() {
    const connectedMessage = <></>;
    login(() => {this.setState({loadingMessage: connectedMessage})});
  }

  render() {
    return this.state.loadingMessage;
  }
}

export default API
