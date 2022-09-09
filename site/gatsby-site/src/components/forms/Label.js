import React, { useEffect, useState } from 'react';
import { OverlayTrigger, Form, Popover } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import { Trans, useTranslation } from 'react-i18next';
import Link from 'components/ui/Link';

const Label = ({ popover, label }) => {
  const [show, setShow] = useState(false);

  const { i18n } = useTranslation(['popovers']);

  if (!i18n.exists(popover, { ns: 'popovers' })) {
    return <Form.Label>{label} :</Form.Label>;
  }

  const Tooltip = (
    <div
      className="inline-block absolute z-10 py-2 px-3 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm tooltip dark:bg-gray-700 max-w-xs bottom-2 imtooltip left-0"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <h5>
        <Trans ns="popovers" i18nKey={`${popover}.title`} />
      </h5>
      <Trans ns="popovers" i18nKey={`${popover}.text`} components={{ linkto: <Link /> }} />
      <div className="tooltip-arrow right-28" data-popper-arrow></div>
    </div>
  );

  return (
    <>
      <OverlayTrigger
        placement="top"
        overlay={Tooltip}
        {...(show ? { show } : {})}
        delay={{ show: 0, hide: 300 }}
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

// This is used to force the popover to re-render to adjust correctly to the label's position
const UpdatingPopover = React.forwardRef(({ popper, children, ...props }, ref) => {
  useEffect(() => {
    setTimeout(() => {
      popper.scheduleUpdate();
    }, 0);
  }, [children, popper]);

  return (
    <Popover ref={ref} {...props}>
      {children}
    </Popover>
  );
});

UpdatingPopover.displayName = 'UpdatingPopover';

export default Label;
