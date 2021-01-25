import { useEffect, useState } from 'react';
import { realmApp } from './authenticate';
import config from '../../config';

// https://docs.mongodb.com/realm/web/mongodb/

const DB_SERVICE = config['realm']['review_db']['db_service'];

const DB_NAME = config['realm']['review_db']['db_name'];

const DB_COLLECTION = config['realm']['review_db']['db_collection'];

export const useMongo = (dbService = DB_SERVICE) => {
  const [mongo, setMongo] = useState();

  const runQuery = async (query, callback, dbName = DB_NAME, dbCollection = DB_COLLECTION) => {
    console.log('querying: ' + query);

    const mongoCollection = mongo.db(dbName).collection(dbCollection);

    const res = await mongoCollection.find(query);

    callback(res);
  };

  const updateOne = async (
    query,
    data,
    callback,
    dbName = DB_NAME,
    dbCollection = DB_COLLECTION
  ) => {
    console.log('querying: ' + query);

    const mongoCollection = mongo.db(dbName).collection(dbCollection);

    const res = await mongoCollection.updateOne(query, data);

    callback(res);
  };

  useEffect(() => {
    setMongo(realmApp.services.mongodb(dbService));
  }, [dbService]);

  return {
    runQuery,
    updateOne,
  };
};
