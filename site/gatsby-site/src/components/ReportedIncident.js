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
import ReadMoreText from 'components/ReadMoreText';
import EditableListItem from 'components/EditableListItem';
import IncidentEditModal from 'components/IncidentEditModal';
import RelatedIncidents from 'components/RelatedIncidents';

import { useUserContext } from 'contexts/userContext';
import { useSubmissionsContext } from 'contexts/submissionsContext';
import { useMongo } from 'hooks/useMongo';
import {
  INSERT_REPORT,
  LAST_REPORT_NUMBER,
  useGetLastRefNumber,
  useUpdateLinkedReports,
} from '../graphql/reports';
import { useLazyQuery, useMutation } from '@apollo/client';
import { LAST_INCIDENT_ID } from '../graphql/incidents';
import { DELETE_SUBMISSION } from '../graphql/submissions';

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

const ReportedIncident = ({ incident: report }) => {
  const { isRole } = useUserContext();

  const {
    actions: { refetch },
  } = useSubmissionsContext();

  const { updateOne } = useMongo();

  const [isEditing, setIsEditing] = useState(false);

  const [open, setOpen] = useState(false);

  const isSubmitter = isRole('submitter');

  const updateLinkedReports = useUpdateLinkedReports();

  const [getLastReportNumber] = useLazyQuery(LAST_REPORT_NUMBER);

  const [getLastIncidentId] = useLazyQuery(LAST_INCIDENT_ID);

  const [insertReport] = useMutation(INSERT_REPORT);

  const [deleteSubmission] = useMutation(DELETE_SUBMISSION);

  const getLastRefNumber = useGetLastRefNumber();

  const addReport = async () => {
    const newReport = { ...report };

    delete newReport.mongodb_id;

    delete newReport._id;

    const {
      data: {
        reports: {
          0: { report_number },
        },
      },
    } = await getLastReportNumber();

    newReport.report_number = report_number;

    if (!newReport.incident_id) {
      const {
        data: {
          incidents: {
            0: { incident_id },
          },
        },
      } = await getLastIncidentId();

      newReport.incident_id = incident_id + 1;
    }

    const lastRefNumber = await getLastRefNumber({ incidentId: newReport.incident_id });

    newReport.ref_number = lastRefNumber + 1;

    await insertReport({ variables: { report: newReport } });

    await updateLinkedReports({
      incidentIds: [newReport.incident_id],
      reportNumber: newReport.report_number,
    });

    await deleteSubmission({ variables: { _id: report._id } });

    refetch();
  };

  const rejectReport = async () => {
    await deleteSubmission({ variables: { _id: report._id } });

    refetch();
  };

  const toggleEditing = () => setIsEditing(!isEditing);

  const handleUpdate = async (values) => {
    console.log('Updating report from: ', report);
    console.log('Updating report to:', values);
    if (typeof values['authors'] === 'string') {
      values['authors'] = values['authors'].split(',').map((s) => s.trim());
    }
    if (typeof values['submitters'] === 'string') {
      values['submitters'] = values['submitters'].split(',').map((s) => s.trim());
    }
    updateOne({ _id: values._id }, values, refetch);
  };

  const isNewIncident = report['incident_id'] === 0;

  const cardSubheader = isNewIncident ? 'New Incident' : 'New Report';

  return (
    <>
      <Card.Header>
        <Row>
          <Col xs={12} sm={2} lg={2}>
            <Button
              onClick={() => setOpen(!open)}
              aria-controls="collapse-incident-submission"
              aria-expanded={open}
            >
              review &gt;
            </Button>
          </Col>
          <Col xs={12} sm={10} lg={10}>
            {' '}
            {report['title']}
            <br />
            <Badge bg="secondary">Inc: {report['incident_date']}</Badge>{' '}
            <Badge bg="secondary">Pub: {report['date_published']}</Badge>{' '}
            <Badge bg="secondary">Sub: {report['date_submitted']}</Badge>{' '}
            <Badge bg="secondary">{report['submitters']}</Badge>
          </Col>
        </Row>
      </Card.Header>
      <Collapse in={open}>
        <div id="collapse-incident-submission" className="pt-3">
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
          {open && (
            <Card className="m-3">
              <Card.Header>Possible related incidents</Card.Header>
              <Card.Body>
                <RelatedIncidents incident={report} isSubmitted={true} />
              </Card.Body>
            </Card>
          )}
          <Card.Footer className="d-flex text-muted">
            <Button className="me-auto" disabled={!isSubmitter} onClick={toggleEditing}>
              <FontAwesomeIcon icon={faEdit} />
            </Button>
            <Button
              className="me-2"
              variant="outline-primary"
              disabled={!isSubmitter}
              onClick={addReport}
            >
              Add {cardSubheader}
            </Button>
            <Button variant="outline-secondary" disabled={!isSubmitter} onClick={rejectReport}>
              Reject {cardSubheader}
            </Button>
          </Card.Footer>
        </div>
      </Collapse>
      <IncidentEditModal
        show={isEditing}
        incident={report}
        onHide={toggleEditing}
        onSubmit={handleUpdate}
      />
    </>
  );
};

export default ReportedIncident;
