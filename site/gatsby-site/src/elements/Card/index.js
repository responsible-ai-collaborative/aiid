import React from 'react';

export default function Card(props) {
  return (
    <>
      <div
        {...props}
        className={`tw-card tw-border tw-rounded-lg tw-flex tw-break-words ${
          props.className ? props.className : ''
        } tw-flex-col ${props.bg ? 'tw-bg-' + props.bg : ''}`}
      >
        {props.children}
      </div>
    </>
  );
}

Card.Header = function CardHeader(props) {
  return (
    <div
      className={`tw-card-header tw-flex ${
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
      <div className={`tw-card-title tw-flex-1 ${props.className ? props.className : ''}`}>
        <props.as className="tw-mb-2">{props.children}</props.as>
      </div>
    </>
  );
};

Card.Subtitle = function CardSubtitle(props) {
  return (
    <>
      <div className={`tw-card-subtitle tw-flex-1 ${props.className ? props.className : ''}`}>
        {props.children}
      </div>
    </>
  );
};

Card.Body = function CardBody(props) {
  return (
    <>
      <div className={`tw-card-body tw-flex-1 tw-p-4 ${props.className ? props.className : ''}`}>
        {props.children}
      </div>
    </>
  );
};

Card.Footer = function CardFooter(props) {
  return (
    <>
      <div
        className={` tw-card-footer tw-bg-light-grey tw-border-border-grey tw-py-2 tw-px-4 ${
          props.className ? props.className : ''
        }`}
      >
        {props.children}
      </div>
    </>
  );
};

Card.Text = function CardText(props) {
  return (
    <>
      <p className={`tw-card-text ${props.className ? props.className : ''}`}>{props.children}</p>
    </>
  );
};
