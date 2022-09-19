import React, { useState } from 'react';
import { OverlayTrigger, Form, Popover as BootstrapPopover } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import { Trans, useTranslation } from 'react-i18next';
import Link from 'components/ui/Link';
import Popover from 'elements/Popover';

const Label = ({ popover, label }) => {
  const [show, setShow] = useState(false);

  const { i18n } = useTranslation(['popovers']);

  if (!i18n.exists(popover, { ns: 'popovers' })) {
    return <Form.Label>{label} :</Form.Label>;
  }

  return (
    <>
      <div className="bootstrap">
        <OverlayTrigger
          placement={'top'}
          overlay={
            <Popover data-cy={`popover-${popover}`}>
              <BootstrapPopover.Header as="h3">
                <Trans ns="popovers" i18nKey={`${popover}.title`} />
              </BootstrapPopover.Header>
              <BootstrapPopover.Body>
                <Trans
                  ns="popovers"
                  i18nKey={`${popover}.text`}
                  components={{ linkto: <Link /> }}
                />
              </BootstrapPopover.Body>
            </Popover>
          }
          {...(show ? { show } : {})}
        >
          <Form.Label data-cy={`label-${popover}`} className="relative">
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
      </div>
    </>
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
