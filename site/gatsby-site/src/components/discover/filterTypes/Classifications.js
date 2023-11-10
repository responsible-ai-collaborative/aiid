import TextInputGroup from 'components/forms/TextInputGroup';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRefinementList, useInstantSearch } from 'react-instantsearch';
import debounce from 'lodash/debounce';

/* eslint-disable jsx-a11y/click-events-have-key-events */

function Attribute({ name, refinement, searchResults }) {
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    if (searchResults.length > 0) {
      setCollapsed(false);
    }
  }, [searchResults]);

  if (refinement.items.length === 0) {
    return null;
  }

  return (
    <div>
      <div
        className="text-sm cursor-pointer"
        role="button"
        tabIndex={0}
        onClick={() => setCollapsed((c) => !c)}
      >
        {name} ({refinement.items.length}){' '}
        <div className="inline-block">{collapsed ? <>+</> : <>-</>} </div>
      </div>

      {!collapsed && (
        <div className="flex flex-wrap gap-2 mt-2">
          {refinement.items
            .filter(
              (item) =>
                searchResults.length == 0 ||
                searchResults.map((r) => r.value.split(':')[2]).includes(item.value)
            )
            .map((item) => {
              return (
                <div
                  key={item.value}
                  className="cursor-pointer inline-block p-1 border rounded-md text-xs"
                  role="button"
                  tabIndex={0}
                  onClick={() => refinement.refine(item.value)}
                >
                  {item.label} ({item.count}){' '}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

function Namespace({ taxonomy, refinement, searchResults }) {
  const [collapsed, setCollapsed] = useState(true);

  const { namespace } = taxonomy;

  const refinements = {};

  for (const field of taxonomy.field_list) {
    const key = `${namespace}.${field.short_name}`;

    const refinement = useRefinementList({ attribute: key, limit: 999 });

    refinements[field.short_name] = refinement;
  }

  useEffect(() => {
    if (searchResults.length > 0) {
      setCollapsed(false);
    }
  }, [searchResults]);

  return (
    <div key={namespace}>
      <div
        className="font-bold cursor-pointer"
        role="button"
        tabIndex={0}
        onClick={() => setCollapsed((c) => !c)}
      >
        {namespace} ({refinement.count}){' '}
        <div className="inline-block">{collapsed ? <>+</> : <>-</>} </div>
      </div>
      {!collapsed && (
        <div className="space-y-2 mt-1 max-h-60	overflow-y-scroll">
          {Object.keys(refinements)
            .filter(
              (name) =>
                searchResults.length == 0 ||
                searchResults.map((r) => r.value.split(':')[1]).includes(name)
            )
            .map((name) => {
              const refinement = refinements[name];

              return (
                <Attribute
                  key={name}
                  name={name}
                  refinement={refinement}
                  searchResults={searchResults}
                />
              );
            })}
        </div>
      )}
    </div>
  );
}

function SelectedRefinement({ attribute }) {
  const { items, refine } = useRefinementList({ attribute, limit: 100 });

  const [namespace, name] = attribute.split('.');

  return items
    .filter((item) => item.isRefined)
    .map((item) => (
      <div
        key={item.value}
        className="cursor-pointer border text-xs p-1 rounded-md bg-green-100"
        role="button"
        tabIndex={0}
        onClick={() => refine(item.value)}
      >
        <b>{namespace}</b> : {name} : {item.label}
      </div>
    ));
}

function Search({ setSearchResults }) {
  const { t } = useTranslation();

  const {
    items: searchItems,
    searchForItems,
    isFromSearch,
  } = useRefinementList({ attribute: 'classifications' });

  const [query, setQuery] = useState('');

  const debouncedSearchForItems = useCallback(
    debounce((query) => {
      searchForItems(query);
    }, 1000),
    []
  );

  useEffect(() => {
    if (query.length > 2) {
      debouncedSearchForItems(query);
    }

    if (query.length == 0) {
      setSearchResults([]);
    }
  }, [query]);

  useEffect(() => {
    if (isFromSearch) {
      setSearchResults(searchItems);
    }
  }, [searchItems, isFromSearch]);

  return (
    <div className="mt-2">
      <TextInputGroup
        name="query"
        label={'Search'}
        placeholder={t('Search')}
        schema={null}
        icon={null}
        type="search"
        values={{ query }}
        errors={{}}
        touched={{}}
        handleChange={(e) => setQuery(e.currentTarget.value)}
      />
    </div>
  );
}

export default function Hierarchical({ taxa }) {
  const { indexUiState } = useInstantSearch();

  const { items: namespaces } = useRefinementList({ attribute: 'namespaces' });

  const selectedAttributes = Object.keys(indexUiState.refinementList).filter((key) => {
    return taxa.map((t) => t.namespace).some((n) => key.startsWith(`${n}.`));
  });

  const [searchResults, setSearchResults] = useState([]);

  return (
    <div>
      <div className="space-y-1">
        {selectedAttributes.map((attribute) => {
          return <SelectedRefinement key={attribute} attribute={attribute} />;
        })}
      </div>

      <Search setSearchResults={setSearchResults} />

      <div className="mt-3 space-y-2">
        {namespaces
          .filter(
            (ns) =>
              searchResults.length == 0 ||
              searchResults.map((r) => r.value.split(':')[0]).includes(ns.value)
          )
          .map((refinement) => {
            const taxonomy = taxa.find((t) => t.namespace === refinement.value);

            return (
              <Namespace
                key={refinement.value}
                taxonomy={taxonomy}
                refinement={refinement}
                searchResults={searchResults}
              />
            );
          })}
      </div>
    </div>
  );
}

export const touchedCount = ({ searchState }) => {
  return Object.keys(searchState.refinementList).filter((key) => key.split('.').length > 1).length;
};
