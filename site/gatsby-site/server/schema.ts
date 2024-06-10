import { mergeSchemas } from '@graphql-tools/schema';
import { getSchema as getLocalSchema } from './local';
import { getSchema as getRemoteSchema } from './remote';
import { stitchSchemas } from '@graphql-tools/stitch'

require('json-bigint-patch');

const localSchema = getLocalSchema();

const remoteSchema = getRemoteSchema();

const gatewaySchema = stitchSchemas({ subschemas: [localSchema, remoteSchema] });

export const schema = gatewaySchema;

