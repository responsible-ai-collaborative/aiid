import React, { useEffect, useRef, useState } from 'react';
import { InstantSearch } from 'react-instantsearch-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import componentsMap from './filterTypes';
import useSearch from './useSearch';
import VirtualFilters from './VirtualFilters';
import { Trans } from 'react-i18next';
import { Accordion, Badge, Card } from 'flowbite-react';

function ToggleContent({ label, touched, faIcon, toggled, accordion = false }) {
  return (
    <div className="flex flex-nowrap items-center justify-between w-full">
      <div
        className={`flex items-center whitespace-nowrap ${
          !accordion ? 'text-[1.2vw] lg:text-xs' : 'text-xs'
        }`}
      >
        {faIcon && <FontAwesomeIcon icon={faIcon} />}
        &nbsp; <Trans>{label}</Trans> &nbsp;{' '}
        {touched > 0 && (
          <Badge className="badge" color="success">
            {touched}
          </Badge>
        )}
      </div>
      {toggled ? (
        <svg
          className="min-w-[1rem] w-4 h-4 ml-2"
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
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          ></path>
        </svg>
      ) : (
        <svg
          className="w-4 h-4 ml-2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5"></path>
        </svg>
      )}
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
    <div className={`relative w-full`} ref={wrapperRef}>
      <button
        id="dropdownDefaultButton"
        data-dropdown-toggle="dropdown"
        className={`text-white ${
          touched
            ? 'focus:ring-green-300 bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800'
            : 'focus:ring-blue-300 bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
        } focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center  w-full justify-between ${
          filterProps.hidden ? 'hidden' : ''
        }`}
        type="button"
        onClick={toggleDropdown}
      >
        <ToggleContent label={label} touched={touched} faIcon={faIcon} toggled={toggled} />
      </button>

      <div
        id="dropdown"
        className={`z-10 ${
          toggled ? 'hidden' : 'block '
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
      style={{ ...overlayProps.style, width: '280px', zIndex: 1055 }}
      data-cy={filterProps.attribute}
      className="absolute left-0"
    >
      <Card className="shadow-lg card">
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

  const [toggled, setToggled] = useState(true);

  const toggleDropdown = () => {
    setToggled(!toggled);
  };

  return (
    <Accordion.Panel
      className={`${filterProps.hidden ? 'hidden' : ''}`}
      alwaysOpen={true}
      collapseAll={true}
    >
      <Accordion.Title
        className={`tw-accordion text-gray-900 ${filterProps.hidden ? 'hidden' : ''}`}
        onClick={toggleDropdown}
      >
        <ToggleContent
          faIcon={faIcon}
          label={label}
          touched={touched}
          toggled={toggled}
          accordion={true}
        />
      </Accordion.Title>
      <Accordion.Content
        style={{ visibility: 'visible' }}
        hidden={toggled}
        className={`${filterProps.hidden ? 'hidden' : ''}`}
      >
        <FilterContent type={type} filterProps={filterProps} />
      </Accordion.Content>
    </Accordion.Panel>
  );
}

export { AccordionFilter };
