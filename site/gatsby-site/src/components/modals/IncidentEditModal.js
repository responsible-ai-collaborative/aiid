import React from 'react';
import { Modal } from 'react-bootstrap';

import IncidentForm from 'components/forms/IncidentForm';

const IncidentEditModal = ({ show, onHide, incident }) => {
  return (
    <Modal size="lg" show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Incident</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0">
        <IncidentForm incident={incident} />
      </Modal.Body>
    </Modal>
  );
};

export default IncidentEditModal;
