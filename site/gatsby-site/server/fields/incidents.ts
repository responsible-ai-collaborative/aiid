import { GraphQLBoolean, GraphQLFieldConfigMap, GraphQLInputObjectType, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLString } from "graphql";
import { allow } from "graphql-shield";
import { generateMutationFields, generateQueryFields, getQueryResolver, createNestedObjectFilter, CustomStringFilter } from "../utils";
import { Context, DBIncident, DBClassification } from "../interfaces";
import { isRole } from "../rules";
import { createNotificationsOnNewIncident, createNotificationsOnUpdatedIncident, hasRelevantUpdates, linkReportsToIncidents, logIncidentHistory } from "./common";
import { IncidentType } from "../types/incidents";

// Define classification-specific filter types
const ClassificationAttributeFilter = createNestedObjectFilter('ClassificationAttribute', {
    short_name: { type: CustomStringFilter },
    value_json: { type: CustomStringFilter },
    value: { type: CustomStringFilter }
});

const ClassificationFilter = createNestedObjectFilter('Classification', {
    namespace: { type: CustomStringFilter },
    attributes: { type: ClassificationAttributeFilter }
});

/**
 * Helper function to process values for database queries against the value_json field.
 * 
 * The classification attributes store their values in a `value_json` field as JSON-stringified data.
 * This function converts user-provided search values into the correct format for database queries.
 * 
 * Examples:
 * - String "hello" -> "\"hello\"" (JSON-stringified string)
 * - Number "42" -> "42" (JSON number)
 * - Boolean "true" -> "true" (JSON boolean)
 * - Already JSON "\"hello\"" -> "\"hello\"" (unchanged)
 * - Array "[1,2,3]" -> "[1,2,3]" (unchanged)
 * 
 * @param searchValue The value provided by the user in the GraphQL query
 * @returns The formatted value to match against the value_json field in the database
 */
const processValueForQuery = (searchValue: string): string => {
    // Handle null/undefined
    if (searchValue === null || searchValue === undefined) {
        return 'null';
    }
    
    // If the search value is already valid JSON, use it as-is
    try {
        JSON.parse(searchValue);
        return searchValue;
    } catch (e) {
        // If it's not valid JSON, it's likely a primitive value that needs to be JSON-stringified
        // Handle special cases for common data types
        if (searchValue === 'true' || searchValue === 'false') {
            // Boolean values should be stored as JSON booleans
            return searchValue;
        }
        
        // Check if it's a number
        const numericValue = Number(searchValue);
        if (!isNaN(numericValue) && isFinite(numericValue)) {
            // Numeric values should be stored as JSON numbers
            return searchValue;
        }
        
        // Everything else should be treated as a string and JSON-stringified
        return JSON.stringify(searchValue);
    }
};

// Define classification filter for incidents
const classificationsFilter = {
    name: 'classifications',
    type: ClassificationFilter,
    resolve: async (filterValue: any, context: Context) => {
        const db = context.client.db('aiidprod');
        const classificationsCollection = db.collection<DBClassification>('classifications');
        
        // Build classification query based on filter values
        const query: any = {};
        
        if (filterValue.namespace) {
            if (filterValue.namespace.eq) {
                query.namespace = filterValue.namespace.eq;
            }
            if (filterValue.namespace.in) {
                query.namespace = { $in: filterValue.namespace.in };
            }
        }
        
        if (filterValue.attributes) {
            const attrQuery: any = {};
            if (filterValue.attributes.short_name?.eq) {
                attrQuery.short_name = filterValue.attributes.short_name.eq;
            }
            if (filterValue.attributes.value_json?.eq) {
                attrQuery.value_json = filterValue.attributes.value_json.eq;
            }
            if (filterValue.attributes.value?.eq) {
                // For value field, we need to match against the parsed JSON content
                // The value_json field contains JSON-stringified values
                const searchValue = filterValue.attributes.value.eq;
                attrQuery.value_json = processValueForQuery(searchValue);
            }
            if (filterValue.attributes.value?.in) {
                // For value field with 'in' operator, match against multiple possible values
                const valueJsonQueries = filterValue.attributes.value.in.map((val: string) => 
                    processValueForQuery(val)
                );
                attrQuery.value_json = { $in: valueJsonQueries };
            }
            if (filterValue.attributes.value?.ne) {
                // For value field with 'ne' (not equal) operator
                const searchValue = filterValue.attributes.value.ne;
                attrQuery.value_json = { $ne: processValueForQuery(searchValue) };
            }
            if (filterValue.attributes.value?.regex) {
                // For value field with regex matching (useful for partial matches)
                attrQuery.value_json = { 
                    $regex: filterValue.attributes.value.regex,
                    $options: filterValue.attributes.value.options || 'i'
                };
            }
            
            if (Object.keys(attrQuery).length > 0) {
                query.attributes = { $elemMatch: attrQuery };
            }
        }
        
        // Find matching classifications and extract incident IDs
        const matchingClassifications = await classificationsCollection.find(query).toArray();
        const incidentIds = [...new Set(matchingClassifications.flatMap(c => c.incidents))];
        
        // Return MongoDB filter for incident IDs
        return incidentIds.length > 0 
            ? { incident_id: { $in: incidentIds } }
            : { incident_id: { $in: [] } }; // Force empty result if no matches
    }
};

export const queryFields: GraphQLFieldConfigMap<any, Context> = {

    // Use custom filters for incidents
    ...generateQueryFields({ 
        collectionName: 'incidents', 
        Type: IncidentType, 
        customFilters: [classificationsFilter] 
    })
}


const LinkReportsToIncidentsInput = new GraphQLInputObjectType({
    name: 'LinkReportsToIncidentsInput',
    fields: {
        incident_ids: { type: new GraphQLList(new GraphQLNonNull(GraphQLInt)) },
        report_numbers: { type: new GraphQLList(new GraphQLNonNull(GraphQLInt)) },
    },
});

export const mutationFields: GraphQLFieldConfigMap<any, Context> = {

    ...generateMutationFields({
        collectionName: 'incidents',
        Type: IncidentType,
        generateFields: ['insertOne', 'updateOne', 'updateMany'],
        onResolve: async (operation, context, params) => {

            const { result, initial } = params!;

            if (operation === 'insertOne') {

                await logIncidentHistory(result, context);

                await createNotificationsOnNewIncident(result, context);
            }

            if (operation === 'updateOne') {

                await logIncidentHistory(result, context);

                if (hasRelevantUpdates(initial, result)) {

                    await createNotificationsOnUpdatedIncident(result, initial, context);
                }
            }

            return result;
        },
    }),

    linkReportsToIncidents: {
        type: new GraphQLList(IncidentType),
        args: {
            input: {
                type: new GraphQLNonNull(LinkReportsToIncidentsInput)
            }
        },
        resolve: getQueryResolver(IncidentType, async (filter, projection, options, obj, args, context) => {

            await linkReportsToIncidents(context.client, args.input.report_numbers, args.input.incident_ids);

            const incidentsCollection = context.client.db('aiidprod').collection<DBIncident>("incidents");


            const updates = await incidentsCollection.find({ incident_id: { $in: args.input.incident_ids } }).toArray();

            for (const updated of updates) {

                await logIncidentHistory(updated, context);
            }

            return incidentsCollection.find({ reports: { $in: args.input.report_numbers } }, options).toArray();
        })
    },

    flagIncidentSimilarity: {
        type: IncidentType,
        args: {
            incidentId: { type: new GraphQLNonNull(GraphQLInt) },
            dissimilarIds: { type: new GraphQLList(new GraphQLNonNull(GraphQLInt)) },
        },
        resolve: getQueryResolver(IncidentType, async (filter, projection, options, obj, args, context) => {

            const incidentsCollection = context.client.db('aiidprod').collection<DBIncident>("incidents");

            await incidentsCollection.updateOne({ incident_id: args.incidentId }, { $set: { flagged_dissimilar_incidents: args.dissimilarIds } });

            if (context?.user?.id) {

                await incidentsCollection.updateOne({ incident_id: args.incidentId }, { $addToSet: { editors: context.user.id } });
            }

            const updated = await incidentsCollection.findOne({ incident_id: args.incidentId }, options);

            if (updated) {

                await logIncidentHistory(updated, context);
            }

            return updated;
        })
    },

    updateOneIncidentTranslation: {
        args: {
            input: {
                type: new GraphQLNonNull(new GraphQLInputObjectType({
                    name: 'UpdateOneIncidentTranslationInput',
                    fields: {
                        language: { type: new GraphQLNonNull(GraphQLString) },
                        incident_id: { type: new GraphQLNonNull(GraphQLInt) },
                        title: { type: new GraphQLNonNull(GraphQLString) },
                        description: { type: new GraphQLNonNull(GraphQLString) },
                        dirty: { type: GraphQLBoolean },
                    },
                }))
            }
        },
        type: IncidentType,
        resolve: getQueryResolver(IncidentType, async (filter, projection, options, obj, args, context) => {

            // update the translation in the `incidents` collection
            const translationsCollection = context.client.db('translations').collection("incidents");

            const translation = {
                title: args.input.title,
                description: args.input.description,
                language: args.input.language,
                dirty: args.input.dirty,
                modified_at: new Date(),
            };

            await translationsCollection.updateOne(
                { incident_id: args.input.incident_id, language: args.input.language },
                { $set: { ...translation } },
                { upsert: true }
            );

            const incidents = context.client.db('aiidprod').collection("incidents");

            const incident = await incidents.findOne({ incident_id: args.input.incident_id }, options);

            return incident;
        }),
    },
}

export const permissions = {
    Query: {
        incident: allow,
        incidents: allow,
    },
    Mutation: {
        insertOneIncident: isRole('incident_editor'),
        updateOneIncident: isRole('incident_editor'),
        updateManyIncidents: isRole('incident_editor'),
        linkReportsToIncidents: isRole('incident_editor'),
        flagIncidentSimilarity: allow,
        updateOneIncidentTranslation: isRole('incident_editor'),
    }
}