import { getSchema as getLocalSchema } from './local';
import { getSchema as getRemoteSchema } from './remote';
import { stitchSchemas, ValidationLevel } from '@graphql-tools/stitch'
import { MapperKind, mapSchema } from '@graphql-tools/utils';

require('json-bigint-patch');

const localSchema = getLocalSchema();

const remoteSchema = getRemoteSchema();

const gatewaySchema = stitchSchemas({
    subschemas: [localSchema, remoteSchema],
    typeMergingOptions: {
        validationScopes: {
            'Report.translations': {
                validationLevel: ValidationLevel.Off, // TODO: delete this once schema is completely migrated
            },
            'Report.translations.input': {
                validationLevel: ValidationLevel.Off, // ditto
            },
            ['Incident.reports']: {
                validationLevel: ValidationLevel.Off, // ditto
            },
            ['CreateVariantInput.incidentId']: {
                validationLevel: ValidationLevel.Off // ditto
            },
            ['CreateVariantInput.variant']: {
                validationLevel: ValidationLevel.Off,
            },
            'Incident.editors': {
                validationLevel: ValidationLevel.Off, // ditto
            },
        },
    }
});

const transformedSchema = mapSchema(gatewaySchema, {

    // looks like stichSchemas from ./schema is messing up some resolvers
    // this is a temporary patch until the subscription collection field is replaced with our own implementation
    // it seems to only be affecting the subscriptions collection

    [MapperKind.OBJECT_FIELD]: (fieldConfig, fieldName, parent) => {

        if (parent == 'Subscription' && fieldName === 'incident_id') {
            return {
                ...fieldConfig,
                resolve: (source) => {
                    return source.incident_id
                },
            };
        }

        if (parent == 'Subscription' && fieldName === 'entityId') {
            return {
                ...fieldConfig,
                resolve: (source) => {
                    return source.entityId
                },
            };
        }


        if (parent == 'Subscription' && fieldName === '_id') {
            return {
                ...fieldConfig,
                resolve: (source) => {
                    return source._id
                },
            };
        }

        if (parent == 'Subscription' && fieldName === 'type') {
            return {
                ...fieldConfig,
                resolve: (source) => {
                    return source.type
                },
            };
        }
        return fieldConfig;
    },
});


export const schema = transformedSchema;

