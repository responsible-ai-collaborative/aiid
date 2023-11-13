import React, { useCallback, useEffect, useState } from 'react';
import { Dropdown } from 'flowbite-react';
import isEqual from 'lodash/isEqual';
import { Trans } from 'react-i18next';
import { Configure, useInstantSearch } from 'react-instantsearch';

const findIndex = (displayOptions, currentState) => {
  return displayOptions.findIndex(({ state }) => {
    return (
      currentState.configure &&
      currentState.configure.distinct == state.configure.distinct &&
      isEqual(
        currentState.refinementList.is_incident_report,
        state.refinementList.is_incident_report
      )
    );
  });
};

const displayOptions = [
  {
    text: 'Incidents',
    state: {
      configure: { distinct: true },
      refinementList: { is_incident_report: ['true'] },
    },
  },
  {
    text: 'Incident and Issue Reports',
    state: {
      configure: { distinct: false },
      refinementList: { is_incident_report: ['false', 'true'] },
    },
  },
  {
    text: 'Incident Reports',
    state: {
      configure: { distinct: false },
      refinementList: { is_incident_report: ['true'] },
    },
  },
  {
    text: 'Issue Reports',
    state: {
      configure: { distinct: false },
      refinementList: { is_incident_report: ['false'] },
    },
  },
];

const DisplayOptions = () => {
  const { indexUiState, setIndexUiState } = useInstantSearch();

  const [configure, setConfigure] = useState({ ...indexUiState.configure });

  const [selectedIndex, setSelectedIndex] = useState(-1);

  const selectItem = useCallback((index) => {
    const { state } = displayOptions[index];

    setIndexUiState((previousState) => {
      return {
        ...previousState,
        refinementList: {
          ...previousState.refinementList,
          ...state.refinementList,
        },
        configure: {
          ...previousState.configure,
          ...state.configure,
        },
      };
    });

    setSelectedIndex(index);

    setConfigure((configure) => ({ ...configure, ...state.configure }));
  }, []);

  useEffect(() => {
    const index = findIndex(displayOptions, indexUiState);

    setConfigure((configure) => ({ ...configure, ...indexUiState.configure }));
    setSelectedIndex(index);
  }, [indexUiState]);

  return (
    <div className="flex justify-end px-2 relative floating-label-dropdown">
      <span className="absolute left-4 -top-2 text-xs text-gray-400 bg-white px-2">
        <Trans>Display Option</Trans>
      </span>

      <Configure {...configure} />

      <Dropdown label={displayOptions[selectedIndex]?.text} color={'light'} className="min-w-max">
        {displayOptions.map(({ text }, index) => (
          <Dropdown.Item
            key={text}
            onClick={() => selectItem(index)}
            className={`${text === displayOptions[selectedIndex]?.text ? 'bg-blue-100' : ''}`}
          >
            <span>{text}</span>
          </Dropdown.Item>
        ))}
      </Dropdown>
    </div>
  );
};

export default DisplayOptions;
