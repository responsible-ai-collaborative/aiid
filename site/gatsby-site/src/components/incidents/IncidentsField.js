import React, { useCallback, useEffect, useState } from 'react';
import { useField } from 'formik';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
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

  const [selected, setSelected] = useState(value.map((id) => ({ id })));

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

  console.log('boe', value);

  return (
    <>
      <AsyncTypeahead
        filterBy={() => true}
        id={id}
        inputId={'input-' + id}
        name={name}
        selected={selected}
        placeHolder="Something"
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
        renderMenuItemChildren={(option) => (
          <span>
            {option.id} - {option.title}
          </span>
        )}
      />
      <div>
        {selected.map((item) => {
          return (
            <div key={item.id}>
              {item.id} - {item.title}
            </div>
          );
        })}
      </div>
    </>
  );
}
