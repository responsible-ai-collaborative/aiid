import React from 'react';
import { connectHits, connectStateResults } from 'react-instantsearch-dom';
import Hit from './Hit';
import styled from 'styled-components';
import { Spinner } from 'react-bootstrap';

const NoResults = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  grid-column-start: 2;
  grid-column-end: 3;

  p {
    text-align: center;
  }

  @media (max-width: 1240px) {
    grid-column-start: 1;
  }
`;

const Hits = ({
  hits,
  toggleFilterByIncidentId,
  showDetails,
  authorsModal,
  submittersModal,
  flagReportModal,
  isSearchStalled,
}) => {
  if (isSearchStalled) {
    return (
      <NoResults>
        <Spinner animation="border" role="status" variant="primary">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </NoResults>
    );
  }

  if (hits.length === 0) {
    return (
      <NoResults>
        <p>Your search returned no results.</p>
        <p>Please clear your search in the search box above or the filters.</p>
      </NoResults>
    );
  }

  return hits.map((hit) => (
    <Hit
      key={hit.objectID}
      item={hit}
      authorsModal={authorsModal}
      submittersModal={submittersModal}
      flagReportModal={flagReportModal}
      toggleFilterByIncidentId={toggleFilterByIncidentId}
      showDetails={showDetails}
    />
  ));
};

export default connectHits(connectStateResults(Hits));
