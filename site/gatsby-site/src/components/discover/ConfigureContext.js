//TODO: we should delete this, eventually... see https://github.com/algolia/instantsearch/issues/5892

import React, { createContext, useState } from 'react';
import { Configure, useInstantSearch } from 'react-instantsearch';

export const ConfigureContext = createContext({});

export const ConfigureProvider = ({ children }) => {
  const { indexUiState } = useInstantSearch();

  const [configure, setConfigure] = useState({ ...indexUiState.__configure });

  return (
    <ConfigureContext.Provider value={{ configure, setConfigure }}>
      <Configure {...configure} />
      {children}
    </ConfigureContext.Provider>
  );
};
