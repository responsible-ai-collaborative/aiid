import React from 'react';
import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Trans } from 'react-i18next';
import styled from 'styled-components';
import Button from '../elements/Button';

const StyledModal = styled(Modal)`
  .modal-dialog {
    max-width: 80%;

    @media only screen and (max-width: 800px) {
      max-width: 100%;
    }
  }
`;

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
  <StyledModal show={isOpen} onHide={close}>
    <Modal.Header closeButton>
      <Modal.Title>{target.title}</Modal.Title>
    </Modal.Header>
    <Modal.Body>{target.body()}</Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={close}>
        <Trans>Close</Trans>
      </Button>
    </Modal.Footer>
  </StyledModal>
);
