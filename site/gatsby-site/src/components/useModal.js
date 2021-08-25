import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [target, setTarget] = useState({
    body: () => null,
    title: '',
  });

  const close = () => setIsOpen(false);

  return {
    target,
    isOpen,
    close,
    openFor(target) {
      setTarget(target);
      setIsOpen(true);
    },
  };
};

export const CustomModal = ({ close, isOpen, target }) => (
  <Modal show={isOpen} onHide={close}>
    <Modal.Header closeButton>
      <Modal.Title>{target.title}</Modal.Title>
    </Modal.Header>
    <Modal.Body>{target.body()}</Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={close}>
        Close
      </Button>
    </Modal.Footer>
  </Modal>
);
