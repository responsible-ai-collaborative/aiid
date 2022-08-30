import React from 'react';
import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Trans } from 'react-i18next';
import Button from 'elements/Button';

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
  <div className="bootstrap">
    <Modal dialogClassName="max-w-[80%] 800px:max-w-full bootstrap" show={isOpen} onHide={close}>
      <Modal.Header closeButton>
        <Modal.Title>{target.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{target.body()}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={close}>
          <Trans>Close</Trans>
        </Button>
      </Modal.Footer>
    </Modal>
  </div>
);
