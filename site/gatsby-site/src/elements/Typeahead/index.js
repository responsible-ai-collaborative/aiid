import React from 'react';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import {
  Typeahead as BsTypeahead,
  AsyncTypeahead as BsAsyncTypeahead,
} from 'react-bootstrap-typeahead';

const Typeahead = ({ options, ...props }) => {
  return (
    <BsTypeahead className={`Typeahead ${props.className || ''}`} options={options} {...props} />
  );
};

const AsyncTypeahead = ({ options, isLoading, onSearch, ...props }) => {
  return (
    <BsAsyncTypeahead
      className={`Typeahead ${props.className || ''}`}
      options={options}
      isLoading={isLoading}
      onSearch={onSearch}
      {...props}
    />
  );
};

export { Typeahead, AsyncTypeahead };
