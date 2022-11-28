import React from 'react';
import { connectHits, connectStateResults } from 'react-instantsearch-dom';
import Hit from './Hit';
import { Spinner } from 'flowbite-react';
import { DisplayModeEnumParam } from './queryParams';
import { useQueryParam } from 'use-query-params';

const Hits = ({
  hits,
  authorsModal,
  submittersModal,
  flagReportModal,
  isSearchStalled,
  toggleFilterByIncidentId,
}) => {
  if (isSearchStalled) {
    return (
      <div className="tw-no-results bootstrap">
        <Spinner size={'xl'} />
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

  const [display] = useQueryParam('display', DisplayModeEnumParam);

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
