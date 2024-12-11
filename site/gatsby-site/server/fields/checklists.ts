import { GraphQLFieldConfigMap, GraphQLList } from "graphql";
import { allow, or } from "graphql-shield";
import { generateMutationFields, generateQueryFields, getQueryArgs, getQueryResolver } from "../utils";
import { ChecklistType, RisksInputType, RiskType } from "../types/checklist";
import { isAdmin, isChecklistsOwner, isSubscriber } from "../rules";

const getRiskClassificationsMongoQuery = (tagStrings: any) => {

    if (!tagStrings) return {};

    const tagSearch: any = {};

    for (const tagString of tagStrings) {
        const parts = tagString.split(":");
        const namespace = parts[0];
        if (!tagSearch[namespace]) {
            tagSearch[namespace] = [];
        }
        const tag: any = {};
        tag.short_name = parts[1];
        if (parts.length > 2) {
            tag.value_json = { $regex: `"${parts[2]}"` };
        }
        tagSearch[namespace].push(tag);
    }

    return {
        $or: Object.keys(tagSearch).map(
            namespace => ({
                namespace,
                attributes: {
                    $elemMatch: {
                        $or: tagSearch[namespace]
                    }
                }
            })
        )
    }
}

// Example classification:
// {
//   attributes: [
//     { short_name: "Known AI Goal"},
//       value_json: '["Content Recommendation", "Something"]' }
//     ...
//   ]
// }
const tagsFromClassification = (classification: any) => (
    joinArrays(
        classification.attributes.filter((a: any) => ![null, undefined].includes(a.value_json)).map(
            (attribute: any) => (
                [].concat(parseJson(attribute.value_json))
                    .filter(value => Array.isArray(value) || typeof value !== 'object')
                    .map(
                        value => [
                            classification.namespace,
                            attribute.short_name,
                            value
                        ].join(':')
                    )
            )
        )
    )
);

const parseJson = (json: any) => {
    try {
        return JSON.parse(json);
    } catch (e) {
        throw new Error('Could not parse ' + json)
    }
}

const joinArrays = (arrays: any[]) => arrays.reduce(
    (result, array) => result.concat(array), []
);

const groupByMultiple = (array: any[], keyFunction: any, valueFunction?: any) => {
    const groups: any = {};
    for (const element of array) {
        const keys = keyFunction(element);
        for (const key of keys) {
            if (!groups[key]) {
                groups[key] = new Set();
            }
            groups[key].add(
                valueFunction ? valueFunction(element) : element
            );
        }
    }
    for (const group in groups) {
        groups[group] = Array.from(groups[group]);
    }
    return groups;
}

export const queryFields: GraphQLFieldConfigMap<any, any> = {

    ...generateQueryFields({ collectionName: 'checklists', Type: ChecklistType }),

    risks: {
        args: {
            input: { type: RisksInputType },
        },
        type: new GraphQLList(RiskType),
        resolve: async (_: unknown, { input }: { input: any }, context) => {

            const db = context.client.db('aiidprod');
            const incidentsCollection = db.collection('incidents');
            const classificationsCollection = db.collection('classifications');

            const classificationsMatchingSearchTags = (
                await classificationsCollection.find(
                    getRiskClassificationsMongoQuery(input?.tags),
                ).toArray()
            );

            const tagsByIncidentId: any = {};
            for (const classification of classificationsMatchingSearchTags) {
                for (const id of classification.incidents) {
                    tagsByIncidentId[id] = (
                        (tagsByIncidentId[id] || []).concat(
                            tagsFromClassification(classification)
                        )
                    );
                }
            }

            const incidentIdsMatchingSearchTags = (
                classificationsMatchingSearchTags.map((c: any) => c.incidents).flat()
            );

            const incidentsMatchingSearchTags = await incidentsCollection.find(
                { incident_id: { $in: incidentIdsMatchingSearchTags } },
            ).toArray();

            // TODO: These should probably be defined in the taxa
            const failureTags = [
                { namespace: "GMF", short_name: "Known AI Technical Failure" },
            ];

            // TODO: This selects every field.
            // For performance, we should only select those we need.
            const failureClassificationsMatchingIncidentIds = (
                await classificationsCollection.find(
                    {
                        incidents: {
                            $elemMatch: {
                                $in: incidentIdsMatchingSearchTags
                            }
                        },
                        $or: failureTags.map(
                            failureTag => ({
                                namespace: failureTag.namespace,
                                "attributes.short_name": failureTag.short_name
                            })
                        )
                    },
                ).toArray()
            )

            const matchingClassificationsByFailure = groupByMultiple(
                failureClassificationsMatchingIncidentIds,
                (classification: any) => tagsFromClassification(classification).filter(
                    (tag: any) => failureTags.some(
                        f => tag.startsWith(`${f.namespace}:${f.short_name}:`)
                    )
                )
            );

            const risks = Object.keys(matchingClassificationsByFailure).map(
                failure => ({
                    api_message: "This is an experimental an unsupported API",
                    tag: failure,
                    title: failure.replace(/.*:/g, ''),
                    tags: [failure],
                    precedents: matchingClassificationsByFailure[failure].map(
                        (failureClassification: any) => (
                            incidentsMatchingSearchTags
                                .filter((incident: any) => failureClassification.incidents.includes(incident.incident_id))
                                .map((incident: any) => ({ ...incident, tags: tagsByIncidentId[incident.incident_id] }))
                        )
                    ).flat()
                })
            ).sort((a, b) => b.precedents.length - a.precedents.length);

            return risks;
        },
    },
}

export const mutationFields: GraphQLFieldConfigMap<any, any> = {
    ...generateMutationFields({ collectionName: 'checklists', Type: ChecklistType, generateFields: ['deleteOne', 'insertOne', 'upsertOne'] }),
}

export const permissions = {
    Query: {
        checklist: allow,
        checklists: allow,
        risks: allow,
    },
    Mutation: {
        insertOneChecklist: allow, // TODO: anonymous users can create checklists, this may break with the Next Auth implementation
        deleteOneChecklist: or(isAdmin, isChecklistsOwner()),
        upsertOneChecklist: or(isAdmin, isChecklistsOwner()),
    },
}
