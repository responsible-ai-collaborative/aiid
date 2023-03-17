import React, { useState } from 'react';
import { Modal } from 'flowbite-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowCircleLeft,
  faArrowCircleRight,
  faChevronCircleLeft,
  faChevronCircleRight,
  faCheckCircle,
  faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons';

export function BiasIcon({ bias_labels, publicationName, className, style }) {
  bias_labels ||= [];

  // The modal causes server-side-rendering problems,
  // so we need to disable rendering it
  // until an interaction has occurred on the client-side.
  const [modalRendered, setModalRendered] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  const hasLabelName = (labelName) => bias_labels.some((biasLabel) => biasLabel.label == labelName);

  const possibleLabels = [
    'least biased',
    'questionable',
    'left',
    'right',
    'center-left',
    'center-right',
  ];

  return (
    <>
      <button
        className={`${className || ''} bg-none border-0 p-0 m-0`}
        style={style}
        onClick={() => {
          setModalRendered(true);
          setModalVisible(true);
        }}
        onMouseEnter={() => setModalRendered(true)}
      >
        {possibleLabels.map(
          (labelName) =>
            hasLabelName(labelName) && (
              <FontAwesomeIcon
                key={labelName}
                title={labelName}
                icon={
                  {
                    'least biased': faCheckCircle,
                    questionable: faExclamationCircle,
                    left: faArrowCircleLeft,
                    right: faArrowCircleRight,
                    'center-left': faChevronCircleLeft,
                    'center-right': faChevronCircleRight,
                  }[labelName]
                }
                className={`mr-1 -mb-px ${
                  { questionable: 'text-red-500' }[labelName] || 'text-inherit'
                }`}
              />
            )
        )}
      </button>
      {modalRendered && (
        <Modal show={modalVisible} onClose={() => setModalVisible(false)}>
          <Modal.Header>{publicationName}</Modal.Header>
          <Modal.Body>
            <p className="mt-0">The bias of this source was assessed as follows:</p>
            <ul className="list-disc pl-4">
              {bias_labels.map((biasLabel) => (
                <li key={biasLabel.label}>
                  “{biasLabel.label}” by {biasLabel.labeler}
                </li>
              ))}
            </ul>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
}
