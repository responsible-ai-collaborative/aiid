import React from 'react';
import { connectHits, connectStateResults } from 'react-instantsearch-dom';
import Hit from './Hit';
import { DisplayModeEnumParam } from './queryParams';
import { useQueryParam } from 'use-query-params';
import CardSkeleton from 'elements/Skeletons/Card';
import ListSkeleton from 'elements/Skeletons/List';

const Hits = ({
  hits,
  authorsModal,
  submittersModal,
  flagReportModal,
  isSearchStalled,
  toggleFilterByIncidentId,
  viewType,
}) => {
  const [display] = useQueryParam('display', DisplayModeEnumParam);

  if (!isSearchStalled && hits.length === 0) {
    return (
      <div className="tw-no-results">
        <p>Your search returned no results.</p>
        <p>Please clear your search in the search box above or the filters.</p>
      </div>
    );
  }

  return (
    <div
      className={`tw-hits-container ml-auto mr-auto pl-3 pr-3 w-full lg:max-w-6xl xl:max-w-7xl ${display} mt-4`}
    >
      {isSearchStalled ? (
        display === 'list' ? (
          <ListSkeleton />
        ) : (
          Array(24)
            .fill()
            .map((skeleton, i) => (
              <CardSkeleton key={i} className="m:inline-block ml-3" text={display == 'details'} />
            ))
        )
      ) : (
        hits.map((hit) => (
          <Hit
            key={hit.objectID}
            item={hit}
            {...{
              authorsModal,
              submittersModal,
              flagReportModal,
              toggleFilterByIncidentId,
              viewType,
            }}
          />
        ))
      )}
    </div>
  );
};

export default connectHits(connectStateResults(Hits));
