import React, { useState, useEffect } from 'react';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch } from 'react-instantsearch';
import AiidHelmet from 'components/AiidHelmet';
import config from '../../../config';
import Hits from 'components/discover/Hits';
import SearchBox from 'components/discover/SearchBox';
import Pagination from 'components/discover/Pagination';
import OptionsModal from 'components/discover/OptionsModal';
import { queryConfig } from 'components/discover/queryParams';
import Controls from 'components/discover/Controls';
import { useLocalization } from 'plugins/gatsby-theme-i18n';
import Container from 'elements/Container';
import Row from 'elements/Row';
import Col from 'elements/Col';
import { history } from 'instantsearch.js/es/lib/routers';
import { navigate } from 'gatsby';
import parseURL from 'components/discover/parseURL';
import createURL from 'components/discover/createURL';

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

function DiscoverApp(props) {
  const { locale } = useLocalization();

  const [indexName] = useState(`instant_search-${locale}-featured`);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { location } = props;

  return (
    <div {...props} className="w-full">
      <AiidHelmet path={props.location.pathname}>
        <title>Artificial Intelligence Incident Database</title>
      </AiidHelmet>
      {mounted && (
        <InstantSearch
          searchClient={searchClient}
          indexName={indexName}
          future={{
            preserveSharedStateOnUnmount: true,
          }}
          routing={{
            router: history({
              getLocation: () => {
                return location;
              },
              parseURL: ({ location }) => parseURL({ location, indexName, queryConfig }),
              createURL: ({ routeState }) =>
                createURL({ indexName, locale, queryConfig, routeState }),
              push: (url) => {
                navigate(`?${url}`);
              },
            }),
            stateMapping: mapping(),
          }}
        >
          <Container className="ml-auto mr-auto pl-3 pr-3 w-full lg:max-w-6xl xl:max-w-7xl mt-6">
            <Row className="px-0 mx-0">
              <Col className="px-0 mx-0">
                <SearchBox />
              </Col>
            </Row>

            <Controls />

            <OptionsModal />

            <Hits />

            <Pagination />
          </Container>
        </InstantSearch>
      )}
    </div>
  );
}

export default DiscoverApp;
