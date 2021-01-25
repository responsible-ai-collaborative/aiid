import React from 'react';

import { MongoContext } from './MongoContext';
import { useMongo } from 'mongodb/useMongo';

export const MongoContextProvider = ({ children }) => {
  const { runQuery, updateOne } = useMongo();

  return <MongoContext.Provider value={{ runQuery, updateOne }}>{children}</MongoContext.Provider>;
};
