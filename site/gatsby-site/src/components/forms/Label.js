import React, { useState } from 'react';
import { OverlayTrigger } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import { Trans, useTranslation } from 'react-i18next';
import Link from 'components/ui/Link';

const Label = ({ popover, label, required = false }) => {
  const [show, setShow] = useState(false);

  const { i18n } = useTranslation(['popovers']);

  if (!i18n.exists(popover, { ns: 'popovers' })) {
    return (
      <label className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-300 relative">
        {required && <>* </>}
        {label}
      </label>
    );
  }

  const Tooltip = (
    <div
      className="inline-block absolute z-10 text-sm font-medium  bg-gray-200 rounded-lg shadow-sm tooltip dark:bg-gray-700 max-w-xs bottom-2 imtooltip"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      data-cy={`popover-${popover}`}
    >
      <h5 className="bg-gray-900 border border-gray-900 py-2 px-3 rounded-t-lg text-gray-50">
        <Trans ns="popovers" i18nKey={`${popover}.title`} />
      </h5>
      <div className="py-2 px-3 text-black">
        <Trans ns="popovers" i18nKey={`${popover}.text`} components={{ linkto: <Link /> }} />
      </div>
      <div className="tooltip-arrow left-4 sm:left-1/2 " data-popper-arrow></div>
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
        <label
          data-cy={`label-${popover}`}
          className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-300 relative whitespace-nowrap"
        >
          {required && <>* </>}
          <span className="whitespace-normal mr-1">{label}</span>
          <FontAwesomeIcon
            icon={faQuestionCircle}
            style={{ color: 'rgb(210, 210, 210)', cursor: 'pointer' }}
            className="far fa-question-circle"
            onClick={() => setShow(!show)}
          />{' '}
        </label>
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

export default Label;
