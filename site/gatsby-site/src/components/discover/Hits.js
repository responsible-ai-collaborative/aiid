import React, { useMemo, useRef, useEffect, useState } from 'react';
import { useHits, useInstantSearch, useRefinementList } from 'react-instantsearch';
import Hit from './Hit';
import { DisplayModeEnumParam } from './queryParams';
import { useQueryParam } from 'use-query-params';
import CardSkeleton from 'elements/Skeletons/Card';
import ListSkeleton from 'elements/Skeletons/List';
import { VIEW_TYPES } from 'utils/discover';

export default function Hits({ ...props }) {
  const { status, results, indexUiState } = useInstantSearch();

  const { hits } = useHits(props);

  const [display] = useQueryParam('display', DisplayModeEnumParam);

  const { refine } = useRefinementList({ attribute: 'incident_id' });

  const isLoading = status === 'loading' || status === 'stalled';

  const [debouncedLoading, setDebouncedLoading] = useState(false);

  useEffect(() => {
    let timeout;

    if (isLoading) {
      timeout = setTimeout(() => setDebouncedLoading(true), 200);
    } else {
      setDebouncedLoading(false);
    }
    return () => clearTimeout(timeout);
  }, [isLoading]);

  const viewType = useMemo(() => {
    return indexUiState.configure.distinct === true &&
      indexUiState.refinementList.is_incident_report.length > 0 &&
      indexUiState.refinementList.is_incident_report[0] === 'true'
      ? VIEW_TYPES.INCIDENTS
      : VIEW_TYPES.REPORTS;
  }, [indexUiState]);

  const hasLoadedOnce = useRef(false);

  useEffect(() => {
    if (status === 'idle' && hits.length > 0) {
      hasLoadedOnce.current = true;
    }
  }, [status, hits.length]);

  if (!results.__isArtificial && results.nbHits === 0) {
    return (
      <div className="tw-no-results">
        <p>Your search returned no results.</p>
        <p>Please clear your search in the search box above or the filters.</p>
      </div>
    );
  }

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
      {debouncedLoading && hits.length === 0 ? (
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
}
