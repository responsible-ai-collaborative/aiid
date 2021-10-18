import React, { useState, useEffect, useRef, useMemo } from 'react';
import { StringParam, QueryParams, useQueryParams } from 'use-query-params';
import algoliasearch from 'algoliasearch/lite';
import { debounce } from 'debounce';
import {
  InstantSearch,
  Highlight,
  connectRefinementList,
  connectRange,
} from 'react-instantsearch-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LayoutHideSidebar from 'components/LayoutHideSidebar';
import { Form } from 'react-bootstrap';
import Helmet from 'react-helmet';
import { useModal, CustomModal } from 'components/useModal';

import { add, formatISO, isAfter } from 'date-fns';
import config from '../../../config';
import Hits from 'components/discover/Hits';
import SearchBox from 'components/discover/SearchBox';
import Pagination from 'components/discover/Pagination';
import FiltersBar from 'components/discover/FiltersBar';
import REFINEMENT_LISTS from 'components/discover/REFINEMENT_LISTS';

const indexName = 'instant_search';

const searchClient = algoliasearch(
  config.header.search.algoliaAppId,
  config.header.search.algoliaSearchKey
);

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem;

  @media (max-width: 767px) {
    padding: 0;
  }
`;

const SidesContainer = styled.div`
  display: flex;
  flex-direction: row;
  max-width: 100%;
  padding-top: 2rem;

  @media (max-width: 1440px) {
    padding-top: 1em;
  }

  @media (max-width: 570px) {
    flex-direction: column-reverse;
  }
`;

const HitsContainer = styled.div`
  display: grid;
  max-width: 100%;
  grid-gap: 13px;
  grid-template-columns: 1fr 1fr 1fr;

  ${({ showDetails }) =>
    showDetails === true &&
    `
    grid-template-columns: auto;i
  `};

  @media (max-width: 1240px) {
    grid-template-columns: 1fr 1fr;
    ${({ showDetails }) =>
      showDetails === true &&
      `
      grid-template-columns: auto;
    `};
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;

    ${({ showDetails }) =>
      showDetails === true &&
      `
      grid-template-columns: auto;
    `};
  }
`;

const RangeInputContainer = styled.div`
  padding-bottom: 1.5rem;
`;

const FacetsSide = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 300px;

  @media (max-width: 1440px) {
    max-width: 300px;
  }

  @media (max-width: 570px) {
    max-width: unset;
  }
`;

const ResultsSide = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  max-width: 85%;
  padding-right: 2rem;

  @media (max-width: 1440px) {
    padding-right: 1rem;
  }

  @media (max-width: 570px) {
    width: 100%;
    padding: 0;
  }
`;

const RefinementListContainer = styled.div`
  margin-bottom: 1rem;
  padding-bottom: 10px;
`;

const RefinementListHeader = styled.span`
  display: block;
  background: #036eff;
  border-radius: 1px;
  color: #fff;
  margin-bottom: 0;
  padding: 10px;
`;

const StyledButton = styled.button`
  width: 100%;
  background-color: white;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  line-height: 1.5;
  border-radius: 0rem;
  margin-top: 0rem !important;
  border: 1px solid transparent;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  :hover {
    color: #fff;
    background-color: #6bb3ff;
    border-color: #6bb3ff;
    text-decoration: none;
  }

  ${({ active }) =>
    active === true &&
    `
    color: #fff;
    background-color: #007bff;
    border-color: #007bff;
  `};
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 100%;

  @media (max-width: 767px) {
    .fa-BARS {
      display: none;
    }
  }
`;

const StyledRefinementList = ({
  items,
  isFromSearch,
  refine,
  searchForItems,
  createURL,
  placeholder,
  listLabel,
  faIcon,
  faClasses,
}) => (
  <RefinementListContainer>
    <RefinementListHeader className="refine_header">
      <FontAwesomeIcon icon={faIcon} className={faClasses} />
      {` ${listLabel}`}
    </RefinementListHeader>
    {items.length === 0 && <div className="d-flex justify-content-center">No result</div>}
    {items.map((item) => (
      <StyledButton
        key={item.label}
        active={item.isRefined}
        href={createURL(item.value)}
        onClick={(event) => {
          event.preventDefault();
          refine(item.value);
        }}
      >
        {isFromSearch ? <Highlight attribute="label" hit={item} /> : item.label}
        <span className="badge bg-secondary badge-pill">{item.count}</span>
      </StyledButton>
    ))}
    <input
      className="form-control"
      type="search"
      placeholder={placeholder}
      onChange={(event) => searchForItems(event.currentTarget.value)}
    />
  </RefinementListContainer>
);

const RefinementList = connectRefinementList(StyledRefinementList);

const removeUndefinedAttributes = (obj) => {
  for (const attr in obj) {
    if (obj[attr] === undefined) {
      delete obj[attr];
    }
  }
  return { ...obj };
};

const removeEmptyAttributes = (obj) => {
  for (const attr in obj) {
    if (obj[attr] === '' || obj[attr].length === 0) {
      delete obj[attr];
    }
  }
  return { ...obj };
};

const convertArrayToString = (obj) => {
  for (const attr in obj) {
    if (obj[attr].length > 0) {
      obj[attr] = obj[attr].join('||');
    }
  }
  return { ...obj };
};

const validateDate = (date) => {
  const dateStr = date + '';

  if (dateStr.length <= 10) {
    return date * 1000;
  }
  return date;
};

const convertStringToArray = (obj) => {
  const stringKeys = [
    'source_domain',
    'authors',
    'submitters',
    'incident_id',
    'flag',
    'classifications',
  ];

  let newObj = {};

  for (const attr in obj) {
    if (stringKeys.includes(attr) && obj[attr] !== undefined) {
      if (obj[attr].indexOf('CSET') >= 0) {
        // The facet separator is double pipe sign - "||"
        newObj[attr] = obj[attr].split('||CSET').map((i) => 'CSET' + i);
        newObj[attr][0] = newObj[attr][0].substr(4);
      } else {
        newObj[attr] = obj[attr].split('||');
      }
    }
  }
  return newObj;
};

const convertRangeToQueryString = (rangeObj) => {
  let rangeQueryObj = {};

  for (const attr in rangeObj) {
    if (rangeObj[attr] !== undefined && rangeObj[attr].min) {
      rangeQueryObj[`${attr}_min`] = rangeObj[attr].min;
    }
    if (rangeObj[attr] !== undefined && rangeObj[attr].max) {
      rangeQueryObj[`${attr}_max`] = rangeObj[attr].max;
    }
  }

  return rangeQueryObj;
};

const convertStringToRange = (query) => {
  const rangeKeys = [
    'epoch_incident_date_min',
    'epoch_incident_date_max',
    'epoch_date_published_min',
    'epoch_date_published_max',
  ];

  let resultObj = {};

  for (const attr in query) {
    if (rangeKeys.includes(attr)) {
      if (attr.includes('_min') && !isNaN(parseInt(query[attr]))) {
        resultObj[attr.split('_min')[0]] = {
          ...resultObj[attr.split('_min')[0]],
          min: parseInt(query[attr]),
        };
      }

      if (attr.includes('_max') && !isNaN(parseInt(query[attr]))) {
        resultObj[attr.split('_max')[0]] = {
          ...resultObj[attr.split('_max')[0]],
          max: parseInt(query[attr]),
        };
      }
    }
  }

  return resultObj;
};

const RangeInput = ({ currentRefinement: { min, max }, refine }) => {
  if (!min || !max) {
    return null;
  }

  const [localMin, setLocalMin] = useState(validateDate(min));

  const [localMax, setLocalMax] = useState(validateDate(max));

  const [limitInterval, setLimitInterval] = useState({ min: 0, max: 0 });

  useEffect(() => {
    setLimitInterval({
      min: formatISO(validateDate(min), { representation: 'date' }),
      max: formatISO(validateDate(max), { representation: 'date' }),
    });
  }, []);

  useEffect(() => {
    setLocalMin(validateDate(min));
    setLocalMax(validateDate(max));
  }, [min, max]);

  if (!localMax || !localMin) {
    return null;
  }

  const onChangeMinDate = debounce((newInput) => {
    try {
      if (
        newInput !== '' &&
        newInput.length <= 10 &&
        isAfter(new Date(newInput), new Date(limitInterval.min))
      ) {
        setLocalMin(new Date(newInput || limitInterval.min).getTime());
        refine({
          max: validateDate(localMax) / 1000,
          min: validateDate(new Date(newInput || limitInterval.min).getTime()) / 1000,
        });
      }
    } catch (error) {
      refine({
        max: validateDate(localMax) / 1000,
        min: validateDate(add(validateDate(localMax) / 1000, { seconds: 1 }).getTime()) / 1000,
      });
    }
  }, 1000);

  const onChangeMaxDate = debounce((newInput) => {
    try {
      if (newInput !== '' && newInput.length <= 10) {
        setLocalMax(new Date(newInput || limitInterval.max).getTime());
        refine({
          max: validateDate(new Date(newInput || limitInterval.max).getTime()) / 1000,
          min: validateDate(localMin) / 1000,
        });
      }
    } catch (error) {
      refine({
        min: validateDate(localMin) / 1000,
        max: validateDate(add(validateDate(localMin) / 1000, { seconds: 1 }).getTime()) / 1000,
      });
    }
  }, 1000);

  return (
    <Form>
      <Form.Label>From Date:</Form.Label>
      <Form.Control
        required={true}
        type="date"
        defaultValue={formatISO(localMin, { representation: 'date' })}
        onChange={(event) => onChangeMinDate(event.currentTarget.value)}
        min={limitInterval.min}
        onKeyDown={(e) => e.preventDefault()}
      />

      <Form.Label>To Date:</Form.Label>
      <Form.Control
        required={true}
        type="date"
        defaultValue={formatISO(localMax, { representation: 'date' })}
        onChange={(event) => onChangeMaxDate(event.currentTarget.value)}
        onKeyDown={(e) => e.preventDefault()}
      />
    </Form>
  );
};

const CustomRangeInput = connectRange(RangeInput);

const DiscoverApp = React.memo((props) => {
  const searchInput = useRef(null);

  const [query, setQuery] = useQueryParams({
    s: StringParam,
    source_domain: StringParam,
    authors: StringParam,
    submitters: StringParam,
    incident_id: StringParam,
    flag: StringParam,
    classifications: StringParam,
    epoch_incident_date_min: StringParam,
    epoch_incident_date_max: StringParam,
    epoch_date_published_min: StringParam,
    epoch_date_published_max: StringParam,
  });

  const [searchState, setSearchState] = useState({
    configure: {
      hitsPerPage: 30,
    },
    page: 1,
    query: '',
    refinementList: {},
    range: {},
  });

  const queryConfig = {
    s: StringParam,
    source_domain: StringParam,
    authors: StringParam,
    submitters: StringParam,
    incident_id: StringParam,
    flag: StringParam,
    classifications: StringParam,
    epoch_incident_date_min: StringParam,
    epoch_incident_date_max: StringParam,
    epoch_date_published_min: StringParam,
    epoch_date_published_max: StringParam,
  };

  // const showDetails = searchState.refinementList?.incident_id?.length === 1;

  useEffect(() => {
    const cleanQuery = removeUndefinedAttributes(query);

    const querySearch = cleanQuery.s || '';

    delete cleanQuery.s;

    searchInput.current.value = querySearch;

    setSearchState({
      ...searchState,
      query: querySearch,
      refinementList: {
        ...convertStringToArray(cleanQuery),
      },
      range: {
        ...convertStringToRange(cleanQuery),
      },
    });
  }, [query]);

  const getQueryFromState = (searchState) => {
    let query = {};

    if (searchState && searchState.query !== '') {
      query.s = searchState.query;
    }

    if (searchState && searchState.refinementList !== {}) {
      query = {
        ...query,
        ...convertArrayToString(removeEmptyAttributes(searchState.refinementList)),
      };
    }

    if (searchState && searchState.range !== {}) {
      query = {
        ...query,
        ...convertRangeToQueryString(removeEmptyAttributes(searchState.range)),
      };
    }

    return query;
  };

  const toggleFilterByIncidentId = (incidentId) => {
    const incident_id = [];

    if (
      !searchState.refinementList ||
      !searchState.refinementList.incident_id ||
      searchState.refinementList.incident_id.length === 0
    ) {
      incident_id.push(incidentId);
    }

    const newSearchState = {
      ...searchState,
      refinementList: {
        ...searchState.refinementList,
        incident_id,
      },
    };

    setSearchState(newSearchState);
    setQuery(getQueryFromState(newSearchState), 'push');
  };

  const filters = useMemo(() => {
    return REFINEMENT_LISTS.map((list) => {
      if (list.attribute === 'epoch_incident_date' || list.attribute === 'epoch_date_published') {
        return (
          <RangeInputContainer key={list.attribute}>
            <RefinementListHeader className="refine_header">
              <FontAwesomeIcon icon={list.faIcon} className={list.faClasses} />
              {` ${list.label}`}
            </RefinementListHeader>
            <CustomRangeInput attribute={list.attribute} />
          </RangeInputContainer>
        );
      }
      return (
        <RefinementList
          key={list.attribute}
          attribute={list.attribute}
          placeholder={list.inputText}
          listLabel={list.label}
          faIcon={list.faIcon}
          faClasses={list.faClasses}
        />
      );
    });
  }, [searchState]);

  const authorsModal = useModal();

  const submittersModal = useModal();

  const flagReportModal = useModal();

  return (
    <LayoutHideSidebar {...props}>
      <Helmet>
        <title>Artifical Intelligence Incident Database</title>
      </Helmet>
      <QueryParams config={queryConfig}>
        {({ query, setQuery }) => (
          <>
            <Container>
              <InstantSearch
                indexName={indexName}
                searchClient={searchClient}
                searchState={searchState}
                onSearchStateChange={(searchState) => {
                  setSearchState({ ...searchState });
                  setQuery(getQueryFromState(searchState), 'push');
                }}
              >
                <Header>
                  <SearchBox customRef={searchInput} defaultRefinement={query.s} />
                  <FiltersBar
                    filters={searchState}
                    updateFilters={setSearchState}
                    updateQuery={(newFilters) => setQuery(getQueryFromState(newFilters), 'push')}
                  />
                </Header>
                <SidesContainer>
                  <ResultsSide>
                    <HitsContainer>
                      <Hits
                        toggleFilterByIncidentId={toggleFilterByIncidentId}
                        authorsModal={authorsModal}
                        submittersModal={submittersModal}
                        flagReportModal={flagReportModal}
                      />

                      <CustomModal {...authorsModal} />
                      <CustomModal {...submittersModal} />
                      <CustomModal {...flagReportModal} />
                    </HitsContainer>
                    <Pagination />
                  </ResultsSide>
                  <FacetsSide>{filters}</FacetsSide>
                </SidesContainer>
              </InstantSearch>
            </Container>
          </>
        )}
      </QueryParams>
    </LayoutHideSidebar>
  );
});

export default DiscoverApp;
