import { GraphQLFieldConfigMap, GraphQLNonNull, GraphQLString, GraphQLObjectType, GraphQLFloat, GraphQLInt } from "graphql";
import { isRole } from "../rules";
import { ClassificationType } from "../types/classification";
import { execute, parse } from "graphql";
import { Context } from "../interfaces";
import { Classification, Incident, Report } from "../generated/graphql";

interface ClassificationResponse {
    classification: Record<string, string>;
    explanation: string;
    confidence: string;
}

export const queryFields: GraphQLFieldConfigMap<any, any> = {};

// Define a new return type for machine classification
const MachineClassificationResultType = new GraphQLObjectType({
    name: 'MachineClassificationResult',
    fields: {
        confidence: { type: GraphQLFloat },
        explanation: { type: GraphQLString },
        classification: { type: ClassificationType }
    }
});

/**
 * Fetches classifications from the classification API
 */
async function fetchClassification(text: string, taxonomy: string): Promise<ClassificationResponse> {

    const response = await fetch('https://aiid-llm.vercel.app/api/tools/get-classifications', {
        // const response = await fetch('http://localhost:3000/api/tools/get-classifications', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text, taxonomy })
    });

    const responseData = await response.json();

    return responseData;
}

export const mutationFields: GraphQLFieldConfigMap<any, Context> = {
    machineClassificationByIncidentId: {
        type: MachineClassificationResultType,
        args: {
            incident_id: { type: new GraphQLNonNull(GraphQLInt) },
            taxonomy: { type: new GraphQLNonNull(GraphQLString) }
        },
        resolve: async (_, { incident_id, taxonomy }, context) => {

            const incidentQuery = `
                query FindIncidentBasic($filter: IncidentFilterType) {
                    incident(filter: $filter) {
                        title
                        description
                        reports {
                            report_number
                        }
                    }
                }
            `;

            const incidentResult = await execute({
                schema: context.schema,
                document: parse(incidentQuery),
                variableValues: {
                    filter: { incident_id: { EQ: incident_id } }
                },
                contextValue: context
            });

            if (!incidentResult.data?.incident) {
                throw new Error(`Incident with ID ${incident_id} not found`);
            }

            const incident = incidentResult.data.incident as Incident;

            let combinedText = `${incident.title}\n${incident.description || ''}`;

            const firstReportNumber = incident.reports![0]!.report_number!;

            const reportQuery = `
                query FindReport($filter: ReportFilterType) {
                    report(filter: $filter) {
                        text
                        title
                        description
                    }
                }
            `;

            const reportResult = await execute({
                schema: context.schema,
                document: parse(reportQuery),
                variableValues: {
                    filter: { report_number: { EQ: firstReportNumber } }
                },
                contextValue: context
            });

            if (reportResult.data?.report) {
                const report = reportResult.data.report as Report;
                if (report.text) {
                    combinedText += `\n${report.title || ''}\n${report.description || ''}\n${report.text}`;
                }
            }
            const data = await fetchClassification(combinedText, taxonomy);

            const result = {
                confidence: parseFloat(data.confidence),
                explanation: data.explanation,
                classification: {
                    namespace: taxonomy,
                    attributes: data.classification.attributes,
                }
            };

            return result;
        }
    }
}

export const permissions = {
    Mutation: {
        machineClassificationByIncidentId: isRole('incident_editor')
    }
}