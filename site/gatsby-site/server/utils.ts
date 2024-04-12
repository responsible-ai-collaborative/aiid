import { Filter, ObjectId } from 'mongodb';

export const convertToObjectID = <T>(filter: Filter<T>): Filter<T> => {

    if (filter._id) {

        return {
            ...filter,
            _id: new ObjectId(filter._id as string)
        }
    }

    return filter;
}