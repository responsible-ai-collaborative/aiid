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
import { INSERT_REPORT, useUpdateLinkedReports } from '../graphql/reports';
import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { INSERT_INCIDENT } from '../graphql/incidents';
import { DELETE_SUBMISSION } from '../graphql/submissions';
import useToastContext, { SEVERITY } from 'hooks/useToast';
import { format, getUnixTime } from 'date-fns';

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

const lastIndexesQuery = gql`
  query LastIndexes($incidentId: Int) {
    lastReport: reports(sortBy: REPORT_NUMBER_DESC, limit: 1) {
      report_number
    }
    lastIncident: incidents(sortBy: INCIDENT_ID_DESC, limit: 1) {
      incident_id
    }
    refsNumbers: incident(query: { incident_id: $incidentId }) {
      incident_id
      reports {
        report_number
        ref_number
      }
    }
  }
`;

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

  const [getLastIndexes] = useLazyQuery(lastIndexesQuery);

  const [insertReport] = useMutation(INSERT_REPORT);

  const [deleteSubmission] = useMutation(DELETE_SUBMISSION);

  const [insertIncident] = useMutation(INSERT_INCIDENT);

  const addToast = useToastContext();

  const addReport = async () => {
    const newReport = { ...report };

    delete newReport.mongodb_id;

    delete newReport._id;

    const {
      data: {
        lastIncident: [{ incident_id: lastIncidentId }],
        lastReport: [{ report_number: lastReportNumber }],
        refsNumbers,
      },
    } = await getLastIndexes({ variables: { incidentId: report.incident_id } });

    const lastRefNumber =
      report.incident_id == '0'
        ? 0
        : refsNumbers.reports.reduce(
            (last, report) => (report.ref_number > last ? report.ref_number : last),
            0
          );

    newReport.report_number = lastReportNumber + 1;

    if (!newReport.incident_id) {
      newReport.incident_id = lastIncidentId + 1;

      const newIncident = {
        incident_id: newReport.incident_id,
        date: newReport.incident_date,
      };

      await insertIncident({ variables: { incident: newIncident } });
    }

    newReport.ref_number = lastRefNumber + 1;

    newReport.date_modified = format(new Date(), 'yyyy-MM-dd');

    newReport.epoch_date_modified = getUnixTime(new Date(newReport.date_modified));
    newReport.epoch_date_published = getUnixTime(new Date(newReport.date_published));
    newReport.epoch_date_downloaded = getUnixTime(new Date(newReport.date_downloaded));
    newReport.epoch_date_submitted = getUnixTime(new Date(newReport.date_submitted));

    await insertReport({ variables: { report: newReport } });

    await updateLinkedReports({
      incidentIds: [newReport.incident_id],
      reportNumber: newReport.report_number,
    });

    await deleteSubmission({ variables: { _id: report._id } });

    addToast({
      message: (
        <>
          Succesfully promoted submission to Incident {newReport.incident_id} and Report{' '}
          {newReport.report_number}{' '}
        </>
      ),
      severity: SEVERITY.success,
    });

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
