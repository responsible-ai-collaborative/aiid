import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Dropdown } from 'flowbite-react';
import isEqual from 'lodash/isEqual';
import { Trans, useTranslation } from 'react-i18next';
import { useInstantSearch } from 'react-instantsearch';
import DiscoverConfigureContext from './DiscoverConfigureContext';

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

  // `distinct` is declared on the single <Configure> in Discover.js.
  // SEE: DiscoverConfigureContext.
  const { setDistinct } = useContext(DiscoverConfigureContext);

  const [selectedIndex, setSelectedIndex] = useState(-1);

  const { t } = useTranslation();

  const selectItem = useCallback((index) => {
    const { state } = displayOptions[index];

    setIndexUiState((previousState) => {
      return {
        ...previousState,
        refinementList: {
          ...previousState.refinementList,
          ...state.refinementList,
        },
      };
    });

    setDistinct(state.configure.distinct);

    setSelectedIndex(index);
  }, []);

  useEffect(() => {
    setSelectedIndex(findIndex(displayOptions, indexUiState));
  }, [indexUiState]);

  return (
    <div className="flex justify-end px-2 relative floating-label-dropdown">
      <span className="absolute left-4 -top-2 text-xs text-gray-400 bg-white px-2">
        <Trans>Display Option</Trans>
      </span>

      <Dropdown
        label={t(displayOptions[selectedIndex]?.text)}
        color={'light'}
        className="min-w-max"
      >
        {displayOptions.map(({ text }, index) => (
          <Dropdown.Item
            key={text}
            onClick={() => selectItem(index)}
            className={`${text === displayOptions[selectedIndex]?.text ? 'bg-blue-100' : ''}`}
          >
            <span>
              <Trans>{text}</Trans>
            </span>
          </Dropdown.Item>
        ))}
      </Dropdown>
    </div>
  );
};

export default DisplayOptions;
