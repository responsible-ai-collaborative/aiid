import React from 'react';
import { useState } from 'react';
import { Trans } from 'react-i18next';
import { Button, Modal } from 'flowbite-react';

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
  <>
    {isOpen && (
      <Modal className="max-w-[80%] 800px:max-w-full" show={isOpen} onClose={close}>
        <Modal.Header>
          <h4>{target.title}</h4>
        </Modal.Header>
        <Modal.Body>{target.body()}</Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={close}>
            <Trans>Close</Trans>
          </Button>
        </Modal.Footer>
      </Modal>
    )}
  </>
);
