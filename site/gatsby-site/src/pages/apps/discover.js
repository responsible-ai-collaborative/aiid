import React from 'react';
import AiidHelmet from 'components/AiidHelmet';
import Discover from 'components/discover/Discover';

function DiscoverApp(props) {
  return (
    <div className="w-full">
      <AiidHelmet path={props.location.pathname}>
        <title>Artificial Intelligence Incident Database</title>
      </AiidHelmet>
      <Discover />
    </div>
  );
}

export default DiscoverApp;
