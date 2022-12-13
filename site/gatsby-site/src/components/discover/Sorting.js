import React, { useEffect, useState } from 'react';
import { connectSortBy } from 'react-instantsearch-dom';
import { Dropdown } from 'flowbite-react';

function Sorting(props) {
  const [selectedItem, setSelectedItem] = useState({
    label: 'Incident Date',
    value: 'instant_search-en_epoch_incident_date',
  });

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
        <Dropdown label={selectedItem.label} color={'light'}>
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
              {item.label}
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
            Asc
          </Dropdown.Item>
          <Dropdown.Item
            value="asc"
            onClick={() => {
              setSelectedDirection('desc');
            }}
            className={`${selectedDirection === 'desc' ? 'bg-blue-100' : ''}`}
          >
            Desc
          </Dropdown.Item>
        </Dropdown>
      </div>
    </>
  );
}

const DiscoverSorting = connectSortBy(Sorting);

export default DiscoverSorting;
