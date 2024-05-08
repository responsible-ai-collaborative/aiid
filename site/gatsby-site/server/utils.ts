import { Filter, ObjectId } from 'mongodb';

export const convertToObjectID = <T>(filter: Filter<T>): Filter<T> => {

  if ((filter as any)._id) {

    return {
      ...filter,
      _id: new ObjectId((filter as any)._id as string)
    }
  }

  return filter;
}
