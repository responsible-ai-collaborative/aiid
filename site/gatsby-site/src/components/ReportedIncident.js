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
import { UPDATE_REPORT } from '../graphql/reports';
import { useMutation } from '@apollo/client';
import { UPDATE_INCIDENT } from '../graphql/incidents';
import { DELETE_SUBMISSION, PROMOTE_SUBMISSION, UPDATE_SUBMISSION } from '../graphql/submissions';
import useToastContext, { SEVERITY } from 'hooks/useToast';
import { format, getUnixTime } from 'date-fns';
import isArray from 'lodash/isArray';

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

const ReportedIncident = ({ incident: submission }) => {
  const { isRole } = useUserContext();

  const [isEditing, setIsEditing] = useState(false);

  const [open, setOpen] = useState(false);

  const isSubmitter = isRole('submitter');

  const [promoteSubmission] = useMutation(PROMOTE_SUBMISSION, { fetchPolicy: 'network-only' });

  const [updateReport] = useMutation(UPDATE_REPORT);

  const [updateIncident] = useMutation(UPDATE_INCIDENT);

  const [updateSubmission] = useMutation(UPDATE_SUBMISSION);

  const [deleteSubmission] = useMutation(DELETE_SUBMISSION);

  const addToast = useToastContext();

  const addReport = async () => {
    const {
      data: {
        promoteSubmissionToReport: { 0: incident },
      },
    } = await promoteSubmission({
      variables: {
        input: {
          submission_id: submission._id,
          incident_ids: submission.incident_id === '0' ? [] : [submission.incident_id],
        },
      },
      fetchPolicy: 'no-cache',
      update: (cache) => {
        cache.modify({
          fields: {
            submissions(refs, { readField }) {
              return refs.filter((s) => submission._id !== readField('_id', s));
            },
          },
        });
      },
    });

    const report = { ...submission, _id: undefined, __typename: undefined };

    report.date_modified = format(new Date(), 'yyyy-MM-dd');

    report.epoch_date_modified = getUnixTime(new Date(report.date_modified));
    report.epoch_date_published = getUnixTime(new Date(report.date_published));
    report.epoch_date_downloaded = getUnixTime(new Date(report.date_downloaded));
    report.epoch_date_submitted = getUnixTime(new Date(report.date_submitted));

    report.incident_id = incident.incident_id;

    const report_number = incident.reports
      .sort((a, b) => b.report_number - a.report_number)
      .shift().report_number;

    await updateReport({
      variables: {
        query: {
          report_number,
        },
        set: {
          ...report,
        },
      },
    });

    if (submission.incident_id === '0') {
      await updateIncident({
        variables: {
          query: {
            incident_id: incident.incident_id,
          },
          set: {
            title: submission.title,
          },
        },
      });
    }

    addToast({
      message: (
        <>
          Successfully promoted submission to Incident {incident.incident_id} and Report{' '}
          {report_number}{' '}
        </>
      ),
      severity: SEVERITY.success,
    });
  };

  const rejectReport = async () => {
    await deleteSubmission({ variables: { _id: submission._id } });
  };

  const toggleEditing = () => setIsEditing(!isEditing);

  const handleSubmit = async (values) => {
    try {
      const update = { ...values, _id: undefined };

      await updateSubmission({
        variables: {
          query: {
            _id: values._id,
          },
          set: {
            ...update,
            authors: !isArray(values.authors)
              ? values.authors.split(',').map((s) => s.trim())
              : values.authors,
            submitters: !isArray(values.submitters)
              ? values.submitters.split(',').map((s) => s.trim())
              : values.submitters,
          },
        },
      });

      addToast({
        message: `Submission updated successfully.`,
        severity: SEVERITY.success,
      });
    } catch (e) {
      addToast({
        message: `Error updating submission ${values._id}`,
        severity: SEVERITY.danger,
      });
    }
  };

  const isNewIncident = submission['incident_id'] === '0';

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
            {submission['title']}
            <br />
            <Badge bg="secondary">Inc: {submission['incident_date']}</Badge>{' '}
            <Badge bg="secondary">Pub: {submission['date_published']}</Badge>{' '}
            <Badge bg="secondary">Sub: {submission['date_submitted']}</Badge>{' '}
            {submission.submitters.map((submitter) => (
              <Badge key={submitter} bg="secondary">
                {submitter}
              </Badge>
            ))}
          </Col>
        </Row>
      </Card.Header>
      <Collapse in={open}>
        <div id="collapse-incident-submission" className="pt-3">
          <ListedGroup item={submission} keysToRender={leadItems} />
          <ListedGroup item={submission} keysToRender={dateRender} />
          <ListedGroup item={submission} keysToRender={urls} />
          <ListedGroup item={submission} keysToRender={otherDetails} />
          <Card className="m-3">
            <Card.Header>Text</Card.Header>
            <Card.Body>
              <ReadMoreText text={submission.text} visibility={open} />
            </Card.Body>
          </Card>
          {open && (
            <Card className="m-3">
              <Card.Header>Possible related incidents</Card.Header>
              <Card.Body>
                <RelatedIncidents incident={submission} isSubmitted={true} />
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
        incident={submission}
        onHide={toggleEditing}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default ReportedIncident;
