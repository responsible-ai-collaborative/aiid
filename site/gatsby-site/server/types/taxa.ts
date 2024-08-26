import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLBoolean,
    GraphQLList,
    GraphQLInt,
} from 'graphql';
import { ObjectIdScalar } from '../scalars';

const CompleteFromType = new GraphQLObjectType({
    name: 'CompleteFrom',
    fields: {
        all: { type: new GraphQLList(GraphQLString) },
        current: { type: new GraphQLList(GraphQLString) },
    },
});

const ItemFieldsType = new GraphQLObjectType({
    name: 'ItemFields',
    fields: {
        complete_from: { type: CompleteFromType },
        default: { type: GraphQLString },
        display_type: { type: GraphQLString },
        field_number: { type: GraphQLString },
        instant_facet: { type: GraphQLBoolean },
        long_description: { type: GraphQLString },
        long_name: { type: GraphQLString },
        mongo_type: { type: GraphQLString },
        permitted_values: { type: new GraphQLList(GraphQLString) },
        placeholder: { type: GraphQLString },
        public: { type: GraphQLBoolean },
        required: { type: GraphQLBoolean },
        short_description: { type: GraphQLString },
        short_name: { type: GraphQLString },
        weight: { type: GraphQLInt },
    },
});

const SubfieldCompleteFromType = new GraphQLObjectType({
    name: 'SubfieldCompleteFrom',
    fields: {
        all: { type: new GraphQLList(GraphQLString) },
        current: { type: new GraphQLList(GraphQLString) },
        entities: { type: GraphQLBoolean }
    }
});

const SubfieldType = new GraphQLObjectType({
    name: 'Subfield',
    fields: {
        field_number: { type: GraphQLString },
        short_name: { type: GraphQLString },
        long_name: { type: GraphQLString },
        short_description: { type: GraphQLString },
        long_description: { type: GraphQLString },
        display_type: { type: GraphQLString },
        mongo_type: { type: GraphQLString },
        default: { type: GraphQLString },
        placeholder: { type: GraphQLString },
        permitted_values: { type: new GraphQLList(GraphQLString) },
        weight: { type: GraphQLInt },
        instant_facet: { type: GraphQLBoolean },
        required: { type: GraphQLBoolean },
        public: { type: GraphQLBoolean },
        complete_from: { type: SubfieldCompleteFromType },
        hide_search: { type: GraphQLBoolean },
    }
});

const FieldListType = new GraphQLObjectType({
    name: 'FieldList',
    fields: {
        complete_from: { type: CompleteFromType },
        default: { type: GraphQLString },
        display_type: { type: GraphQLString },
        field_number: { type: GraphQLString },
        instant_facet: { type: GraphQLBoolean },
        item_fields: { type: ItemFieldsType },
        long_description: { type: GraphQLString },
        long_name: { type: GraphQLString },
        mongo_type: { type: GraphQLString },
        permitted_values: { type: new GraphQLList(GraphQLString) },
        placeholder: { type: GraphQLString },
        public: { type: GraphQLBoolean },
        hide_search: { type: GraphQLBoolean },
        required: { type: GraphQLBoolean },
        short_description: { type: GraphQLString },
        short_name: { type: GraphQLString },
        weight: { type: GraphQLInt },
        notes: { type: GraphQLString },
        subfields: { type: new GraphQLList(SubfieldType) },
    },
});

const DummyFieldsType = new GraphQLObjectType({
    name: 'DummyFields',
    fields: {
        field_number: { type: GraphQLString },
        short_name: { type: GraphQLString },
    },
});

const TaxaType = new GraphQLObjectType({
    name: 'Taxa',
    fields: {
        _id: { type: ObjectIdScalar },
        complete_entities: { type: GraphQLBoolean },
        description: { type: GraphQLString },
        dummy_fields: { type: new GraphQLList(DummyFieldsType) },
        field_list: { type: new GraphQLList(FieldListType) },
        namespace: { type: GraphQLString },
        weight: { type: GraphQLInt },
    },
});

export { TaxaType };