import React from 'react';
import Stats from './Stats';
import DisplayModeSwitch from './DisplayModeSwitch';
import Filters from './Filters';
import CsvExport from './CsvExport';
import Sorting from './Sorting';
import { useInstantSearch } from 'react-instantsearch';

const Controls = () => {
  const { indexUiState } = useInstantSearch();

  return (
    <>
      <div className="justify-between gap-2 mt-4 flex flex-wrap items-center">
        <div className="flex gap-4 items-center flex-wrap">
          <div className="flex items-center">
            <Stats />
          </div>
          <div className="place-self-center">
            <DisplayModeSwitch />
          </div>
        </div>

        <div className="flex flex-grow justify-end items-center flex-wrap">
          <div className="place-self-center">
            <CsvExport />
          </div>

          <Sorting />

          <div className="grid place-content-center"></div>
        </div>
      </div>
      <div className={'mb-3 invisible h-0 md:visible h-auto'}>
        <Filters {...{ indexUiState }} />
      </div>
    </>
  );
};

export default Controls;
