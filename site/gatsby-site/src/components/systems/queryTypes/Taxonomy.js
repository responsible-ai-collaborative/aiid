import { Spinner } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import QueryBuilder from 'react-querybuilder';
import { gql, useQuery } from '@apollo/client';
import 'react-querybuilder/dist/query-builder.css';

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

export default function Builder({ id, setFilters, config, query = null }) {
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

          // TODO: list type needs to fetch every possible value
          // case 'list':
          //   operators = [{ name: 'contains', label: 'contains' }];
          //   break;
        }

        if (operators || values || valueEditorType) {
          fields.push({
            name: field.short_name,
            label: field.short_name,
            operators,
            values,
            valueEditorType,
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

  return (
    <div>
      {loading && <Spinner />}
      {!loading && fields && (
        <div>
          <h4>{config.namespace}</h4>
          <QueryBuilder fields={fields} query={query} onQueryChange={(q) => handleChange(q)} />
        </div>
      )}
    </div>
  );
}
