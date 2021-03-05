import React, { useState } from 'react';
import { Layout } from '@components';
import algoliasearch from 'algoliasearch/lite';
import {
  InstantSearch,
  Configure,
  Highlight,
  connectHits,
  connectRefinementList,
  Pagination,
  Stats,
  connectSearchBox,
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
  faBars,
} from '@fortawesome/free-solid-svg-icons';
import { useModal, CustomModal } from '../../src/components/useModal';

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
  max-width: 100%;
`;

const SidesContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  padding-top: 2rem;

  @media (max-width: 570px) {
    flex-direction: column;
  }
`;

const HitsContainer = styled.div`
  display: grid;
  max-width: 100%;
  grid-gap: 13px;
  grid-template-columns: 1fr 1fr 1fr 1fr;

  @media (max-width: 1440px) {
    grid-template-columns: 1fr 1fr 1fr;
  }

  @media (max-width: 1140px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const LeftSide = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
  padding-right: 2rem;

  @media (max-width: 570px) {
    width: 100%;
    padding: 0;
  }
`;

const RightSide = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  @media (max-width: 570px) {
    width: 100%;
  }
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

const StyledSearchInput = styled.input`
  padding: 0.3rem 0.3rem !important;
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;

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

const IncidentCard = ({ item, authorsModal, submittersModal, flagReportModal }) => (
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
          onClick={() => console.log(item.incident_id)}
        />
        {item.incident_id}
      </span>
    </CardFooter>
  </IncidentCardContainer>
);

const StyledSearchBox = ({ currentRefinement, refine }) => (
  <div className="ais-SearchBox flex-grow-1">
    <form className="ais-SearchBox-form" noValidate>
      <StyledSearchInput
        className="ais-SearchBox-input"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        placeholder="Search for products"
        spellCheck="false"
        maxLength="512"
        type="search"
        value={currentRefinement}
        onChange={(event) => refine(event.currentTarget.value)}
      />
      <button
        className="ais-SearchBox-reset"
        type="reset"
        title="Clear the search query."
        onClick={() => refine('')}
      >
        <FontAwesomeIcon
          icon={faTimesCircle}
          className="pointer fa fa-times-circle"
          title="Authors"
        />
      </button>
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
    </form>
  </div>
);

const CustomSearchBox = connectSearchBox(StyledSearchBox);

const RefinementList = connectRefinementList(StyledRefinementList);

const getImageHashPath = (imgUrl) => {
  return `${config.gatsby.siteUrl}/large_media/report_banners/${md5(imgUrl)}`;
};

const DiscoverApp = (props) => {
  const [collapse, setCollapse] = useState(true);

  const authorsModal = useModal();

  const submittersModal = useModal();

  const flagReportModal = useModal();

  const RenderCards = ({ hits }) => {
    return (
      <>
        {hits.map((hit) => (
          <IncidentCard
            key={hit._id}
            item={hit}
            authorsModal={authorsModal}
            submittersModal={submittersModal}
            flagReportModal={flagReportModal}
          />
        ))}
      </>
    );
  };

  const CustomHits = connectHits(RenderCards);

  return (
    <Layout {...props} collapse={collapse} className="maxWidth">
      <Container>
        <InstantSearch indexName="aiid-emergency" searchClient={searchClient}>
          <Header>
            <FontAwesomeIcon
              icon={faBars}
              className="pointer fa fa-BARS"
              title="Authors"
              size="2x"
              style={{ marginRight: 10, marginTop: 2 }}
              onClick={() => setCollapse(!collapse)}
            />
            <CustomSearchBox />
          </Header>
          <SidesContainer>
            <LeftSide>
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
              <Configure hitsPerPage={30} />
            </LeftSide>
            <RightSide>
              <HitsContainer>
                <CustomHits />
              </HitsContainer>
              <StyledPagination />
            </RightSide>
          </SidesContainer>
        </InstantSearch>
      </Container>

      {/* <Modal show={authorsModal.isOpen} onHide={authorsModal.close}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={authorsModal.close}>
            Close
          </Button>
          <Button variant="primary" onClick={authorsModal.close}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal> */}
      <CustomModal {...authorsModal} />
      <CustomModal {...submittersModal} />
      <CustomModal {...flagReportModal} />
    </Layout>
  );
};

export default DiscoverApp;
