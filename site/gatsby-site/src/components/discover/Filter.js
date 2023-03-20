import React, { useEffect, useRef, useState } from 'react';
import { InstantSearch } from 'react-instantsearch-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import componentsMap from './filterTypes';
import useSearch from './useSearch';
import VirtualFilters from './VirtualFilters';
import { Trans } from 'react-i18next';
import { Accordion, Badge, Card } from 'flowbite-react';

function ToggleContent({ label, touched, faIcon }) {
  return (
    <div className="flex items-center">
      {faIcon && <FontAwesomeIcon icon={faIcon} />}
      &nbsp; <Trans>{label}</Trans> &nbsp; {touched > 0 && <Badge color="success">{touched}</Badge>}
    </div>
  );
}

function ButtonToggle({ label, faIcon, touched, type, filterProps }) {
  const [toggled, setToggled] = useState(true);

  const toggleDropdown = () => {
    setToggled(!toggled);
  };

  function useOutsideAlerter(ref) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setToggled(true);
        }
      }
      // Bind the event listener
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [ref]);
  }

  const wrapperRef = useRef(null);

  useOutsideAlerter(wrapperRef);

  return (
    <div className={`w-full`} ref={wrapperRef}>
      <button
        id="dropdownDefaultButton"
        data-dropdown-toggle="dropdown"
        className={`text-white ${
          touched
            ? 'focus:ring-green-300 bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800'
            : 'focus:ring-blue-300 bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
        } focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center  w-full justify-between`}
        type="button"
        onClick={toggleDropdown}
      >
        <ToggleContent label={label} touched={touched} faIcon={faIcon} />
        <svg
          className="w-4 h-4 ml-2"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>

      <div
        id="dropdown"
        className={`z-10 ${
          toggled ? 'hidden' : 'block absolute'
        } bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700`}
      >
        <FilterOverlay type={type} filterProps={filterProps} />
      </div>
    </div>
  );
}

function FilterContent({ type, filterProps }) {
  const { default: Component } = componentsMap[type];

  const instantSearch = useSearch();

  return (
    <InstantSearch {...instantSearch}>
      <VirtualFilters />
      <Component {...filterProps} />
    </InstantSearch>
  );
}

const FilterOverlay = React.forwardRef(function Container(
  { type, filterProps, ...overlayProps },
  ref
) {
  return (
    <div
      ref={ref}
      {...overlayProps}
      style={{ ...overlayProps.style, width: 320, zIndex: 1055 }}
      className=""
      data-cy={filterProps.attribute}
    >
      <Card className="shadow-lg">
        <div>
          <FilterContent type={type} filterProps={filterProps} />
        </div>
      </Card>
    </div>
  );
});

export default function Filter({ type, className = '', ...filterProps }) {
  const { label, faIcon, attribute } = filterProps;

  const { touchedCount } = componentsMap[type];

  const instantSearch = useSearch();

  const { searchState } = instantSearch;

  const touched = touchedCount({ searchState, attribute });

  return (
    <>
      <ButtonToggle
        label={label}
        faIcon={faIcon}
        attribute={attribute}
        touched={touched}
        className={className}
        type={type}
        filterProps={filterProps}
      />
    </>
  );
}

function AccordionFilter({ type, ...filterProps }) {
  const { label, faIcon, attribute } = filterProps;

  const { touchedCount } = componentsMap[type];

  const instantSearch = useSearch();

  const { searchState } = instantSearch;

  const touched = touchedCount({ searchState, attribute });

  return (
    <Accordion.Panel eventKey={attribute} className={`${filterProps.hidden ? 'hidden' : ''}`}>
      <Accordion.Title bg={touched ? 'success' : 'primary'}>
        <ToggleContent faIcon={faIcon} label={label} touched={touched} />
      </Accordion.Title>
      <Accordion.Content style={{ visibility: 'visible' }}>
        <FilterContent type={type} filterProps={filterProps} />
      </Accordion.Content>
    </Accordion.Panel>
  );
}

export { AccordionFilter };
