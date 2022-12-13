import React, { useState } from 'react';
import { connectSortBy } from 'react-instantsearch-dom';
import { Dropdown } from 'flowbite-react';

function Sorting(props) {
  const [selectedItem, setSelectedItem] = useState('Incident Date Desc');

  return (
    <>
      <div className="flex justify-end">
        <Dropdown label={selectedItem} color={'light'}>
          {props.items.map((item) => (
            <Dropdown.Item
              key={item.value}
              value={item.value}
              style={{ fontWeight: item.isRefined ? 'bold' : '' }}
              onClick={() => {
                setSelectedItem(item.label);
                props.refine(item.value);
              }}
            >
              {item.label}
            </Dropdown.Item>
          ))}
        </Dropdown>
      </div>
    </>
  );
}

const DiscoverSorting = connectSortBy(Sorting);

export default DiscoverSorting;
