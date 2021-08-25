import React from 'react';
import { OverlayTrigger, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';

const Label = ({ popover, placement, trigger, label }) => {
  if (!popover) {
    return <Form.Label>{label}</Form.Label>;
  }

  return (
    <OverlayTrigger trigger={trigger} placement={placement} overlay={popover}>
      <Form.Label>{label}</Form.Label>
    </OverlayTrigger>
  );
};

Label.propTypes = {
  popover: PropTypes.node,
  placement: PropTypes.oneOf([
    'auto',
    'auto-start',
    'auto-end',
    'top',
    'bottom',
    'right',
    'left',
    'top-start',
    'top-end',
    'bottom-start',
    'bottom-end',
    'right-start',
    'right-end',
    'left-start',
    'left-end',
  ]),
  trigger: PropTypes.arrayOf(PropTypes.oneOf(['hover', 'focus', 'click'])),
  label: PropTypes.string.isRequired,
};
Label.defaultProps = {
  placement: 'top',
  trigger: ['hover', 'focus'],
};

export default Label;
