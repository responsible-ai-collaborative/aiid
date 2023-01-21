import { Spinner } from 'flowbite-react';
import React from 'react';
import { Trans } from 'react-i18next';

const FlowbiteSearchInput = ({
  name,
  placeholder,
  handleChange,
  handleBlur,
  className = '',
  btnText = '',
  btnClick = () => {},
  loading = false,
  btnDisabled = false,
  dataCy = '',
  values = {},
  defaultValue,
  ...props
}) => (
  <>
    <div className="relative">
      <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
        <svg
          aria-hidden="true"
          className="w-5 h-5 text-gray-500 dark:text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
      </div>
      <input
        name={name}
        className={`block p-4 pl-10 w-full text-sm bg-gray-50 border text-gray-900 rounded-lg dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white  ${
          props.touched[name] && props.errors[name]
            ? 'border-red-600 focus:border-red-600 focus:ring-red-500'
            : 'border-gray-300 dark:border-gray-600 dark:focus:border-blue-500 focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-500'
        } ${className}`}
        placeholder={placeholder}
        onChange={handleChange}
        onBlur={handleBlur}
        value={values[name] || defaultValue || ''}
        {...props}
      />
      {loading ? (
        <FetchButton btnDisabled={btnDisabled} btnClick={btnClick} data-cy={dataCy}>
          <Spinner aria-label="Alternate spinner button example" />
          <span className="pl-3">Fetching...</span>
        </FetchButton>
      ) : (
        <FetchButton btnDisabled={btnDisabled} btnClick={btnClick} data-cy={dataCy}>
          {btnText}
        </FetchButton>
      )}
    </div>
    <span className="text-red-700 text-sm">
      <Trans ns="validation">
        {props.errors[name] && props.touched[name] ? props.errors[name] : null}
      </Trans>
    </span>
  </>
);

const FetchButton = ({ btnDisabled, btnClick, ...props }) => (
  <button
    type="button"
    className={`text-white absolute right-2.5 bottom-2.5 ${
      btnDisabled ? 'bg-blue-400 dark:bg-blue-500' : 'bg-blue-700 hover:bg-blue-800'
    } focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`}
    {...props}
    disabled={btnDisabled}
    onClick={btnClick}
  >
    {props.children}
  </button>
);

export default FlowbiteSearchInput;
