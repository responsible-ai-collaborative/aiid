import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { DateTimeResolver } from "graphql-scalars";
import { ObjectIdScalar } from "../scalars";
import { getRelationshipConfig } from "../utils";
import { Context } from "../interfaces";
import { UserType } from "./user";


export const ChecklistType = new GraphQLObjectType({
    name: 'Checklist',
    fields: {
        _id: { type: ObjectIdScalar },
        owner_id: { type: new GraphQLString },
        tags_methods: { type: new GraphQLList(GraphQLString) },
        tags_goals: { type: new GraphQLList(GraphQLString) },
        tags_other: { type: new GraphQLList(GraphQLString) },
        about: { type: new GraphQLString },
        risks: { type: new GraphQLList(GraphQLObjectType) },
        id: { type: new GraphQLString },
        name: { type: new GraphQLString },
    }
});

//@ts-ignore
ReportType.getFields().translations.dependencies = [];
//@ts-ignore
ReportType.getFields().user.dependencies = ['user'];
