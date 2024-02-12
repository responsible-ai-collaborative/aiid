import React, { useEffect, useState } from 'react';
import { useQueryParam } from 'use-query-params';
import { DisplayModeEnumParam } from './queryParams';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTh, faThList, faInfo } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'flowbite-react';
import { useInstantSearch } from 'react-instantsearch';

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

  const { indexUiState, setIndexUiState } = useInstantSearch();

  const [, setConfigure] = useState({ ...indexUiState.configure });

  useEffect(() => {
    setConfigure((configure) => ({ ...configure, ...indexUiState.configure }));
  }, [indexUiState]);

  const onChange = (key) => {
    setDisplay(key);
    setIndexUiState((previousState) => {
      return {
        ...previousState,
        refinementList: {
          ...previousState.refinementList,
          display: [key],
        },
        configure: {
          ...previousState.configure,
        },
      };
    });

    setConfigure((configure) => ({ ...configure }));
  };

  return (
    <div className="flex gap-1">
      {Object.keys(modes).map((key) => (
        <Button
          key={key}
          onClick={() => onChange(key)}
          size="sm"
          className={`${
            key == display
              ? 'bg-gray-700 hover:bg-gray-800 selected'
              : 'bg-gray-500 hover:bg-gray-700'
          } text-white w-8`}
          data-cy={`display-mode-${key}`}
        >
          <FontAwesomeIcon icon={modes[key].icon} />
        </Button>
      ))}
    </div>
  );
}
