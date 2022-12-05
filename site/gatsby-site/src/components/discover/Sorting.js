import React from 'react';
import SORTING_LISTS from 'components/discover/SORTING_LISTS';
import { Dropdown } from 'flowbite-react';
import { Trans } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Sorting() {
  return (
    <div className="flex justify-end">
      <Dropdown label="Sort by" color={'light'}>
        {SORTING_LISTS.map((list) => (
          <Dropdown.Item key={`sorting-${list.attribute}`}>
            <div className="flex gap-2 justify-between w-full">
              <Trans>{list.label}</Trans>
              {list.faIcon && <FontAwesomeIcon icon={list.faIcon} />}
            </div>
          </Dropdown.Item>
        ))}
        <Dropdown.Divider />
        <Dropdown.Item>
          <div className="flex justify-between w-full">
            Asc
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h5a1 1 0 000-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM13 16a1 1 0 102 0v-5.586l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 101.414 1.414L13 10.414V16z"></path>
            </svg>
          </div>
        </Dropdown.Item>
        <Dropdown.Item>
          <div className="flex justify-between w-full">
            Desc
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h7a1 1 0 100-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z"></path>
            </svg>
          </div>
        </Dropdown.Item>
      </Dropdown>
    </div>
  );
}

export default Sorting;
