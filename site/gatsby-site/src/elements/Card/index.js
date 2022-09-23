import React from 'react';
export default function Card(props) {
  return (
    <>
      <div
        {...props}
        className={`tw-card border-1 rounded-lg flex break-words ${
          props.className ? props.className : ''
        } flex-col ${props.bg ? 'bg-' + props.bg : ''}`}
      >
        {props.children}
      </div>
    </>
  );
}

Card.Header = function CardHeader(props) {
  return (
    <div
      className={`tw-card-header flex ${
        props.className ? props.className : ''
      } bg-light-gray px-4 py-2 border-b border-border-gray`}
    >
      {props.children}
    </div>
  );
};

Card.Title = function CardTitle(props) {
  return (
    <>
      <div className={`tw-card-title flex-1 ${props.className ? props.className : ''}`}>
        <props.as className="mb-2">{props.children}</props.as>
      </div>
    </>
  );
};

Card.Subtitle = function CardSubtitle(props) {
  return (
    <>
      <div className={`tw-card-subtitle flex-1 ${props.className ? props.className : ''}`}>
        {props.children}
      </div>
    </>
  );
};

Card.Body = function CardBody(props) {
  return (
    <>
      <div
        {...props}
        className={`tw-card-body flex-1 p-4 ${props.className ? props.className : ''}`}
      >
        {props.children}
      </div>
    </>
  );
};

Card.Footer = function CardFooter(props) {
  return (
    <>
      <div
        className={` tw-card-footer bg-light-gray border-border-gray py-2 px-4 ${
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
