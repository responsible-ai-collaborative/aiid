import React, { useCallback, useEffect, useState } from 'react';
import { useField } from 'formik';
import { AsyncTypeahead, Token } from 'react-bootstrap-typeahead';
import { useQuery } from '@apollo/client';
import { FIND_INCIDENTS_TITLE } from '../../graphql/incidents';

const filterBy = (option, text) => {
  return (
    option?.title.toLowerCase().includes(text.toLowerCase()) || option.id?.toString().includes(text)
  );
};

export default function IncidentsField({ id, name }) {
  const [{ value }, , { setTouched, setValue }] = useField({ name });

  const { data } = useQuery(FIND_INCIDENTS_TITLE);

  const [loading, setLoading] = useState(true);

  const [options, setOptions] = useState([]);

  const [selected, setSelected] = useState(value.sort().map((id) => ({ id, title: '' })));

  useEffect(() => {
    if (data?.incidents) {
      setSelected((selected) =>
        selected.map(({ id }) => {
          const { incident_id, title } = data.incidents.find(
            (incident) => incident.incident_id == id
          );

          return { id: incident_id, title };
        })
      );

      setLoading(false);
    }
  }, [data]);

  const handleSearch = useCallback(
    async (text) => {
      const options = data?.incidents
        .filter(({ incident_id }) => !selected.some((s) => s.id == incident_id))
        .map(({ incident_id: id, title }) => ({ id, title }))
        .filter((option) => filterBy(option, text));

      setOptions(options);
    },
    [data, selected]
  );

  return (
    <>
      <AsyncTypeahead
        filterBy={() => true}
        id={id}
        inputProps={{ id: 'input-' + id, name }}
        selected={selected}
        options={options}
        multiple
        labelKey={(option) => `${option.id}`}
        isLoading={loading}
        onSearch={handleSearch}
        minLength={1}
        onChange={(value) => {
          setSelected(value);
          setTouched(true);
          setValue(value.map((item) => item.id));
        }}
        renderToken={(option, { onRemove }, index) => (
          <Token key={index} onRemove={onRemove} option={option} title={option.title}>
            <div className="flex" data-cy="token">
              <b>{option.id}</b>
              {option.title ? (
                <>
                  <span className="block max-w-[20ch] truncate overflow-ellipsis ml-2">
                    {option.title}
                  </span>
                  )
                </>
              ) : (
                <>
                  <div role="status" className="w-[20ch] animate-pulse">
                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 my-1"></div>
                  </div>
                </>
              )}
            </div>
          </Token>
        )}
        renderMenuItemChildren={(option) => (
          <span>
            {option.id} - {option.title}
          </span>
        )}
      />
    </>
  );
}
