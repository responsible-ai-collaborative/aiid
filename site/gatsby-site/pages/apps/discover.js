import React from 'react';
import { Layout } from '@components';
import algoliasearch from 'algoliasearch/lite';
import {
  InstantSearch,
  SearchBox,
  Configure,
  Highlight,
  connectHits,
  connectRefinementList,
  Pagination,
} from 'react-instantsearch-dom';
import styled from 'styled-components';
import { Image } from 'react-bootstrap';

import '../../static/discover/src/algolia.css';

const searchClient = algoliasearch('8TNY3YFAO8', '55efba4929953a53eb357824297afb4c');

const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const HitsContainer = styled.div`
  display: grid;
  max-width: 100%;
  grid-gap: 10px;
  grid-template-columns: 1fr 1fr 1fr 1fr;

  @media (max-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 1440px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

const LeftPanel = styled.div`
  display: flex;
  flex-direction: column;
  width: 20%;
`;

const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
`;

const IncidentCardContainer = styled.div`
  min-width: 300px;
  height: 600px;
  border: 1.5px solid #d9deee;
`;

const RefinementListContainer = styled.div`
  border: 1.5px solid #d9deee;
`;

const StyledPagination = styled(Pagination)`
  padding: 50px 0 50px 0;
`;

const RenderCard = ({ hits }) => {
  return (
    <>
      {hits.map((hit) => (
        <IncidentCard key={hit._id} hit={hit} />
      ))}
    </>
  );
};

const StyledRefinementList = ({ items, isFromSearch, refine, searchForItems, createURL }) => (
  <RefinementListContainer>
    <div>
      <input type="search" onChange={(event) => searchForItems(event.currentTarget.value)} />
    </div>
    {items.map((item) => (
      <div key={item.label}>
        <a
          href={createURL(item.value)}
          style={{ fontWeight: item.isRefined ? 'bold' : '' }}
          onClick={(event) => {
            event.preventDefault();
            refine(item.value);
          }}
        >
          {isFromSearch ? <Highlight attribute="label" hit={item} /> : item.label} ({item.count})
        </a>
      </div>
    ))}
  </RefinementListContainer>
);

const IncidentCard = ({ hit }) => (
  <IncidentCardContainer>
    <div>{hit.title}</div>
    <div>{hit.authors[0]}</div>
    <div>{hit.date_submitted}</div>
    <div>{hit.description}</div>
    <Image src={hit.image_url} rounded />
  </IncidentCardContainer>
);

const CustomHits = connectHits(RenderCard);

const AuthorsRefinementList = connectRefinementList(StyledRefinementList);

const DiscoverApp = (props) => {
  return (
    <Layout {...props} className="maxWidth">
      <InstantSearch indexName="aiid-emergency" searchClient={searchClient}>
        <SearchBox />
        <Container>
          <LeftPanel>
            <AuthorsRefinementList attribute="authors" />
            <Configure hitsPerPage={8} />
          </LeftPanel>
          <RightPanel>
            <HitsContainer>
              <CustomHits />
            </HitsContainer>
            <StyledPagination />
          </RightPanel>
        </Container>
      </InstantSearch>
    </Layout>
  );
};

export default DiscoverApp;
