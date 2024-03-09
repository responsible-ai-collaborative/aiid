
import { makeExecutableSchema } from '@graphql-tools/schema';
import { MapperKind, getDirective, mapSchema } from '@graphql-tools/utils';
import { readFileSync } from 'fs';
import { GraphQLSchema, defaultFieldResolver } from 'graphql';
import { QuickAdd, Resolvers } from './generated/graphql';
import { LongResolver, ObjectIDResolver } from 'graphql-scalars';
import path from 'path';
import { MongoClient } from 'mongodb';

export const getSchema = async () => {

    const typeDefs = readFileSync(path.join(__dirname, 'schema.graphql'), { encoding: 'utf-8' });

    const resolvers: Resolvers = {
        ObjectId: ObjectIDResolver,
        Long: LongResolver,
        Query: {
            quickadds: async () => {

                const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING!);

                const db = client.db('aiidprod');
                const collection = db.collection<QuickAdd>('quickadd');
                const items = await collection.find().toArray();

                return items;
            },
        },
    };


    const localSchema = makeExecutableSchema({ typeDefs, resolvers });

    return localSchema;
}


