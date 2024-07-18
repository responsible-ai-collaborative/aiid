import React, { useEffect, useRef, useState } from 'react';
import Col from 'elements/Col';
import Row from 'elements/Row';
import Container from 'elements/Container';
import algoliasearch from 'algoliasearch/lite';
import config from '../../../config';
import { navigate } from 'gatsby';
import { useLocalization } from 'plugins/gatsby-theme-i18n';
import { Configure, InstantSearch } from 'react-instantsearch';
import SearchBox from 'components/discover/SearchBox';
import Hits from 'components/discover/Hits';
import Controls from './Controls';
import OptionsModal from './OptionsModal';
import createURL from './createURL';
import parseURL from './parseURL';
import { queryConfig } from './queryParams';
import { history } from 'instantsearch.js/es/lib/routers';
import Pagination from './Pagination';
import debounce from 'lodash/debounce';

const searchClient = algoliasearch(
  config.header.search.algoliaAppId,
  config.header.search.algoliaSearchKey
);

function mapping() {
  return {
    stateToRoute: (uiState) => uiState,
    routeToState: (routeState = {}) => routeState,
  };
}

export default function Discover({ histogramBins }) {
  const { locale } = useLocalization();

  const [indexName] = useState(`instant_search-${locale}-featured`);

  const [width, setWidth] = useState(0);

  const [currentPage, setCurrentPage] = useState(0);

  const handleWindowSizeChange = useRef(
    debounce(() => {
      setWidth(window.innerWidth);
    }, 1000)
  ).current;

  const [display, setDisplay] = useState('');

  useEffect(() => {
    const queryString = window.location.search;

    const urlParams = new URLSearchParams(queryString);

    const display = urlParams.get('display');

    setDisplay((prev) => {
      if (display && display !== prev) {
        return display;
      }
    });
    window.addEventListener('resize', handleWindowSizeChange);

    handleWindowSizeChange();

    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const page = parseInt(params.get('page'), 10);

    // Set the current page from the URL, defaulting to 0 (Algolia's pagination is zero-based)
    setCurrentPage(!isNaN(page) ? page - 1 : 0);
  }, []);

  if (width == 0) {
    return null;
  }

  const taxa = config.discover.taxa;

  return (
    <InstantSearch
      searchClient={searchClient}
      indexName={indexName}
      future={{
        preserveSharedStateOnUnmount: true,
      }}
      routing={{
        router: history({
          getLocation: () => {
            return window.location;
          },
          parseURL: ({ location }) => parseURL({ location, indexName, queryConfig, taxa }),
          createURL: ({ routeState }) => {
            return createURL({ indexName, locale, queryConfig, routeState, taxa, display });
          },
          push: (url) => {
            navigate(`?${url}`);
          },
        }),
        stateMapping: mapping(),
      }}
    >
      <Configure hitsPerPage={28} page={currentPage} />
      <Container className="ml-auto mr-auto w-full lg:max-w-6xl xl:max-w-7xl mt-6">
        <Row className="px-0 mx-0">
          <Col className="px-0 mx-0">
            <SearchBox />
          </Col>
        </Row>

        {width > 767 ? <Controls {...{ histogramBins }} /> : <OptionsModal />}

        <Hits />

        <Pagination />
      </Container>
    </InstantSearch>
  );
}
