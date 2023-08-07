import React, { useCallback, useState, useEffect } from 'react';
import { StringParam, useQueryParams, withDefault } from 'use-query-params';
import AiidHelmet from 'components/AiidHelmet';
import Querier from 'components/queries/Querier';
import { GraphiQLProvider } from '@graphiql/react';
import { createGraphiQLFetcher } from '@graphiql/toolkit';
import fetch from 'node-fetch';



const queryConfig = {
  s: StringParam,
}

function DiscoverApp(props) {

  const [fetcher, setFetcher] = useState(null);

  useEffect(() => {

    const fetcher = createGraphiQLFetcher({
      url: 'https://incidentdatabase.ai/api/graphql',
    });

    setFetcher(fetcher);
  }, []);

  return (
    <div {...props} className="w-full">
      <AiidHelmet path={props.location.pathname}>
        <title>Artificial Intelligence Incident Database</title>
      </AiidHelmet>

      {
        fetcher && <GraphiQLProvider fetcher={fetcher}>
          <Querier />
        </GraphiQLProvider>
      }


    </div>
  );
}

export default DiscoverApp;
