import React from 'react';
import { connectHits, connectStateResults } from 'react-instantsearch-dom';
import Hit from './Hit';
import styled from 'styled-components';
import { Spinner } from 'react-bootstrap';
import { DisplayModeEnumParam } from './queryParams';
import { useQueryParam } from 'use-query-params';

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

const HitsContainer = styled.div`
  max-width: 1400px;

  &.compact,
  &.details {
    display: grid;
    grid-gap: 6px;
    grid-template-columns: repeat(1, minmax(0, 1fr));

    @media (min-width: 576px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    @media (min-width: 768px) {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    @media (min-width: 992px) {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }

  &.list {
    display: grid;
    grid-gap: 6px;
    grid-template-columns: 1fr;
  }
`;

const Hits = ({
  hits,
  toggleFilterByIncidentId,
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

  const [display] = useQueryParam('display', DisplayModeEnumParam);

  return (
    <HitsContainer className={`container-xl mt-4 ${display}`}>
      {hits.map((hit) => (
        <Hit
          key={hit.objectID}
          item={hit}
          authorsModal={authorsModal}
          submittersModal={submittersModal}
          flagReportModal={flagReportModal}
          toggleFilterByIncidentId={toggleFilterByIncidentId}
        />
      ))}
    </HitsContainer>
  );
};

export default connectHits(connectStateResults(Hits));
