import React from 'react';
import { useQueryParam } from 'use-query-params';
import { DisplayModeEnumParam } from './queryParams';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTh, faThList, faInfo } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'flowbite-react';

function ModeButton({ icon, ...rest }) {
  return (
    <Button
      {...rest}
      size="sm"
      className={`${rest.active ? 'bg-gray-700' : 'bg-gray-500'} text-white w-8`}
    >
      <FontAwesomeIcon icon={icon} />
    </Button>
  );
}

const modes = {
  details: {
    icon: faInfo,
  },
  compact: {
    icon: faTh,
  },
  list: {
    icon: faThList,
  },
};

export default function DisplayModeSwitch() {
  const [display, setDisplay] = useQueryParam('display', DisplayModeEnumParam);

  const onChange = (key) => {
    setDisplay(key);
  };

  return (
    <div className="flex gap-1">
      {Object.keys(modes).map((key) => (
        <ModeButton
          variant="secondary"
          active={key == display}
          key={key}
          icon={modes[key].icon}
          onClick={() => onChange(key)}
        />
      ))}
    </div>
  );
}
