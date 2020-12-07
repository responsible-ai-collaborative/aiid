import React, { Component } from 'react';
import { Spinner, Button } from 'react-bootstrap';
import * as Realm from "realm-web";
import config from '../../config';
import {realmApp, getUser} from './authenticate';

// https://docs.mongodb.com/realm/web/mongodb/

const DB_SERVICE = config["realm"]["review_db"]["db_service"];
const DB_NAME = config["realm"]["review_db"]["db_name"];
const DB_COLLECTION = config["realm"]["review_db"]["db_collection"];

let user;
getUser().then(res => {
  user = res["user"];
});

// For future use, this is an example query
export async function runQuery(query, callback,
                               dbService=DB_SERVICE, dbName=DB_NAME, dbCollection=DB_COLLECTION) {
  console.log("querying: " + query);
  const mongo = realmApp.services.mongodb(dbService);
  const mongoCollection = mongo.db(dbName).collection(dbCollection);
  const incident1 = await mongoCollection.find(query);
  callback(incident1);
}

export async function deleteSubmittedDocument(deleteDocumentData, callback) {
  console.log("Deleting document:");
  console.log(deleteDocumentData);
  const result = await user.functions.deleteSubmittedDocument(deleteDocumentData);
  callback();
  return;
}

export async function promoteReport(newReportData, callback) {
  console.log("Promoting report:");
  console.log(newReportData);
  const result = await user.functions.promoteReport(newReportData);
  callback();
  return;
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
    getUser(() => {this.setState({loadingMessage: connectedMessage})});
  }

  render() {
    return this.state.loadingMessage;
  }
}

export default API
