import React, { useEffect, useState } from 'react';
import { connectSortBy } from 'react-instantsearch-dom';
import { Dropdown } from 'flowbite-react';
import { Trans, useTranslation } from 'react-i18next';
import SORTING_LIST from './SORTING_LISTS';
import { useLocalization } from 'gatsby-theme-i18n';

function Sorting(props) {
  const { locale } = useLocalization();

  const [selectedItem, setSelectedItem] = useState(
    SORTING_LIST.find((s) => s.name === props.defaultRefinement) ||
      SORTING_LIST.find((s) => s.default)
  );

  const { t } = useTranslation();

  const sortResults = (item) => {
    setSelectedItem(item);
  };

  useEffect(() => {
    if (selectedItem && selectedItem[`value_${locale}`]) {
      props.refine(selectedItem[`value_${locale}`]);
    }
  }, [selectedItem]);

  return (
    <>
      <div className="flex justify-end px-2 relative">
        <span className="absolute left-4 -top-2 text-xs text-gray-400 bg-white px-2">
          <Trans>Sort by</Trans>
        </span>
        <Dropdown
          label={`${t(selectedItem.label)}`}
          color={'light'}
          data-cy="discover-sort"
          className="min-w-max"
        >
          {props.items.map((item) => (
            <>
              <Dropdown.Item
                key={item[`value_${locale}`]}
                value={item[`value_${locale}`]}
                style={{ fontWeight: item.isRefined ? 'bold' : '' }}
                onClick={() => {
                  sortResults(item);
                }}
                className={`${
                  item[`value_${locale}`] === selectedItem[`value_${locale}`] ? 'bg-blue-100' : ''
                }`}
              >
                <span data-cy={item.name + '-sort'}>
                  <Trans>{item.label}</Trans>
                </span>
              </Dropdown.Item>
              {item.division && <Dropdown.Divider />}
            </>
          ))}
        </Dropdown>
      </div>
    </>
  );
}

const DiscoverSorting = connectSortBy(Sorting);

export default DiscoverSorting;
