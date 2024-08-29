import { GraphQLScalarType, Kind } from "graphql";
import { ObjectId } from "mongodb";

export const ObjectIdScalar = new GraphQLScalarType({
    name: "ObjectId",
    description: "Mongo object id scalar type",
    parseValue(value: unknown) {
        return new ObjectId(value as string);
    },
    serialize(value: unknown) {

        if (typeof value === 'string') {
            return value;
        }

        return (value as ObjectId).toHexString();
    },
    parseLiteral(ast) {

        if (ast.kind === Kind.STRING) {
            return new ObjectId(ast.value);
        }

        return null;
    },
});