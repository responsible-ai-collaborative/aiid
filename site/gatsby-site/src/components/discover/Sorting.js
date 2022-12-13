import React, { useEffect, useState } from 'react';
import { connectSortBy } from 'react-instantsearch-dom';
import { Dropdown } from 'flowbite-react';
import { Trans, useTranslation } from 'react-i18next';

function Sorting(props) {
  const [selectedItem, setSelectedItem] = useState({
    label: 'Incident Date',
    value: 'instant_search-en_epoch_incident_date',
  });

  const { t } = useTranslation();

  const [selectedDirection, setSelectedDirection] = useState('desc');

  const sortResults = (item) => {
    setSelectedItem(item);
  };

  useEffect(() => {
    props.refine(`${selectedItem.value}_${selectedDirection}`);
  }, [selectedDirection, selectedItem]);

  return (
    <>
      <div className="flex justify-end px-2">
        <Dropdown label={`${t(selectedItem.label)} - ${t(selectedDirection)}`} color={'light'}>
          <Dropdown.Item className="text-gray-400 hover:bg-white">ORDER</Dropdown.Item>
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
            <Trans>Asc</Trans>
          </Dropdown.Item>
          <Dropdown.Item
            value="asc"
            onClick={() => {
              setSelectedDirection('desc');
            }}
            className={`${selectedDirection === 'desc' ? 'bg-blue-100' : ''}`}
          >
            <Trans>Desc</Trans>
          </Dropdown.Item>
        </Dropdown>
      </div>
    </>
  );
}

const DiscoverSorting = connectSortBy(Sorting);

export default DiscoverSorting;
