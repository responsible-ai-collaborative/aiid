import React, { useState, useEffect, useRef, useMemo } from 'react';
import { StringParam, QueryParams, useQueryParams } from 'use-query-params';
import algoliasearch from 'algoliasearch/lite';
import { debounce } from 'debounce';
import {
  InstantSearch,
  Highlight,
  connectHits,
  connectRefinementList,
  Pagination,
  Stats,
  connectSearchBox,
  connectCurrentRefinements,
} from 'react-instantsearch-dom';
import styled from 'styled-components';
import config from '../../config';
import md5 from 'md5';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faNewspaper,
  faIdCard,
  faUserShield,
  faFlag,
  faHashtag,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { useModal, CustomModal } from '../../src/components/useModal';
import LayoutHideSidebar from 'components/LayoutHideSidebar';

import '../../static/discover/src/app.css';
import '../../static/discover/src/index.css';

const searchClient = algoliasearch('8TNY3YFAO8', '55efba4929953a53eb357824297afb4c');

const REFINEMENT_LISTS = [
  {
    attribute: 'source_domain',
    inputText: "Filter Domains ('bbc.com')",
    label: 'Source',
    faIcon: faNewspaper,
    faClasses: 'far fa-newspaper',
  },
  {
    attribute: 'authors',
    inputText: "Filter Authors ('Helen...')",
    label: 'Authors',
    faIcon: faIdCard,
    faClasses: 'far fa-id-card',
  },
  {
    attribute: 'submitters',
    inputText: "Filter Submitters ('Helen...')",
    label: 'Submitters',
    faIcon: faUserShield,
    faClasses: 'fas fa-user-shield',
  },
  {
    attribute: 'incident_id',
    inputText: "Filter incident number ('42')",
    label: 'Incident ID',
    faIcon: faHashtag,
    faClasses: 'fas fa-hashtag',
  },
  {
    attribute: 'flag',
    inputText: 'none',
    label: 'Flagged',
    faIcon: faFlag,
    faClasses: 'far fa-flag',
  },
];

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
    grid-template-columns: auto;
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

const StatsContainer = styled.div`
  display: grid;
  max-width: 100%;
  grid-template-columns: 1fr 3fr;
  padding: 1.25rem;
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

const Text = styled.p`
  line-height: 1.3;
`;

const ResultsSide = styled.div`
  display: flex;
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

const IncidentCardContainer = styled.div`
  border: 1.5px solid #d9deee;
  border-radius: 5px;
  box-shadow: 0 2px 5px 0px #e3e5ec;
  display: flex;
  flex-direction: column;
`;

const RefinementListContainer = styled.div`
  margin-bottom: 1rem;
`;

const StyledPagination = styled(Pagination)`
  padding: 50px 0 50px 0;

  .ais-Pagination {
    color: #3a4570;
  }

  .ais-Pagination-list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
  }

  .ais-Pagination-item + .ais-Pagination-item {
    margin-left: 0.3rem;
  }

  .ais-Pagination-link {
    color: #0096db;
    -webkit-transition: color 0.2s ease-out;
    transition: color 0.2s ease-out;
    padding: 0.3rem 0.6rem;
    display: block;
    border: 1px solid #c4c8d8;
    border-radius: 5px;
    -webkit-transition: background-color 0.2s ease-out;
    transition: background-color 0.2s ease-out;

    :hover {
      color: #0073a8;
      background-color: #e3e5ec;
    }

    :focus {
      color: #0073a8;
      background-color: #e3e5ec;
    }
  }

  .ais-Pagination-item--disabled .ais-Pagination-link {
    opacity: 0.6;
    cursor: not-allowed;
    color: #a5abc4;

    :hover {
      color: #a5abc4;
      background-color: #fff;
    }

    :focus {
      color: #a5abc4;
      background-color: #fff;
    }
  }

  .ais-Pagination-item--selected .ais-Pagination-link {
    color: #fff;
    background-color: #0096db;
    border-color: #0096db;

    :hover {
      color: #fff;
    }

    :focus {
      color: #fff;
    }
  }
`;

const CardFooter = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`;

const RefinementListHeader = styled.span`
  display: block;
`;

const StyledStats = styled(Stats)`
  position: absolute;
  top: 4px;
  right: 28px;
  z-index: 1;
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

const CardBody = styled.div`
  padding: 1.25rem 1.25rem 0 1.25rem !important;
`;

const StyledSearchInput = styled.input`
  padding: 0.3rem 0.3rem !important;
  max-width: 100% !important;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  padding: 0.3rem 1.7rem;
  width: 100%;
  position: relative;
  background-color: #fff;
  border: 1px solid #c4c8d8;
  border-radius: 5px;
`;

const SearchResetButton = styled.button`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  position: absolute;
  z-index: 1;
  width: 20px;
  height: 20px;
  top: 50%;
  right: 0.3rem;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);

  padding: 0;
  overflow: visible;
  font: inherit;
  line-height: normal;
  color: inherit;
  background: none;
  border: 0;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
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

const SearchContainer = styled.div`
  flex-grow: 1;
`;

const SearchForm = styled.form`
  display: block;
  position: relative;
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
  <RefinementListContainer className="refine">
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
        <span className="badge badge-secondary badge-pill">{item.count}</span>
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

const getFlagModalContent = () => (
  <div className="modal-body">
    <p>Is there a problem with this content? Examples of &quot;problems`&quot;` include,</p>
    <ul>
      <li>The text contents of the report are not parsed properly</li>
      <li>The authors of the report are not associated with the report</li>
      <li>The report is associated with the wrong incident</li>
      <li>The text contents of the report are not parsed properly</li>
    </ul>
    <p>
      Flagged content will still be displayed within the database, but a database editor will
      periodically review the incident reports that have been flagged. Please note that the content
      contained within incident reports (e.g., the commentary within a news article) does not need
      to be correct or consistent across articles. If an article is wrong, misleading, or
      fraudulent, the best response is to submit additional incident reports that correct the
      record. The incident database is meant to capture the complete state of knowledge and
      discourse for incidents, not as an arbiter of what happened in individual incidents. In future
      versions of the database it will additionally be possible to apply tags to incident reports to
      classNameify their content.
    </p>
    <p>Please do NOT flag content if,</p>
    <ul>
      <li>You disagree with the report</li>
      <li>The linked report has disappeared from the web</li>
      <li>The report should not be considered an `&quot;`incident`&quot;`</li>
    </ul>
    <button
      type="button"
      className="btn btn-danger btn-sm btn-block flag-button"
      data-dismiss="modal"
    >
      Flag Report
    </button>
  </div>
);

const cardNeedsBlockquote = (item) => {
  if (item.text && item.text.matchLevel === 'full') {
    return true;
  }
  return false;
};

const getParagraphs = (itemText) => {
  return (
    <>
      {itemText.split('\n').map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </>
  );
};

const IncidentStatsCard = ({ searchInput, stats }) => {
  const STATS = [
    {
      key: 'incidentId',
      label: 'Incident ID',
    },
    {
      key: 'reportCount',
      label: 'Report Count',
    },
    {
      key: 'incidentDate',
      label: 'Incident Date',
    },
    {
      key: 'citation',
      label: 'Citation',
    },
  ];

  return (
    <IncidentCardContainer className="card">
      <div className="card-header">
        <p>Incident Stats</p>
      </div>
      <StatsContainer className="card-body">
        <div>
          {STATS.map((stat) => (
            <div key={stat.key}>{stat.label}</div>
          ))}
        </div>
        <div>
          {STATS.map((stat) => (
            <div key={stat.key}>
              {stat.key === 'citation' ? <a href={stats[stat.key]}>View</a> : stats[stat.key]}
            </div>
          ))}
        </div>
      </StatsContainer>
      <CustomClearRefinements searchInputRef={searchInput} clearsQuery={true} />
    </IncidentCardContainer>
  );
};

const IncidentCard = ({
  item,
  authorsModal,
  submittersModal,
  flagReportModal,
  toggleFilterByIncidentId,
  showDetails,
}) => (
  <IncidentCardContainer>
    <div className="card-header">
      <Highlight hit={item} attribute="title" />
      <p className="subhead">
        {item.source_domain} &middot;{' '}
        {item.date_published ? item.date_published.substring(0, 4) : 'Needs publish date'}
      </p>
    </div>
    <CardBody className="card-body">
      {/* <Highlight hit={item} attribute="description" /> */}
      {cardNeedsBlockquote(item._snippetResult) && (
        <blockquote>
          <Highlight
            hit={{
              _highlightResult: {
                ...item._snippetResult,
                text: {
                  ...item._snippetResult.text,
                  value: `...${item._snippetResult.text.value}...`,
                },
              },
            }}
            attribute="text"
          />
        </blockquote>
      )}
      {showDetails ? (
        <div>{getParagraphs(item.text)}</div>
      ) : (
        <div>
          <Text>{item.text.substr(0, 400) + '...'}</Text>
        </div>
      )}
    </CardBody>
    <div className="align-bottom">
      <img className="image-preview" alt={item.title} src={getImageHashPath(item.image_url)} />
      {!showDetails && (
        <button
          type="button"
          className="btn btn-secondary btn-sm btn-block assignment-button"
          onClick={() => {
            toggleFilterByIncidentId(item.incident_id + '');
          }}
        >
          Show Details on Incident #{item.incident_id}
        </button>
      )}
    </div>
    <CardFooter className="card-footer text-muted">
      <a href={item.url} target="_blank" rel="noreferrer">
        <FontAwesomeIcon icon={faNewspaper} className="far fa-newspaper" title="Read the Source" />
      </a>

      <FontAwesomeIcon
        icon={faIdCard}
        className="pointer far fa-id-card"
        title="Authors"
        onClick={() =>
          authorsModal.openFor({
            title: 'Authors',
            body: function f() {
              return item.authors.join(', ');
            },
          })
        }
      />

      <FontAwesomeIcon
        icon={faUserShield}
        className="pointer fas fa-user-shield"
        title="Submitters"
        onClick={() =>
          submittersModal.openFor({
            title: 'Submitters',
            body: function f() {
              return item.submitters.join(', ');
            },
          })
        }
      />

      <FontAwesomeIcon
        icon={faFlag}
        className="pointer far fa-flag"
        title="Flag Report"
        onClick={() =>
          flagReportModal.openFor({
            title: 'Submitters',
            body: function f() {
              return getFlagModalContent();
            },
          })
        }
      />

      <span className="pointer">
        <FontAwesomeIcon
          icon={faHashtag}
          className="fas fa-hashtag"
          title="Incident ID"
          onClick={() => toggleFilterByIncidentId(item.incident_id + '')}
        />
        {item.incident_id}
      </span>
    </CardFooter>
  </IncidentCardContainer>
);

const StyledSearchBox = ({ refine, defaultRefinement, customRef }) => {
  const debouncedRefine = debounce((text) => {
    refine(text);
  }, 500);

  return (
    <SearchContainer>
      <SearchForm noValidate>
        <StyledSearchInput
          ref={customRef}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          placeholder="Search"
          spellCheck="false"
          maxLength="512"
          type="search"
          defaultValue={defaultRefinement}
          onChange={(event) => debouncedRefine(event.currentTarget.value)}
        />
        <SearchResetButton type="reset" title="Clear the search query." onClick={() => refine('')}>
          <FontAwesomeIcon
            icon={faTimesCircle}
            className="pointer fa fa-times-circle"
            title="Authors"
          />
        </SearchResetButton>
        <StyledStats
          translations={{
            stats(nbHits) {
              return (
                <span className="badge badge-secondary badge-pill">{`${
                  nbHits === 0 ? 'No' : nbHits
                } reports found`}</span>
              );
            },
          }}
        />
      </SearchForm>
    </SearchContainer>
  );
};

const ClearRefinements = ({ items, refine, searchInputRef }) => (
  <button
    type="button"
    className="btn btn-secondary btn-sm btn-block assignment-button"
    onClick={() => {
      searchInputRef.current.value = '';
      refine(items);
    }}
  >
    Clear Incident Selection and Search
  </button>
);

const CustomClearRefinements = connectCurrentRefinements(ClearRefinements);

const CustomSearchBox = connectSearchBox(StyledSearchBox);

const RefinementList = connectRefinementList(StyledRefinementList);

const getImageHashPath = (imgUrl) => {
  return `${config.gatsby.siteUrl}/large_media/report_banners/${md5(imgUrl)}`;
};

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
      obj[attr] = obj[attr].join();
    }
  }
  return { ...obj };
};

const convertStringToArray = (obj) => {
  for (const attr in obj) {
    if (attr !== 's' && obj[attr] !== undefined) {
      obj[attr] = obj[attr].split(',');
    }
  }
  return { ...obj };
};

const DiscoverApp = (props) => {
  const searchInput = useRef(null);

  const [query, setQuery] = useQueryParams({
    s: StringParam,
    source_domain: StringParam,
    authors: StringParam,
    submitters: StringParam,
    incident_id: StringParam,
    flag: StringParam,
  });

  const [searchState, setSearchState] = useState({
    configure: {
      hitsPerPage: 30,
    },
    page: 1,
    query: '',
    refinementList: {},
  });

  const queryConfig = {
    s: StringParam,
    source_domain: StringParam,
    authors: StringParam,
    submitters: StringParam,
    incident_id: StringParam,
    flag: StringParam,
  };

  const showDetails = searchState.refinementList?.incident_id?.length === 1;

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

  const authorsModal = useModal();

  const submittersModal = useModal();

  const flagReportModal = useModal();

  const RenderCards = ({ hits, toggleFilterByIncidentId, showDetails }) => {
    const itemsCount = hits.length;

    return (
      <>
        {showDetails && hits[0] && (
          <IncidentStatsCard
            searchInput={searchInput}
            stats={{
              incidentId: hits[0].incident_id,
              reportCount: hits.length,
              incidentDate: hits[0].incident_date,
              citation: `/cite/${hits[0].incident_id}`,
            }}
          />
        )}
        {hits.map((hit) => (
          <IncidentCard
            key={hit._id}
            item={hit}
            authorsModal={authorsModal}
            submittersModal={submittersModal}
            flagReportModal={flagReportModal}
            toggleFilterByIncidentId={toggleFilterByIncidentId}
            showDetails={showDetails}
            itemsCount={itemsCount}
          />
        ))}
      </>
    );
  };

  const CustomHits = connectHits(RenderCards);

  const filters = useMemo(() => {
    return REFINEMENT_LISTS.map((list) => (
      <RefinementList
        key={list.attribute}
        attribute={list.attribute}
        placeholder={list.inputText}
        listLabel={list.label}
        faIcon={list.faIcon}
        faClasses={list.faClasses}
      />
    ));
  }, []);

  return (
    <LayoutHideSidebar {...props}>
      <QueryParams config={queryConfig}>
        {({ query, setQuery }) => (
          <>
            <Container>
              <InstantSearch
                indexName="aiid-emergency"
                searchClient={searchClient}
                searchState={searchState}
                onSearchStateChange={(searchState) => {
                  setSearchState({ ...searchState });
                  setQuery(getQueryFromState(searchState), 'push');
                }}
              >
                <Header>
                  <CustomSearchBox customRef={searchInput} defaultRefinement={query.s} />
                </Header>
                <SidesContainer>
                  <ResultsSide>
                    <HitsContainer showDetails={showDetails}>
                      <CustomHits
                        toggleFilterByIncidentId={toggleFilterByIncidentId}
                        showDetails={showDetails}
                      />
                    </HitsContainer>
                    <StyledPagination />
                  </ResultsSide>
                  <FacetsSide>{filters}</FacetsSide>
                </SidesContainer>
              </InstantSearch>
            </Container>

            <CustomModal {...authorsModal} />
            <CustomModal {...submittersModal} />
            <CustomModal {...flagReportModal} />
          </>
        )}
      </QueryParams>
    </LayoutHideSidebar>
  );
};

export default DiscoverApp;
