import React, { useCallback, useEffect, useState } from 'react';
import { useField } from 'formik';
import { AsyncTypeahead, Token } from 'react-bootstrap-typeahead';
import { useQuery } from '@apollo/client';
import { FIND_USERS_FIELDS_ONLY } from '../../graphql/users';

const filterBy = (option, text) => {
  return (
    option.first_name?.toLowerCase().includes(text.toLowerCase()) ||
    option.last_name?.toLowerCase().includes(text.toLowerCase()) ||
    option.id.toString().includes(text)
  );
};

export default function UsersField({ id, name, placeHolder = '' }) {
  const [{ value }, , { setTouched, setValue }] = useField({ name });

  const { data } = useQuery(FIND_USERS_FIELDS_ONLY);

  const [loading, setLoading] = useState(true);

  const [options, setOptions] = useState([]);

  const [selected, setSelected] = useState(
    value
      .slice()
      .sort()
      .map((id) => ({ id, first_name: '', last_name: '' }))
  );

  useEffect(() => {
    if (data?.users) {
      setSelected((selected) =>
        selected.map(({ id }) => {
          const { userId, first_name, last_name } = data.users.find((user) => user.userId == id);

          return { id: userId, first_name, last_name };
        })
      );

      setLoading(false);
    }
  }, [data]);

  const handleSearch = useCallback(
    async (text) => {
      const options = data?.users
        .filter(({ userId }) => !selected.some((s) => s.id == userId))
        .map(({ userId: id, first_name, last_name }) => ({ id, first_name, last_name }))
        .filter((option) => filterBy(option, text));

      setOptions(options);
    },
    [data, selected]
  );

  return (
    <>
      <AsyncTypeahead
        className="Typeahead incident-ids-field"
        filterBy={() => true}
        id={id}
        inputProps={{ id: 'input-' + id, name }}
        selected={selected}
        options={options}
        multiple
        labelKey={(option) => `${option.first_name} ${option.last_name}`}
        isLoading={loading}
        onSearch={handleSearch}
        minLength={1}
        placeholder={placeHolder}
        onChange={(value) => {
          setSelected(value);
          setTouched(true);
          setValue(value.map((item) => item.id));
        }}
        renderToken={(option, { onRemove }, index) => (
          <Token
            key={index}
            onRemove={onRemove}
            option={option}
            title={
              option.first_name || option.last_name
                ? `${option.first_name} ${option.last_name}`
                : option.id
            }
          >
            <div className="flex" data-cy="token">
              {!loading ? (
                <>
                  <span className="block max-w-[20ch] truncate overflow-ellipsis ml-2">
                    {option.first_name || option.last_name ? (
                      <>
                        {option.first_name} {option.last_name}
                      </>
                    ) : (
                      <>{option.id}</>
                    )}
                  </span>
                </>
              ) : (
                <>
                  <div role="status" className="w-[12ch] animate-pulse">
                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 my-1"></div>
                  </div>
                </>
              )}
            </div>
          </Token>
        )}
        renderMenuItemChildren={(option) => (
          <span>
            {option.first_name || option.last_name ? (
              <>
                {option.first_name} {option.last_name}
              </>
            ) : (
              <>{option.id}</>
            )}
          </span>
        )}
      />
    </>
  );
}
