import { getSchema as getLocalSchema } from './local';
import { getSchema as getRemoteSchema } from './remote';
import { stitchSchemas, ValidationLevel } from '@graphql-tools/stitch'

require('json-bigint-patch');

const localSchema = getLocalSchema();

const remoteSchema = getRemoteSchema();

const gatewaySchema = stitchSchemas({
    subschemas: [localSchema, remoteSchema],
    typeMergingOptions: {
        validationScopes: {
            ['Incident.editors']: {
                validationLevel: ValidationLevel.Off,
            },
        }
    }
});

export const schema = gatewaySchema;

