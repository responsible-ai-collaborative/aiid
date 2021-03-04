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
import config from '../../config';
import md5 from 'md5';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faNewspaper,
  faIdCard,
  faUserShield,
  faFlag,
  faHashtag,
} from '@fortawesome/free-solid-svg-icons';

import '../../static/discover/src/algolia.css';
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
  display: flex;
  flex-direction: row;
  width: 100%;
  padding-top: 2rem;
`;

const HitsContainer = styled.div`
  display: grid;
  max-width: 100%;
  grid-gap: 13px;
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
  padding-right: 2rem;
`;

const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
`;

const IncidentCardContainer = styled.div`
  min-width: 300px;
  border: 1.5px solid #d9deee;
  border-radius: 5px;
  box-shadow: 0 2px 5px 0px #e3e5ec;
`;

const RefinementListContainer = styled.div`
  margin-bottom: 1rem;
`;

const StyledPagination = styled(Pagination)`
  padding: 50px 0 50px 0;
`;

const getImageHashPath = (imgUrl) => {
  return `${config.gatsby.siteUrl}/large_media/report_banners/${md5(imgUrl)}`;
};

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

const RenderCards = ({ hits }) => {
  return (
    <>
      {hits.map((hit) => (
        <IncidentCard key={hit._id} item={hit} />
      ))}
    </>
  );
};

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
    {items.map(
      (item) =>
        console.log(item) || (
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
        )
    )}
    <input
      className="form-control"
      type="search"
      placeholder={placeholder}
      onChange={(event) => searchForItems(event.currentTarget.value)}
    />
  </RefinementListContainer>
);

const IncidentCard = ({ item }) => (
  <IncidentCardContainer className="card">
    <div className="card-header">
      <h1 className="article-header">{item.title}</h1>
      <p className="subhead">
        {item.source_domain} &middot;{' '}
        {item.date_published ? item.date_published.substring(0, 4) : 'Needs publish date'}
      </p>
    </div>
    <div className="card-body">
      <p>{item._snippetResult.description.value}</p>
      <p>{item.text.substr(0, 400) + '...'}</p>
    </div>
    <div className="align-bottom">
      <img className="image-preview" alt={item.title} src={getImageHashPath(item.image_url)} />
      <button type="button" className="btn btn-secondary btn-sm btn-block assignment-button">
        Show Details on Incident #${item.incident_id}
      </button>
    </div>
    <CardFooter className="card-footer text-muted">
      <a href={item.url}>
        <FontAwesomeIcon icon={faNewspaper} className="far fa-newspaper" title="Read the Source" />
      </a>

      <FontAwesomeIcon
        icon={faIdCard}
        className="pointer far fa-id-card"
        title="Authors"
        onClick={() => console.log(item.authors)}
      />

      <FontAwesomeIcon
        icon={faUserShield}
        className="pointer fas fa-user-shield"
        title="Submitters"
        onClick={() => console.log(item.submitters)}
      />

      <FontAwesomeIcon
        icon={faFlag}
        className="pointer far fa-flag"
        title="Flag Report"
        onClick={() => console.log(item.report_number)}
      />

      <span className="pointer">
        <FontAwesomeIcon
          icon={faHashtag}
          className="fas fa-hashtag"
          title="Incident ID"
          onClick={() => console.log(item.incident_id)}
        />
        {item.incident_id}
      </span>
    </CardFooter>
  </IncidentCardContainer>
);

const CustomHits = connectHits(RenderCards);

const RefinementList = connectRefinementList(StyledRefinementList);

const DiscoverApp = (props) => {
  return (
    <Layout {...props} collapse={true} className="maxWidth">
      <InstantSearch indexName="aiid-emergency" searchClient={searchClient}>
        <SearchBox />
        <Container>
          <LeftPanel>
            {REFINEMENT_LISTS.map((list) => (
              <RefinementList
                key={list.attribute}
                attribute={list.attribute}
                placeholder={list.inputText}
                listLabel={list.label}
                faIcon={list.faIcon}
                faClasses={list.faClasses}
              />
            ))}
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
