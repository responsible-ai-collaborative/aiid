import React from 'react';
import { Modal } from 'react-bootstrap';

import IncidentReportForm from 'components/forms/IncidentReportForm';

const IncidentEditModal = ({ show, incident, onHide, onSubmit }) => {
  return (
    <Modal size="lg" show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Incident</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <IncidentReportForm incident={incident} onSubmit={onSubmit} />
      </Modal.Body>
    </Modal>
  );
};

export default IncidentEditModal;
