import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { ObjectIdScalar } from "../scalars";
import { GraphQLDateTime } from "graphql-scalars";

export const EntityType = new GraphQLObjectType({
    name: 'Entity',
    fields: {
        _id: { type: ObjectIdScalar },
        entity_id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        created_at: { type: GraphQLDateTime },
        date_modified: { type: GraphQLDateTime },
    },
});
