import React, { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Collapse from 'react-bootstrap/Collapse';
import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { ObjectId } from 'bson';

import ReadMoreText from 'components/ReadMoreText';
import EditableListItem from 'components/EditableListItem';
import IncidentEditModal from 'components/IncidentEditModal';

import { useUserContext } from 'contexts/userContext';
import { useSubmissionsContext } from 'contexts/submissionsContext';
import { useMongo } from 'hooks/useMongo';

const ListedGroup = ({ item, keysToRender }) => {
  return (
    <ListGroup className="px-3">
      {keysToRender.map((key) => (
        <EditableListItem
          key={key}
          name={key}
          value={
            typeof item[key] == 'object' && item[key] !== null ? item[key].join(', ') : item[key]
          }
        />
      ))}
    </ListGroup>
  );
};

const leadItems = ['source_domain', 'authors', 'submitters', 'incident_id'];

const urls = ['url', 'image_url', 'authors', 'submitters'];

const dateRender = [
  'incident_date',
  'date_published',
  'date_submitted',
  'date_downloaded',
  'date_modified',
];

const otherDetails = ['language', 'mongodb_id'];

const ReportedIncident = ({ incident }) => {
  const { user, isAdmin } = useUserContext();

  const {
    actions: { refetch },
  } = useSubmissionsContext();

  const { updateOne } = useMongo();

  const [isEditing, setIsEditing] = useState(false);

  const [open, setOpen] = useState(false);

  const addReport = () => {
    user.functions.promoteReport({ _id: new ObjectId(incident['mongodb_id']) });
    refetch();
  };

  const rejectReport = () => {
    user.functions.deleteSubmittedDocument({ _id: new ObjectId(incident['mongodb_id']) });
    refetch();
  };

  const toggleEditing = () => setIsEditing(!isEditing);

  const handleUpdate = async (values) => {
    console.log('Updating report from: ', incident);
    console.log('Updating report to:', values);
    if (typeof values['authors'] === 'string') {
      values['authors'] = values['authors'].split(',').map((s) => s.trim());
    }
    if (typeof values['submitters'] === 'string') {
      values['submitters'] = values['submitters'].split(',').map((s) => s.trim());
    }
    updateOne({ _id: values._id }, values, refetch);
  };

  const isNewIncident = incident['incident_id'] === 0;

  const cardSubheader = isNewIncident ? 'New Incident' : 'New Report';

  return (
    <>
      <Card.Header>
        <Row>
          <Col xs={12} sm={2} lg={2}>
            <Button
              block
              onClick={() => setOpen(!open)}
              aria-controls="collapse-incident-submission"
              aria-expanded={open}
            >
              review &gt;
            </Button>
          </Col>
          <Col xs={12} sm={10} lg={10}>
            {' '}
            {incident['title']}
            <br />
            <Badge variant="secondary">Inc: {incident['incident_date']}</Badge>{' '}
            <Badge variant="secondary">Pub: {incident['date_published']}</Badge>{' '}
            <Badge variant="secondary">Sub: {incident['date_submitted']}</Badge>{' '}
            <Badge variant="secondary">{incident['submitters']}</Badge>
          </Col>
        </Row>
      </Card.Header>
      <Collapse in={open}>
        <div id="collapse-incident-submission" className="pt-3">
          <ListedGroup item={incident} keysToRender={leadItems} />
          <ListedGroup item={incident} keysToRender={dateRender} />
          <ListedGroup item={incident} keysToRender={urls} />
          <ListedGroup item={incident} keysToRender={otherDetails} />
          <Card className="m-3">
            <Card.Header>Text</Card.Header>
            <Card.Body>
              <ReadMoreText text={incident.text} visibility={open} />
            </Card.Body>
          </Card>
          <Card.Footer className="d-flex text-muted">
            <Button className="mr-auto" disabled={!isAdmin} onClick={toggleEditing}>
              <FontAwesomeIcon icon={faEdit} />
            </Button>
            <Button
              className="mr-2"
              variant="outline-primary"
              disabled={!isAdmin}
              onClick={addReport}
            >
              Add {cardSubheader}
            </Button>
            <Button variant="outline-secondary" disabled={!isAdmin} onClick={rejectReport}>
              Reject {cardSubheader}
            </Button>
          </Card.Footer>
        </div>
      </Collapse>
      <IncidentEditModal
        show={isEditing}
        incident={incident}
        onHide={toggleEditing}
        onSubmit={handleUpdate}
      />
    </>
  );
};

export default ReportedIncident;
