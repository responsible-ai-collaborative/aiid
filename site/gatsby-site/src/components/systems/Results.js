import CardSkeleton from 'elements/Skeletons/Card';
import ListSkeleton from 'elements/Skeletons/List';
import React, { useState } from 'react';
import Hit from './Hit';
import { Trans } from 'react-i18next';

export default function Results({ display, viewType, loading, results, minVisible = 3 }) {
  const [numVisible, setNumVisible] = useState(minVisible);

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
      {loading ? (
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
        <>
          {results.map((result, index) => {
            if (index >= numVisible) {
              return null;
            }

            return (
              <Hit key={result.objectID} item={result} display={display} viewType={viewType} />
            );
          })}

          <div>
            {numVisible > minVisible && (
              <button
                onClick={() => setNumVisible((numVisible) => numVisible - minVisible)}
                className="w-fit text-blue-700 border mt-4 ml-1 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-xs p-1.5 text-center inline-flex items-center mr-2  dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800"
              >
                <Trans>View Less</Trans>
              </button>
            )}

            {numVisible < results.length && (
              <button
                onClick={() => setNumVisible((numVisible) => numVisible + minVisible)}
                className="w-fit text-blue-700 border mt-4 ml-1 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-xs p-1.5 text-center inline-flex items-center mr-2  dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800"
              >
                <Trans>View ({{ minVisible }}) more</Trans>
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
