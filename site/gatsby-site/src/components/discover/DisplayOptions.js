import React, { useContext, useEffect, useState } from 'react';
import { Dropdown } from 'flowbite-react';
import isEqual from 'lodash/isEqual';
import { Trans } from 'react-i18next';
import { useInstantSearch } from 'react-instantsearch';
import { ConfigureContext } from './ConfigureContext';

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

  const { configure, setConfigure } = useContext(ConfigureContext);

  const [refinementList, setRefinementList] = useState({ ...indexUiState.refinementList });

  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    if (selectedIndex > -1) {
      const { state } = displayOptions[selectedIndex];

      setRefinementList({ ...state.refinementList });
      setConfigure({ ...state.configure });
    }
  }, [selectedIndex]);

  useEffect(() => {
    const index = findIndex(displayOptions, { refinementList, configure });

    setSelectedIndex(index);

    const update = { ...indexUiState, refinementList, configure };

    const sameConfigure = isEqual(configure, update.configure);

    const sameRefinement = isEqual(
      indexUiState.refinementList.is_incident_report,
      update.refinementList.is_incident_report
    );

    if (!sameConfigure || !sameRefinement) {
      setIndexUiState(update);
    }
  }, [indexUiState, refinementList, configure]);

  return (
    <div className="flex justify-end px-2 relative floating-label-dropdown">
      <span className="absolute left-4 -top-2 text-xs text-gray-400 bg-white px-2">
        <Trans>Display Option</Trans>
      </span>

      {selectedIndex > -1 && (
        <Dropdown label={displayOptions[selectedIndex].text} color={'light'} className="min-w-max">
          {displayOptions.map(({ text }, index) => (
            <Dropdown.Item
              key={text}
              onClick={() => setSelectedIndex(index)}
              className={`${text === displayOptions[selectedIndex].text ? 'bg-blue-100' : ''}`}
            >
              <span>{text}</span>
            </Dropdown.Item>
          ))}
        </Dropdown>
      )}
    </div>
  );
};

export default DisplayOptions;
