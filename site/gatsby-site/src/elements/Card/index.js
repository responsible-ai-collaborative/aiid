import React from 'react';
export default function Card(props) {
  return (
    <>
      <div {...props} className={`tw-card ${props.className ? props.className : ''}`}>
        {props.children}
      </div>
    </>
  );
}

Card.Header = function CardHeader(props) {
  return (
    <div {...props} className={`tw-card-header ${props.className ? props.className : ''}`}>
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

Card.Footer = function CardFooter(props) {
  return (
    <>
      <div className={`tw-card-footer ${props.className ? props.className : ''}`}>
        {props.children}
      </div>
    </>
  );
};

Card.Text = function CardText(props) {
  return (
    <>
      <p className={`${props.className ? props.className : ''}`}>{props.children}</p>
    </>
  );
};
