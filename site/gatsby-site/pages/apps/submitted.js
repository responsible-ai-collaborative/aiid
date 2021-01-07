import React, { useState, Component } from 'react';
import Helmet from 'react-helmet';
import { graphql } from 'gatsby';

import 'bootstrap/dist/css/bootstrap.min.css';
import ListGroup from 'react-bootstrap/ListGroup';
import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Collapse from 'react-bootstrap/Collapse';
import Badge from 'react-bootstrap/Badge';

import BSON from 'bson';

import uuid from 'react-uuid';

import { promoteReport, deleteSubmittedDocument } from '../../src/mongodb/api';
import { getUser } from '../../src/mongodb/authenticate';

import { Layout, Link } from '@components';
import { StyledHeading, StyledMainWrapper } from '../../src/components/styles/Docs';

// Renders buttons that render the whole contents of, for example, long text
const TabGroup = ({ item, keysToRender }) => {
  const uid = '#???';

  return (
    <Tab.Container defaultActiveKey={uid + 'url'}>
      <Row>
        <Col xs={12} sm={12} lg={12}>
          <ListGroup horizontal>
            {keysToRender.map(key => (
              <ListGroup.Item action eventKey={uid + key} key={uid + key} variant="light">
                {key}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={12} lg={12}>
          <Tab.Content>
            {keysToRender.map(key => (
              <Tab.Pane key={'a' + uid + key} eventKey={uid + key}>
                <Card.Text>
                  {item[key].split('\n').map((item, key) => {
                    return (
                      <span key={uid + key}>
                        {item}
                        <br />
                      </span>
                    );
                  })}
                </Card.Text>
              </Tab.Pane>
            ))}
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  );
};

const ListedGroup = ({ item, keysToRender }) => {
  const uid = '#???';

  return (
    <ListGroup>
      {keysToRender.map(key => (
        <ListGroup.Item key={uid + key}>
          <span style={{ color: '#1cd3c6' }}>{key}</span>:{' '}
          {typeof item[key] == 'object' ? item[key].join(', ') : item[key]}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

const ReportList = ({ items, admin }) => {
  const addReport = id => {
    const bs = new BSON.ObjectId(id['mongodb_id']);

    promoteReport({ _id: bs }, console.log);
  };

  const rejectReport = id => {
    const bs = new BSON.ObjectId(id['mongodb_id']);

    deleteSubmittedDocument({ _id: bs }, console.log);
  };

  const [open, setOpen] = useState(false);

  const leadItems = ['source_domain', 'authors', 'submitters', 'incident_id'];

  const urls = ['url', 'image_url', 'authors', 'submitters'];

  const dateRender = [
    'incident_date',
    'date_published',
    'date_submitted',
    'date_downloaded',
    'date_modified',
  ];

  const longRender = ['description', 'text'];

  const otherDetails = ['id', 'language', 'mongodb_id'];

  const report = items['node'];

  const isNewIncident = report['incident_id'] === 0;

  const cardSubheader = isNewIncident ? 'New Incident' : 'New Report';

  return (
    <Card>
      <Card.Header>
        <Row>
          <Col xs={4} sm={2} lg={2}>
            <Button
              onClick={() => setOpen(!open)}
              aria-controls="collapse-report-submission"
              aria-expanded={open}
            >
              review &gt;
            </Button>
          </Col>
          <Col xs={12} sm={10} lg={10}>
            {' '}
            {report['title']}
            <br />
            <Badge variant="secondary">Inc: {report['incident_date']}</Badge>{' '}
            <Badge variant="secondary">Pub: {report['date_published']}</Badge>{' '}
            <Badge variant="secondary">Sub: {report['date_submitted']}</Badge>{' '}
            <Badge variant="secondary">{report['submitters']}</Badge>
          </Col>
        </Row>
      </Card.Header>
      <Collapse in={open}>
        <div id="collapse-report-submission">
          <ListedGroup item={report} keysToRender={leadItems} />
          <ListedGroup item={report} keysToRender={dateRender} />
          <ListedGroup item={report} keysToRender={urls} />
          <ListedGroup item={report} keysToRender={otherDetails} />
          <TabGroup item={report} keysToRender={longRender} />
          <Card.Footer className="text-muted">
            <Button
              variant="outline-secondary"
              disabled={admin ? false : true}
              onClick={() => addReport(report)}
            >
              Add {cardSubheader}
            </Button>
            <Button
              variant="outline-secondary"
              disabled={admin ? false : true}
              onClick={() => rejectReport(report)}
            >
              Reject {cardSubheader}
            </Button>
          </Card.Footer>
        </div>
      </Collapse>
    </Card>
  );
};

const IncidentList = ({ edges, admin }) => {
  return (
    <>
      {edges.map(value => (
        <div key={uuid()}>
          <ReportList key={uuid()} items={value} admin={admin} />
        </div>
      ))}
    </>
  );
};

const QuickList = ({ edges }) => {
  return (
    <ListGroup>
      {edges.map((key, idx) => (
        <ListGroup.Item key={uuid()}>
          <a href={edges[idx]['node']['url']}>{edges[idx]['node']['url']}</a>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default class SubmittedIncidents extends Component {
  constructor(props) {
    super(props);
    this.state = { admin: false };
  }

  componentDidMount() {
    const that = this;

    getUser().then(function(user) {
      that.setState({ admin: user.type == 'token' });
    });
  }

  render() {
    const { data } = this.props;

    if (!data) {
      return null;
    }
    const { allMongodbAiidprodSubmissions, allMongodbAiidprodQuickadd } = data;

    const fullSubmissions = allMongodbAiidprodSubmissions['edges'];

    const quickSubmissions = allMongodbAiidprodQuickadd['edges'];

    // sort by value
    fullSubmissions.sort(function(a, b) {
      return a['node']['incident_date'] - b['node']['incident_date'];
    });
    quickSubmissions.sort(function(a, b) {
      return a['node']['date_submitted'] - b['node']['date_submitted'];
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
            The following incident reports have been{' '}
            <Link to="/about_apps/2-submit">submitted </Link> by users and are pending review by
            editors. Only editors may promote these records to incident reports in the database.
          </p>
          <p>
            Please note that this list updates hourly. New submissions are not immediately shown.
          </p>
          <IncidentList edges={fullSubmissions} admin={this.state['admin']} />
          <h1>Quick Add URLs</h1>
          <p>
            These reports were added anonymously by users in the{' '}
            <Link to="/apps/quickadd"> Quick Add </Link> form.
          </p>
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
