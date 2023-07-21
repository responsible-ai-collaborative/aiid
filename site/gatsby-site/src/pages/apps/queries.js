import React, { useCallback, useState, useEffect } from 'react';
import { StringParam, useQueryParams, withDefault } from 'use-query-params';
import algoliasearch from 'algoliasearch/lite';
import { Configure, InstantSearch } from 'react-instantsearch-dom';
import AiidHelmet from 'components/AiidHelmet';

import { useLocalization } from 'plugins/gatsby-theme-i18n';
import Container from 'elements/Container';
import Row from 'elements/Row';
import Col from 'elements/Col';
import { VIEW_TYPES } from 'utils/discover';
import SORTING_LIST from 'components/discover/SORTING_LISTS';
import { DEFAULT_SEARCH_KEYS_VALUES } from 'components/discover/DEFAULT_SEARCH_KEYS_VALUES';
import difference from 'lodash/difference';
import queryTypes from 'components/queries/queryTypes';
import { Dropdown } from 'flowbite-react';


const queryConfig = {
  s: StringParam,
}

function DiscoverApp(props) {
  const [query, setQuery] = useQueryParams(queryConfig);

  const { locale } = useLocalization();

  const [filters, setFilters] = useState([]);


  const addFilter = useCallback((type) => {

    const count = filters.filter(filter => filter.type === type).length;
    const id = `${type}-${count}`;

    setFilters(filters => [...filters, { type, id }])

  }, [filters]);


  useEffect(() => {

    for(const filter of filters) {
      
    }

  }, [filters]);

  return (
    <div {...props} className="w-full">
      <AiidHelmet path={props.location.pathname}>
        <title>Artificial Intelligence Incident Database</title>
      </AiidHelmet>

      <div>
        <Dropdown
          label={"Add item"}
          color={'light'}
          className="min-w-max"
        >
          <Dropdown.Item
            key={'direct'}
            onClick={() => addFilter('direct')}
          >
            Direct
          </Dropdown.Item>
        </Dropdown>

      </div>
      <div>
        {filters.map(filter => {

          const Component = queryTypes[filter.type].default;

          return <Component key={filter.id} setFilters={setFilters} {...filter} />
        })}
      </div>
    </div>
  );
}

export default DiscoverApp;
