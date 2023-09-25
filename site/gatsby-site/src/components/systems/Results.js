import React, { useState } from 'react';
import Hits from './Hits';
import { Button, Spinner } from 'flowbite-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';

export default function Results({
  display,
  viewType,
  filters,
  searching,
  fetching,
  results,
  headingComponent: Heading,
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="mt-4">
      <div className="flex justify-between px-2">
        <div>
          {(searching || fetching) && <Spinner />}
          {(!searching || !fetching) && filters?.length > 0 && (
            <>{results?.length >= 0 && <Heading results={results} />}</>
          )}
        </div>
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
