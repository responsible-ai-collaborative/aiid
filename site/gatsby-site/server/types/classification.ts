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
