import React, { useEffect, useState } from 'react';
import { Dropdown } from 'flowbite-react';
import isEqual from 'lodash/isEqual';
import { Trans } from 'react-i18next';
import { useInstantSearch, useConfigure, useRefinementList } from 'react-instantsearch';

const findIndex = (displayOptions, indexUiState) => {
  return displayOptions.findIndex(({ state }) => {
    return (
      indexUiState.configure.distinct == state.configure.distinct &&
      isEqual(
        indexUiState.refinementList.is_incident_report,
        state.refinementList.is_incident_report
      )
    );
  });
};

const displayOptions = [
  {
    text: 'Incidents',
    state: { configure: { distinct: true }, refinementList: { is_incident_report: ['true'] } },
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
    state: { configure: { distinct: false }, refinementList: { is_incident_report: ['true'] } },
  },
  {
    text: 'Issue Reports',
    state: { configure: { distinct: false }, refinementList: { is_incident_report: ['false'] } },
  },
];

const DisplayOptions = () => {
  const { indexUiState, setIndexUiState } = useInstantSearch();

  const [selectedIndex, setSelectedIndex] = useState(findIndex(displayOptions, indexUiState));

  const selectedOption = displayOptions[selectedIndex];

  useConfigure({ distinct: selectedOption.state.configure.distinct, hitsPerPage: 28 });
  useRefinementList({ attribute: 'is_incident_report' });

  useEffect(() => {
    const { state } = displayOptions[selectedIndex];

    setIndexUiState((prevIndexUiState) => {
      const update = {
        ...prevIndexUiState,
        refinementList: {
          ...prevIndexUiState.refinementList,
          ...state.refinementList,
        },
        configure: {
          ...prevIndexUiState.configure,
          ...state.configure,
        },
      };

      return update;
    });
  }, [selectedIndex]);

  return (
    <div className="flex justify-end px-2 relative floating-label-dropdown">
      <span className="absolute left-4 -top-2 text-xs text-gray-400 bg-white px-2">
        <Trans>Display Option</Trans>
      </span>

      <Dropdown
        label={selectedIndex > -1 && displayOptions[selectedIndex].text}
        color={'light'}
        className="min-w-max"
      >
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
    </div>
  );
};

export default DisplayOptions;
