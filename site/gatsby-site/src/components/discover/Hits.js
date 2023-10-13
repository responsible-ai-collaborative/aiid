import React, { useEffect, useState } from 'react';
import { useHits, useInstantSearch, useRefinementList } from 'react-instantsearch';
import Hit from './Hit';
import { DisplayModeEnumParam } from './queryParams';
import { useQueryParam } from 'use-query-params';
import CardSkeleton from 'elements/Skeletons/Card';
import ListSkeleton from 'elements/Skeletons/List';

const Hits = ({ hits, isSearchStalled, viewType }) => {
  const [display] = useQueryParam('display', DisplayModeEnumParam);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { refine } = useRefinementList({ attribute: 'incident_id' });

  if (!isSearchStalled && hits.length === 0) {
    return (
      <div className="tw-no-results">
        <p>Your search returned no results.</p>
        <p>Please clear your search in the search box above or the filters.</p>
      </div>
    );
  }

  if (!isMounted) return <></>;

  const isLoading = isSearchStalled && isMounted;

  return (
    <div
      data-cy="hits-container"
      style={{
        gridTemplateColumns: {
          compact: 'repeat( auto-fit, minmax(18rem, 1fr) )',
          details: 'repeat( auto-fit, minmax(18rem, 1fr) )',
          list: '1fr',
        }[display],
      }}
      className={`grid gap-2 mt-4 mx-auto px-3 w-full lg:max-w-6xl xl:max-w-7xl`}
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
              viewType,
              toggleFilterByIncidentId: () => {
                refine(hit.incident_id);
              },
            }}
          />
        ))
      )}
    </div>
  );
};

export default connectHits(Hits);

function connectHits(Component) {
  const Hits = (props) => {
    const data = useHits(props);

    const { status } = useInstantSearch();

    return <Component {...props} {...data} isSearchStalled={status == 'stalled'} />;
  };

  return Hits;
}
