
import { makeExecutableSchema } from '@graphql-tools/schema';
import { MapperKind, getDirective, mapSchema } from '@graphql-tools/utils';
import { readFileSync } from 'fs';
import { GraphQLSchema, defaultFieldResolver } from 'graphql';
import { QuickAdd, Resolvers } from './generated/graphql';
import { LongResolver, ObjectIDResolver } from 'graphql-scalars';
import path from 'path';
import { MongoClient } from 'mongodb';

function authDirectiveTransformer(schema: GraphQLSchema, directiveName: string) {

    const typeDirectiveArgumentMaps: Record<string, any> = {}

    return mapSchema(schema, {
        [MapperKind.TYPE]: type => {
            const authDirective = getDirective(schema, type, directiveName)?.[0]
            if (authDirective) {
                typeDirectiveArgumentMaps[type.name] = authDirective
            }
            return undefined
        },
        [MapperKind.OBJECT_FIELD]: (fieldConfig, _fieldName, typeName) => {
            const authDirective =
                getDirective(schema, fieldConfig, directiveName)?.[0] ??
                typeDirectiveArgumentMaps[typeName]
            if (authDirective) {
                const { requires } = authDirective
                if (requires) {

                    const { resolve = defaultFieldResolver } = fieldConfig;

                    fieldConfig.resolve = function (source, args, context, info) {

                        const { user } = context;

                        if (!user || !user.roles || !user.roles.includes(requires)) {

                            throw new Error('not authorized')
                        }

                        return resolve(source, args, context, info)
                    }
                    return fieldConfig
                }
            }
        }
    })
}


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
        Mutation: {
            deleteManyQuickadds: async (_, args) => {
                const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING!);

                const db = client.db('aiidprod');
                const collection = db.collection<QuickAdd>('quickadd');
                const result = await collection.deleteMany({ _id: { $eq: args.query?._id } });

                return { deletedCount: result.deletedCount! };
            }
        }
    };


    const schema = makeExecutableSchema({ typeDefs, resolvers });

    const schemaWithAuth = authDirectiveTransformer(schema, 'auth');

    return schemaWithAuth;
}


