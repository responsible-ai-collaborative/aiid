import React, { useEffect, useState } from 'react';

export default function Modal(props) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(props.show);
  }, [props.show]);

  return (
    <>
      <div
        id={props.id}
        aria-hidden={isOpen}
        className={`tw-fade tw-fixed tw-top-0 tw-left-0 tw-w-full tw-h-full tw-outline-none tw-overflow-x-hidden tw-overflow-y-auto ${
          isOpen ? 'tw-flex' : 'tw-hidden'
        }`}
      >
        <div className="modal-dialog tw-relative tw-w-auto tw-pointer-events-none">
          <div className="modal-content tw-border-none tw-shadow-lg tw-relative tw-flex tw-flex-col tw-w-full tw-pointer-events-auto tw-bg-white tw-bg-clip-padding tw-rounded-md tw-outline-none tw-text-current">
            {props.children}
          </div>
        </div>
      </div>
    </>
  );
}

Modal.Title = function ModalTitle(props) {
  return (
    <div className="modal-header tw-flex tw-flex-shrink-0 tw-items-center tw-justify-between tw-p-4 tw-border-b tw-border-gray-200 tw-rounded-t-md">
      <h5
        className="text-xl tw-font-medium tw-leading-normal tw-text-gray-800"
        id="exampleModalLabel"
      >
        {props.children}
      </h5>
      <button
        type="button"
        className="btn-close tw-box-content tw-w-4 tw-h-4 tw-p-1 tw-text-black tw-border-none tw-rounded-none tw-opacity-50 tw-focus:shadow-none tw-focus:outline-none tw-focus:opacity-100 tw-hover:text-black tw-hover:opacity-75 tw-hover:no-underline"
        data-bs-dismiss="modal"
        aria-label="Close"
      ></button>
    </div>
  );
};

Modal.Header = function ModalHeader(props) {
  return (
    <div
      className={`tw-flex ${
        props.className ? props.className : ''
      } tw-bg-light-grey tw-px-4 tw-py-2 tw-border-b tw-border-border-grey`}
    >
      {props.children}
    </div>
  );
};

Modal.Body = function ModalBody(props) {
  return (
    <>
      <div className="tw-modal-body tw-relative p-4">{props.children}</div>
    </>
  );
};

Modal.Footer = function ModalFooter() {
  return (
    <>
      <div className="tw-modal-footer tw-flex tw-flex-shrink-0 tw-flex-wrap tw-items-center tw-justify-end tw-p-4 tw-border-t tw-border-gray-200 tw-rounded-b-md">
        <button
          type="button"
          className="tw-px-6
          tw-py-2.5
          tw-bg-purple-600
          tw-text-white
          tw-font-medium
          tw-text-xs
          tw-leading-tight
          tw-uppercase
          tw-rounded
          tw-shadow-md
          hover:tw-bg-purple-700 hover:tw-shadow-lg
          focus:tw-bg-purple-700 focus:tw-shadow-lg focus:tw-outline-none focus:tw-ring-0
          active:tw-bg-purple-800 active:tw-shadow-lg
          tw-transition
          tw-duration-150
          tw-ease-in-out"
          data-bs-dismiss="modal"
        >
          Close
        </button>
        <button
          type="button"
          className="px-6
      tw-py-2.5
      tw-bg-blue-600
      tw-text-white
      tw-font-medium
      tw-text-xs
      tw-leading-tight
      tw-uppercase
      tw-rounded
      tw-shadow-md
      hover:tw-bg-blue-700 hover:tw-shadow-lg
      focus:tw-bg-blue-700 focus:tw-shadow-lg focus:tw-outline-none focus:tw-ring-0
      active:tw-bg-blue-800 active:tw-shadow-lg
      tw-transition
      tw-duration-150
      tw-ease-in-out
      tw-ml-1"
        >
          Save changes
        </button>
      </div>
    </>
  );
};
