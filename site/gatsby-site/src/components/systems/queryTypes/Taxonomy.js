import { Button, Spinner } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import QueryBuilder from 'react-querybuilder';
import { gql, useQuery } from '@apollo/client';
import 'react-querybuilder/dist/query-builder.css';
import { Trans } from 'react-i18next';
import isValidFilter from '../isValidFilter';

const FIND_TAXONOMY = gql`
  query FindTaxonomy($input: TaxaQueryInput) {
    taxa(query: $input) {
      namespace
      description
      field_list {
        display_type
        permitted_values
        mongo_type
        short_name
      }
    }
  }
`;

export default function Builder({ id, setFilters, removeFilter, config, query = null }) {
  const [fields, setFields] = useState(null);

  const { data, loading } = useQuery(FIND_TAXONOMY, {
    variables: { query: { input: { namespace: config.namespace } } },
  });

  const handleChange = (query) => {
    setFilters((filters) =>
      filters.map((filter) => {
        if (filter.id === id) {
          return { ...filter, query };
        }

        return filter;
      })
    );
  };

  useEffect(() => {
    if (data?.taxa) {
      const fields = [];

      for (const field of data.taxa.field_list) {
        let operators = null;

        let values = null;

        let valueEditorType = null;

        let inputType = null;

        switch (field.display_type) {
          case 'string':
            operators = [{ name: 'contains', label: 'contains' }];
            break;

          case 'enum':
            valueEditorType = 'select';
            operators = [
              { name: '=', label: 'Equals' },
              { name: '!=', label: 'Not Equals' },
            ];
            values = field.permitted_values.map((value) => ({ name: value, label: value }));
            break;

          case 'bool':
            operators = [{ name: '=', label: 'Equals' }];
            valueEditorType = 'checkbox';
            break;

          case 'location':
            operators = [{ name: 'contains', label: 'contains' }];
            break;

          case 'multi':
            valueEditorType = 'multiselect';
            operators = [
              { name: 'in', label: 'In' },
              { name: 'notIn', label: 'Not In' },
            ];
            values = field.permitted_values.map((value) => ({ name: value, label: value }));
            break;

          case 'date':
            operators = [
              { name: '=', label: 'Equals' },
              { name: '!=', label: 'Not Equals' },
              { name: '>=', label: 'After' },
              { name: '<=', label: 'Before' },
              { name: 'between', label: 'Between' },
            ];
            inputType = 'date';
            break;

          default:
            console.log(field.display_type);

          // TODO: list type needs to fetch every possible value
          // case 'list':
          //   operators = [{ name: 'contains', label: 'contains' }];
          //   break;
        }

        if (operators || values || valueEditorType || inputType) {
          fields.push({
            name: field.short_name,
            label: field.short_name,
            operators,
            values,
            valueEditorType,
            inputType,
          });
        }
      }

      setFields(fields);

      setFilters((filters) =>
        filters.map((filter) => {
          if (filter.id === id) {
            return { ...filter, query: query ?? { combinator: 'and', rules: [] } };
          }

          return filter;
        })
      );
    }
  }, [data]);

  const valid = isValidFilter(query);

  return (
    <div className={'first:mt-0 mt-4 p-2' + (valid ? '' : ' bg-red-300')}>
      {loading && <Spinner />}
      {!loading && fields && (
        <div>
          <div className="flex justify-between">
            <h4>{config.namespace}</h4>
            <Button size="sm" onClick={() => removeFilter(id)}>
              <Trans>Delete</Trans>
            </Button>
          </div>
          <div className="mt-2">
            <QueryBuilder
              fields={fields}
              query={query}
              onQueryChange={(q) => handleChange(q)}
              listsAsArrays={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}
