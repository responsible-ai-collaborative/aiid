import React, { useState } from 'react';
import Hits from './Hits';
import { Trans } from 'react-i18next';
import { Button, Spinner } from 'flowbite-react';

export default function Results({ display, viewType, filters, searching, loading, results }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="mt-2">
      <div className="flex justify-between">
        <h3>
          {(searching || loading) && <Spinner />}
          {!(searching || loading) && filters?.length > 0 && (
            <>
              {results?.length > 0 && <Trans>{{ length: results.length }} Incidents Found</Trans>}
              {results?.length == 0 && <Trans>No incidents found</Trans>}
            </>
          )}
        </h3>
        {results?.length > 0 && (
          <Button size="xs" onClick={() => setCollapsed((c) => !c)}>
            collapse
          </Button>
        )}
      </div>

      {!collapsed && (
        <Hits display={display} viewType={viewType} loading={loading} results={results} />
      )}
    </div>
  );
}
