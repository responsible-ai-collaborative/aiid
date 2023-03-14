import React from 'react';
import { Dropdown } from 'flowbite-react';
import useSearch from './useSearch';
import isEqual from 'lodash/isEqual';
import { Trans } from 'react-i18next';

const DisplayOptions = () => {
  const { setSearchState, searchState } = useSearch();

  const displayOptions = [
    { text: 'Incidents', state: { hideDuplicates: 'true', is_incident_report: ['true'] } },
    {
      text: 'Incident and Issue Reports',
      state: { hideDuplicates: '', is_incident_report: ['false', 'true'] },
    },
    { text: 'Incident Reports', state: { hideDuplicates: '', is_incident_report: ['true'] } },
    { text: 'Issue Reports', state: { hideDuplicates: '', is_incident_report: ['false'] } },
  ];

  const setDisplay = (index) => {
    const { state } = displayOptions[index];

    setSearchState((searchState) => ({
      ...searchState,
      refinementList: {
        ...searchState.refinementList,
        ...state,
      },
    }));
  };

  const selectedIndex = displayOptions.findIndex(({ state }) => {
    return (
      !!searchState.refinementList.hideDuplicates == !!state.hideDuplicates &&
      isEqual(searchState.refinementList.is_incident_report, state.is_incident_report)
    );
  });

  return (
    <div className="flex justify-end px-2 relative">
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
            onClick={() => setDisplay(index)}
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
