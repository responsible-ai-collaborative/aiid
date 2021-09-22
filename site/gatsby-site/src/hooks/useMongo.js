import { realmApp } from 'services/realmApp';
import config from '../../config';

// https://docs.mongodb.com/realm/web/mongodb/

const DB_SERVICE = config.realm.review_db.db_service;

const DB_NAME = config.realm.review_db.db_name;

const DB_COLLECTION = config.realm.review_db.db_collection;

export const useMongo = () => {
  const runQuery = async (
    query,
    callback,
    dbService = DB_SERVICE,
    dbName = DB_NAME,
    dbCollection = DB_COLLECTION
  ) => {
    const mongoCollection = realmApp.currentUser
      .mongoClient(dbService)
      .db(dbName)
      .collection(dbCollection);

    const res = await mongoCollection.find(query);

    callback && callback(res);
  };

  const updateOne = async (
    query,
    data,
    callback,
    dbService = DB_SERVICE,
    dbName = DB_NAME,
    dbCollection = DB_COLLECTION
  ) => {
    const newData = {
      ...data,
      authors: data.authors,
      submitters: data.submitters,
    };

    const mongoCollection = realmApp.currentUser
      .mongoClient(dbService)
      .db(dbName)
      .collection(dbCollection);

    const res = await mongoCollection.updateOne(query, newData);

    callback && callback(res);
  };

  return {
    runQuery,
    updateOne,
  };
};
