import { mergeSchemas } from '@graphql-tools/schema';
import { getSchema as getLocalSchema } from './local';
import { getSchema as getRemoteSchema } from './remote';

require('json-bigint-patch');

const localSchema = getLocalSchema();

const remoteSchema = getRemoteSchema();

const gatewaySchema = mergeSchemas({
    schemas: [remoteSchema, localSchema],
});


export const schema = gatewaySchema;

