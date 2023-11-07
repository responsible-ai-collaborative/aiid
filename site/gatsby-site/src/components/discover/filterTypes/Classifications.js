import React, { useState } from 'react';
import { useRefinementList, useInstantSearch } from 'react-instantsearch';

/* eslint-disable jsx-a11y/click-events-have-key-events */

function Attribute({ name, refinement }) {
  const [collapsed, setCollapsed] = useState(true);

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
          {refinement.items.map((item) => {
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

function Namespace({ taxonomy, refinement }) {
  const [collapsed, setCollapsed] = useState(true);

  const { namespace } = taxonomy;

  const refinements = {};

  for (const field of taxonomy.field_list) {
    const key = `${namespace}.${field.short_name}`;

    const refinement = useRefinementList({ attribute: key, limit: 100 });

    refinements[field.short_name] = refinement;
  }

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
          {Object.keys(refinements).map((name) => {
            const refinement = refinements[name];

            return <Attribute key={name} name={name} refinement={refinement} />;
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

export default function Hierarchical({ taxa }) {
  const { indexUiState } = useInstantSearch();

  const { items: namespaces } = useRefinementList({ attribute: 'namespaces' });

  const selectedAttributes = Object.keys(indexUiState.refinementList).filter((key) => {
    return taxa.map((t) => t.namespace).some((n) => key.startsWith(`${n}.`));
  });

  return (
    <div>
      <div className="space-y-1">
        {selectedAttributes.map((attribute) => {
          return <SelectedRefinement key={attribute} attribute={attribute} />;
        })}
      </div>

      <div className="mt-3 space-y-2">
        {namespaces.map((refinement) => {
          const taxonomy = taxa.find((t) => t.namespace === refinement.value);

          return <Namespace key={refinement.value} taxonomy={taxonomy} refinement={refinement} />;
        })}
      </div>
    </div>
  );
}

export const touchedCount = ({ searchState }) => {
  return Object.keys(searchState.refinementList).filter((key) => key.split('.').length > 1).length;
};
