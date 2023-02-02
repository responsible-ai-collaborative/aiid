import React, { useEffect, useState } from 'react';
import { connectSortBy } from 'react-instantsearch-dom';
import { Dropdown } from 'flowbite-react';
import { Trans, useTranslation } from 'react-i18next';

function Sorting(props) {
  const [selectedItem, setSelectedItem] = useState({
    label: 'Relevance',
    value: 'instant_search-en',
  });

  const { t } = useTranslation();

  const [selectedDirection, setSelectedDirection] = useState('');

  const sortResults = (item) => {
    setSelectedItem(item);
  };

  useEffect(() => {
    if (selectedItem.value !== 'instant_search-en') {
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
          <Dropdown.Item
            key={'instant_search-en'}
            value={'instant_search-en'}
            style={{ fontWeight: '' }}
            onClick={() => {
              sortResults({
                label: 'Relevance',
                value: 'instant_search-en',
              });
              setSelectedDirection('');
            }}
            className={`${'instant_search-en' === selectedItem.value ? 'bg-blue-100' : ''}`}
          >
            <Trans>Relevance</Trans>
          </Dropdown.Item>
          <Dropdown.Divider />
          {props.items.map((item) => (
            <Dropdown.Item
              key={item.value}
              value={item.value}
              style={{ fontWeight: item.isRefined ? 'bold' : '' }}
              onClick={() => {
                sortResults(item);
                if (selectedDirection === '') {
                  setSelectedDirection('desc');
                }
              }}
              className={`${item.value === selectedItem.value ? 'bg-blue-100' : ''}`}
            >
              <Trans>{item.label}</Trans>
            </Dropdown.Item>
          ))}
          <Dropdown.Divider />
          <Dropdown.Item
            value="asc"
            onClick={() => {
              setSelectedDirection('asc');
            }}
            className={`${selectedDirection === 'asc' ? 'bg-blue-100' : ''}`}
          >
            <span data-cy="sort-asc">
              <Trans>Asc</Trans>
            </span>
          </Dropdown.Item>
          <Dropdown.Item
            value="asc"
            onClick={() => {
              setSelectedDirection('desc');
            }}
            className={`${selectedDirection === 'desc' ? 'bg-blue-100' : ''}`}
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
