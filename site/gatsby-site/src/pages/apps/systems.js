import React from 'react';
import AiidHelmet from 'components/AiidHelmet';
import Systems from 'components/systems/Systems';

function SystemsApp(props) {
  return (
    <div {...props} className="w-full">
      <AiidHelmet path={props.location.pathname}>
        <title>Artificial Intelligence Incident Database</title>
      </AiidHelmet>
      <Systems />
    </div>
  );
}

export default SystemsApp;
