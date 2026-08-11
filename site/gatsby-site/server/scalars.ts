import { GraphQLScalarType, Kind, ValueNode } from "graphql";
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

function parseLiteralValue(ast: ValueNode): any {
    switch (ast.kind) {
        case Kind.STRING:
        case Kind.BOOLEAN:
            return ast.value;
        case Kind.INT:
            return parseInt(ast.value, 10);
        case Kind.FLOAT:
            return parseFloat(ast.value);
        case Kind.LIST:
            return ast.values.map(parseLiteralValue);
        case Kind.OBJECT:
            return Object.fromEntries(ast.fields.map(f => [f.name.value, parseLiteralValue(f.value)]));
        case Kind.NULL:
            return null;
        default:
            return null;
    }
}

export const AttributeValueScalar = new GraphQLScalarType({
    name: 'AttributeValue',
    description: 'Value of classification attribute as typed data',
    serialize(value: unknown) {
        return value;
    },
    parseValue(value: unknown) {
        return value;
    },
    parseLiteral(ast) {
        return parseLiteralValue(ast);
    },
});