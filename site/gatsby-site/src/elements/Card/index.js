import React from 'react';

export default function Card(props) {
  return (
    <>
      <div
        className={`tw-border tw-rounded-lg tw-flex ${
          props.className ? props.className : ''
        } tw-flex-col tw-shadow-card`}
        {...props}
      >
        {props.children}
      </div>
    </>
  );
}

Card.Header = function CardHeader(props) {
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

Card.Title = function CardTitle(props) {
  return (
    <>
      <div className={`tw-flex-1 ${props.className ? props.className : ''}`}>
        <h3 className="tw-text-2xl tw-mb-2">{props.children}</h3>
      </div>
    </>
  );
};

Card.Body = function CardBody(props) {
  return (
    <>
      <div className={`tw-flex-1 tw-p-4 ${props.className ? props.className : ''}`}>
        {props.children}
      </div>
    </>
  );
};

Card.Footer = function CardFooter(props) {
  return (
    <>
      <div
        className={`tw-bg-light-grey tw-border-border-grey tw-py-2 tw-px-4 ${
          props.className ? props.className : ''
        }`}
      >
        {props.children}
      </div>
    </>
  );
};
