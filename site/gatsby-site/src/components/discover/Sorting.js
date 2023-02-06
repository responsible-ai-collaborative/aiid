import React, { useEffect, useState } from 'react';
import { connectSortBy } from 'react-instantsearch-dom';
import { Dropdown } from 'flowbite-react';
import { Trans, useTranslation } from 'react-i18next';
import SORTING_LIST from './SORTING_LISTS';

function Sorting(props) {
  const [selectedItem, setSelectedItem] = useState(SORTING_LIST.find((s) => s.default));

  const { t } = useTranslation();

  const [selectedDirection, setSelectedDirection] = useState('');

  const [disabledDirection, setDisabledDirection] = useState(true);

  const sortResults = (item) => {
    setSelectedItem(item);
    if (item.type === 'date' && disabledDirection) {
      setSelectedDirection('desc');
      setDisabledDirection(false);
    } else {
      setSelectedDirection('');
      setDisabledDirection(true);
    }
  };

  useEffect(() => {
    if (selectedItem.type === 'date') {
      props.refine(`${selectedItem.value}_${selectedDirection}`);
    } else {
      props.refine(`${selectedItem.value}`);
    }
  }, [selectedDirection, selectedItem]);

  return (
    <>
      <div className="flex justify-end px-2">
        <Dropdown
          label={`${t(selectedItem.label)} ${t(selectedDirection)}`}
          color={'light'}
          data-cy="discover-sort"
        >
          <Dropdown.Item className="text-gray-400 hover:bg-white">ORDER</Dropdown.Item>
          <Dropdown.Divider />
          {props.items.map((item) => (
            <Dropdown.Item
              key={item.value}
              value={item.value}
              style={{ fontWeight: item.isRefined ? 'bold' : '' }}
              onClick={() => {
                sortResults(item);
              }}
              className={`${item.value === selectedItem.value ? 'bg-blue-100' : ''}`}
            >
              <span data-cy={item.name + '-sort'}>
                <Trans>{item.label}</Trans>
              </span>
            </Dropdown.Item>
          ))}
          <Dropdown.Divider />
          <Dropdown.Item
            value="asc"
            onClick={() => {
              if (!disabledDirection) {
                setSelectedDirection('asc');
              }
            }}
            className={`${
              disabledDirection ? 'text-gray-400' : selectedDirection === 'asc' ? 'bg-blue-100' : ''
            }`}
          >
            <span data-cy="sort-asc">
              <Trans>Asc</Trans>
            </span>
          </Dropdown.Item>
          <Dropdown.Item
            value="asc"
            onClick={() => {
              if (!disabledDirection) {
                setSelectedDirection('desc');
              }
            }}
            className={`${
              disabledDirection
                ? 'text-gray-400'
                : selectedDirection === 'desc'
                ? 'bg-blue-100'
                : ''
            }`}
            data-cy="sort-asc"
          >
            <span data-cy="sort-desc">
              <Trans>Desc</Trans>
            </span>
          </Dropdown.Item>
        </Dropdown>
      </div>
    </>
  );
}

const DiscoverSorting = connectSortBy(Sorting);

export default DiscoverSorting;
