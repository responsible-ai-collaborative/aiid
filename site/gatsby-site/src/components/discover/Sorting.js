import React, { Fragment, useEffect, useState } from 'react';
import { useSortBy } from 'react-instantsearch';
import { Dropdown } from 'flowbite-react';
import { Trans, useTranslation } from 'react-i18next';
import SORTING_LIST from './SORTING_LISTS';
import { useLocalization } from 'plugins/gatsby-theme-i18n';
import { useInstantSearch } from 'react-instantsearch';

export default function Sorting() {
  const { locale } = useLocalization();

  const { indexUiState } = useInstantSearch();

  const { refine, currentRefinement, options } = useSortBy({ items: SORTING_LIST });

  const [selectedItem, setSelectedItem] = useState(
    SORTING_LIST.find((s) => s.name === currentRefinement) || SORTING_LIST.find((s) => s.default)
  );

  const { t } = useTranslation();

  const sortResults = (item) => {
    setSelectedItem(item);
  };

  useEffect(() => {
    if (selectedItem && selectedItem[`value_${locale}`] && indexUiState.refinementList) {
      const indexName = selectedItem[`value_${locale}`];

      if (indexName != currentRefinement) {
        refine(indexName);
      }
    }
  }, [selectedItem]);

  return (
    <>
      <div className="flex justify-end px-2 relative floating-label-dropdown">
        <span className="absolute left-4 -top-2 text-xs text-gray-400 bg-white px-2">
          <Trans>Sort by</Trans>
        </span>
        <Dropdown
          label={`${t(selectedItem.label)}`}
          color={'light'}
          data-cy="discover-sort"
          className="min-w-max"
        >
          {options.map((item) => (
            <Fragment key={item.name}>
              <Dropdown.Item
                key={item[`value_${locale}`]}
                value={item[`value_${locale}`]}
                style={{ fontWeight: item.isRefined ? 'bold' : 'normal' }}
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
            </Fragment>
          ))}
        </Dropdown>
      </div>
    </>
  );
}
