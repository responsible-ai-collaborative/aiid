import { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLList, GraphQLInt, GraphQLNonNull, GraphQLID } from 'graphql';
import { ObjectIdScalar } from '../scalars';
import { IncidentType } from './incidents';
import { getListRelationshipConfig } from '../utils';
import { ReportType } from './report';

const AttributeType = new GraphQLObjectType({
    name: 'Attribute',
    fields: {
        short_name: { type: GraphQLString },
        value_json: { type: GraphQLString }
    }
});

export const ClassificationType = new GraphQLObjectType({
    name: 'Classification',
    fields: {
        _id: { type: ObjectIdScalar },
        attributes: { type: new GraphQLList(AttributeType) },
        incidents: getListRelationshipConfig(IncidentType, GraphQLInt, 'incidents', 'incident_id', 'incidents', 'aiidprod'),
        namespace: { type: new GraphQLNonNull(GraphQLString) },
        notes: { type: GraphQLString },
        publish: { type: GraphQLBoolean },
        reports: getListRelationshipConfig(ReportType, GraphQLInt, 'reports', 'report_number', 'reports', 'aiidprod')
    }
});


// dependencies property gets ignored by newest graphql package so we have to add it manually after the type is created
// ideally should be fixed in the graphql-to-mongodb package

//@ts-ignore 
ClassificationType.getFields().reports.dependencies = ['reports'];

//@ts-ignore 
ClassificationType.getFields().incidents.dependencies = ['incidents'];