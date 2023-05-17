import React, { useEffect, useState } from 'react';
import { connectHits, connectStateResults } from 'react-instantsearch-dom';
import Hit from './Hit';
import { DisplayModeEnumParam } from './queryParams';
import { useQueryParam } from 'use-query-params';
import CardSkeleton from 'elements/Skeletons/Card';
import ListSkeleton from 'elements/Skeletons/List';

const Hits = ({ hits, isSearchStalled, toggleFilterByIncidentId, viewType }) => {
  const [display] = useQueryParam('display', DisplayModeEnumParam);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isSearchStalled && hits.length === 0) {
    return (
      <div className="tw-no-results">
        <p>Your search returned no results.</p>
        <p>Please clear your search in the search box above or the filters.</p>
      </div>
    );
  }

  if (!isMounted) return <></>;

  let gridClasses = ``;

  const isLoading = isSearchStalled && isMounted;

  switch (display) {
    case 'list':
      gridClasses = `${isLoading ? 'flex flex-wrap' : 'grid grid-cols-1'} gap-2`;
      break;
    case 'compact':
      gridClasses = `${isLoading ? 'flex flex-wrap' : 'grid md:grid-cols-4'} gap-2`;
      break;
    case 'details':
      gridClasses = `${isLoading ? 'flex flex-wrap' : 'grid md:grid-cols-4'} gap-2`;
      break;
  }

  return (
    <div
      className={`tw-hits-container ml-auto mr-auto pl-3 pr-3 w-full lg:max-w-6xl xl:max-w-7xl mt-4 ${gridClasses}`}
    >
      {isLoading ? (
        display === 'list' ? (
          <ListSkeleton />
        ) : (
          Array(24)
            .fill()
            .map((_skeleton, i) => (
              <CardSkeleton key={i} className="m:inline-block ml-3" text={display == 'details'} />
            ))
        )
      ) : (
        hits.map((hit) => (
          <Hit
            key={hit.objectID}
            item={hit}
            {...{
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
