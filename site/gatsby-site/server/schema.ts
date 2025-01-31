import { getSchema as getLocalSchema } from './local';

require('json-bigint-patch');

const localSchema = getLocalSchema();


export const schema = localSchema;

