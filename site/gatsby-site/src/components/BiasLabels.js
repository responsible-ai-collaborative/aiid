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
        onClick={() => setModalVisible(true)}
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
                className={`mr-1 mt-px ${
                  labelName == 'least biased'
                    ? 'text-green-500'
                    : labelName == 'questionable'
                    ? 'text-red-500'
                    : 'text-inherit'
                }`}
              />
            )
        )}
      </button>
      {
        // The modal causes server-side-rendering problems,
        // so we need to disable it in that context.
        window && (
          <Modal show={modalVisible} onClose={() => setModalVisible(false)}>
            <Modal.Header>{publicationName}</Modal.Header>
            <Modal.Body>
              <p className="mt-0">The bias of this source was assessed as follows:</p>
              <ul className="list-disc pl-4">
                {bias_labels.map((biasLabel) => (
                  <li key={biasLabel}>
                    “{biasLabel.label}” by {biasLabel.labeler}
                  </li>
                ))}
              </ul>
            </Modal.Body>
          </Modal>
        )
      }
    </>
  );
}
