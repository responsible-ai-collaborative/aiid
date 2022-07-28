import React from 'react';

export default function Card(props) {
  return (
    <>
      <div className={`tw-card ${props.className ? props.className : ''}`} {...props}>
        {props.children}
      </div>
    </>
  );
}

Card.Header = function CardHeader(props) {
  return (
    <div className={`tw-card-header ${props.className ? props.className : ''}`} {...props}>
      {props.children}
    </div>
  );
};

Card.Title = function CardTitle(props) {
  return (
    <>
      <div className="tw-card-title">{props.children}</div>
    </>
  );
};

Card.Body = function CardBody(props) {
  return (
    <>
      <div className={`tw-card-body ${props.className ? props.className : ''}`}>
        {props.children}
      </div>
    </>
  );
};
