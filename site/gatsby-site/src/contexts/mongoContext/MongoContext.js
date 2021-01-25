import { createContext, useContext } from 'react';

export const MongoContext = createContext({ runQuery: () => {}, updateOne: () => {} });
export const useMongoContext = () => useContext(MongoContext);
