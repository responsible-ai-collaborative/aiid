import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Collapse from 'react-bootstrap/Collapse';
import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';
import BSON from 'bson';

import ReadMoreText from 'components/ReadMoreText';
import IncidentEditModal from 'components/modals/IncidentEditModal';
import EditableListItem from 'components/EditableListItem';

import { useUserContext } from 'contexts/userContext';

const ListedGroup = ({ item, keysToRender }) => {
  return (
    <ListGroup>
      {keysToRender.map((key) => (
        <EditableListItem
          key={key}
          name={key}
          value={typeof item[key] == 'object' ? item[key].join(', ') : item[key]}
        />
      ))}
    </ListGroup>
  );
};

const ReportedIncident = ({ report }) => {
  const { loading, user } = useUserContext();

  const [isEditing, setIsEditing] = useState(false);

  const admin = !loading && user.type === 'token';

  const addReport = () => {
    const bs = new BSON.ObjectId(report['mongodb_id']);

    user.functions.promoteReport({ _id: bs });
  };

  const rejectReport = () => {
    const bs = new BSON.ObjectId(report['mongodb_id']);

    user.functions.deleteSubmittedDocument({ _id: bs });
  };

  const toggleEditing = () => setIsEditing(!isEditing);

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

  const otherDetails = ['id', 'language', 'mongodb_id'];

  const isNewIncident = report['incident_id'] === 0;

  const cardSubheader = isNewIncident ? 'New Incident' : 'New Report';

  return (
    <Card className="mb-3">
      <Card.Header>
        <Row>
          <Col xs={12} sm={2} lg={2}>
            <Button
              block
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
        <div id="collapse-report-submission" className="pt-3">
          <ListedGroup item={report} keysToRender={leadItems} />
          <ListedGroup item={report} keysToRender={dateRender} />
          <ListedGroup item={report} keysToRender={urls} />
          <ListedGroup item={report} keysToRender={otherDetails} />
          <Card className="m-3">
            <Card.Header>Text</Card.Header>
            <Card.Body>
              <ReadMoreText text={report.text} visibility={open} />
            </Card.Body>
          </Card>
          <Card.Footer className="d-flex text-muted">
            <Button className="mr-auto" disabled={!admin} onClick={toggleEditing}>
              <FontAwesomeIcon icon={faEdit} />
            </Button>
            <Button
              className="mr-2"
              variant="outline-primary"
              disabled={!admin}
              onClick={addReport}
            >
              Add {cardSubheader}
            </Button>
            <Button variant="outline-secondary" disabled={!admin} onClick={rejectReport}>
              Reject {cardSubheader}
            </Button>
          </Card.Footer>
        </div>
      </Collapse>
      <IncidentEditModal show={isEditing} incident={report} onHide={toggleEditing} />
    </Card>
  );
};

export default ReportedIncident;
