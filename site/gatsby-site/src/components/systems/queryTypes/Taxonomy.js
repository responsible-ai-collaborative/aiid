import { Button, Spinner } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import QueryBuilder from 'react-querybuilder';
import { gql, useQuery } from '@apollo/client';
import 'react-querybuilder/dist/query-builder.css';
import isValidFilter from '../isValidFilter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';

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

export default function Builder({ id, setFilters, removeFilter, config }) {
  const [fields, setFields] = useState(null);

  const { data, loading } = useQuery(FIND_TAXONOMY, {
    variables: { input: { namespace: config.namespace } },
  });

  const [collapsed, setCollapsed] = useState(false);

  const handleChange = (query) => {
    console.log('changecito', query);

    setFilters((filters) =>
      filters.map((filter) => {
        if (filter.id === id) {
          return { ...filter, initialized: true, config: { ...filter.config, query } };
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

          case 'text':
          case 'long_string':
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
    }
  }, [data]);

  const valid = isValidFilter(config.query);

  return (
    <div className={'first:mt-0 border p-2' + (valid ? '' : ' bg-red-300')} data-cy={id}>
      {loading && <Spinner />}
      {!loading && fields && (
        <div>
          <div className="flex justify-between align-middle">
            <div>{config.namespace}</div>
            <div className=" flex gap-2">
              <Button size="xs" onClick={() => setCollapsed((c) => !c)} color="light">
                <FontAwesomeIcon icon={collapsed ? faAngleDown : faAngleUp} />
              </Button>
              <Button size="xs" onClick={() => removeFilter(id)} color="light">
                <FontAwesomeIcon icon={faTrash} />
              </Button>
            </div>
          </div>
          <div className={'mt-2' + (collapsed ? ' hidden' : '')}>
            <QueryBuilder
              fields={fields}
              query={config.query}
              onQueryChange={(q) => handleChange(q)}
              listsAsArrays={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}
