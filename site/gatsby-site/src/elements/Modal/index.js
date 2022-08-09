import React, { createContext, useContext } from 'react';

const ModalContext = createContext({
  show: false,
  onHide: () => {},
});

export default function Modal(props) {
  let modalProps = {};

  if (props['data-cy']) modalProps['data-cy'] = props['data-cy'];

  return (
    <ModalContext.Provider value={{ show: props.show, onHide: props.onHide }}>
      <div
        {...modalProps}
        id={props.id}
        aria-hidden={props.show}
        className={`tw-fade tw-fixed tw-top-0 tw-left-0 tw-w-full tw-h-full tw-outline-none tw-overflow-x-hidden tw-overflow-y-auto ${
          props.show ? 'tw-flex' : 'tw-hidden'
        }`}
      >
        <div className="modal-dialog tw-relative tw-w-auto tw-pointer-events-none">
          <div className="modal-content tw-border-none tw-shadow-lg tw-relative tw-flex tw-flex-col tw-w-full tw-pointer-events-auto tw-bg-white tw-bg-clip-padding tw-rounded-md tw-outline-none tw-text-current">
            {props.children}
          </div>
        </div>
      </div>
    </ModalContext.Provider>
  );
}

Modal.Title = function ModalTitle(props) {
  return (
    <div
      className={`tw-flex tw-flex-shrink-0 tw-items-center tw-justify-between tw-p-4 tw-rounded-t-md ${props.className}`}
    >
      <h5
        className="text-xl tw-font-medium tw-leading-normal tw-text-gray-800"
        id="exampleModalLabel"
      >
        {props.children}
      </h5>
    </div>
  );
};

Modal.Header = function ModalHeader(props) {
  const { onHide } = useContext(ModalContext);

  return (
    <div
      className={`tw-flex tw-w-full tw-justify-between tw-items-center ${
        props.className ? props.className : ''
      } tw-bg-light-grey tw-px-4 tw-py-2`}
    >
      {props.children}
      {props.closeButton && (
        <button
          type="button"
          className="btn-close tw-box-content tw-w-4 tw-h-4 tw-p-1 tw-text-black tw-border-none tw-rounded-none tw-opacity-50 tw-focus:shadow-none tw-focus:outline-none tw-focus:opacity-100 tw-hover:text-black tw-hover:opacity-75 tw-hover:no-underline"
          data-bs-dismiss="modal"
          aria-label="Close"
          onClick={onHide}
        ></button>
      )}
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

Modal.Footer = function ModalFooter(props) {
  return (
    <>
      <div className="tw-modal-footer tw-flex tw-flex-shrink-0 tw-flex-wrap tw-items-center tw-justify-end tw-p-4 tw-border-t tw-border-gray-200 tw-rounded-b-md">
        {props.children}
      </div>
    </>
  );
};
