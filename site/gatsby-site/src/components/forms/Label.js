import React, { useState } from 'react';
import { OverlayTrigger, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

const Label = ({ popover, placement, trigger, label }) => {
  const [show, setShow] = useState(false);

  if (!popover) {
    return <Form.Label>{label} :</Form.Label>;
  }
  return (
    <OverlayTrigger
      trigger={trigger}
      placement={placement}
      overlay={popover}
      {...(show ? { show } : {})}
    >
      <Form.Label>
        {label}{' '}
        <FontAwesomeIcon
          icon={faQuestionCircle}
          style={{ color: 'rgb(210, 210, 210)', cursor: 'pointer' }}
          className="far fa-question-circle"
          onClick={() => setShow(!show)}
        />{' '}
        :
      </Form.Label>
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
