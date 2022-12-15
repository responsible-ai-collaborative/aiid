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
}) => {
  const [display] = useQueryParam('display', DisplayModeEnumParam);

  if (isSearchStalled) {
    return (
      <div className="tw-no-results bootstrap">
        {display === 'list' ? (
          <ListSkeleton />
        ) : (
          <div className="flex">
            <CardSkeleton />
            <CardSkeleton className="hidden sm:inline-block ml-3" />
            <CardSkeleton className="hidden lg:inline-block ml-3" />
            <CardSkeleton className="hidden xl:inline-block ml-3" />
          </div>
        )}
      </div>
    );
  }

  if (hits.length === 0) {
    return (
      <div className="tw-no-results">
        <p>Your search returned no results.</p>
        <p>Please clear your search in the search box above or the filters.</p>
      </div>
    );
  }

  return (
    <div className={`tw-hits-container tw-container-xl ${display} mt-4`}>
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
    </div>
  );
};

export default connectHits(connectStateResults(Hits));
