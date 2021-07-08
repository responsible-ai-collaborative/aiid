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
    const mongoCollection = realmApp.services
      .mongodb(dbService)
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
    let authors = data.authors;

    if (Object.prototype.toString.call(authors) !== '[object Array]') {
      authors = data.authors.split(',').map(function (item) {
        return item.trim();
      });
    }

    let submitters = data.submitters;

    if (Object.prototype.toString.call(submitters) !== '[object Array]') {
      submitters = data.submitters.split(',').map(function (item) {
        return item.trim();
      });
    }

    const newData = {
      ...data,
      authors: authors,
      submitters: submitters,
    };

    const mongoCollection = realmApp.services
      .mongodb(dbService)
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
