'use client';

import React, { useEffect, useState, createContext, useContext } from 'react';
import Rollbar from 'rollbar';
import { RollbarErrorBoundary } from './RollbarErrorBoundary';
const config = require('../../config');

export const Context = createContext();
Context.displayName = 'Rollbar';

export function useRollbar() {
  const context = useContext(Context);

  const { rollbarInstance } = context;

  return rollbarInstance;
}

export function RollbarProvider({ children }) {
  const [rollbarInstance, setRollbarInstance] = useState(null);

  useEffect(() => {
    let environment = 'other';

    if (window.location.hostname == 'incidentdatabase.ai') {
      environment = 'production';
    } else if (window.location.hostname == 'staging-aiid.netlify.app') {
      environment = 'staging';
    } else if (window.location.hostname == 'localhost') {
      environment = 'localhost';
    } else if (window.location.host.includes('deploy-preview')) {
      environment = 'deploy-preview';
    }

    const rollbarConfig = {
      accessToken: config.rollbar.token,
      environment,
    };

    const rollbar = new Rollbar(rollbarConfig);

    setRollbarInstance(rollbar);
  }, []);

  return (
    <Context.Provider value={{ rollbarInstance }}>
      <RollbarErrorBoundary rollbarInstance={rollbarInstance}>{children}</RollbarErrorBoundary>
    </Context.Provider>
  );
}
