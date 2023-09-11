import React, { useState } from 'react';
import Hits from './Hits';
import { Trans } from 'react-i18next';
import { Button, Spinner } from 'flowbite-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';

export default function Results({ display, viewType, filters, searching, fetching, results }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="mt-2">
      <div className="flex justify-between">
        <h3>
          {(searching || fetching) && <Spinner />}
          {(!searching || !fetching) && filters?.length > 0 && (
            <>
              {results?.length > 0 && <Trans>{{ length: results.length }} Incidents Found</Trans>}
              {results?.length == 0 && <Trans>No incidents found</Trans>}
            </>
          )}
        </h3>
        {results?.length > 0 && (
          <Button size="xs" onClick={() => setCollapsed((c) => !c)} color="light">
            <FontAwesomeIcon icon={collapsed ? faAngleDown : faAngleUp} />
          </Button>
        )}
      </div>

      {!collapsed && (
        <Hits display={display} viewType={viewType} loading={fetching} results={results} />
      )}
    </div>
  );
}
