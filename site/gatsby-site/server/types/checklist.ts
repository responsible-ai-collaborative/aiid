import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { GraphQLDateTime } from "graphql-scalars";
import { DateTimeResolver } from "graphql-scalars";
import { ObjectIdScalar } from "../scalars";
import { getRelationshipConfig } from "../utils";
import { Context } from "../interfaces";
import { UserType } from "./user";

export const ChecklistType = new GraphQLObjectType({
    name: 'Checklist',
    fields: {
        _id: { type: ObjectIdScalar },
        owner_id: { type: GraphQLString },
        tags_methods: { type: new GraphQLList(GraphQLString) },
        tags_goals: { type: new GraphQLList(GraphQLString) },
        tags_other: { type: new GraphQLList(GraphQLString) },
        about: { type: GraphQLString },
        date_created: { type: GraphQLDateTime },
        date_updated: { type: GraphQLDateTime },
        risks: { 
          type: new GraphQLList(
            new GraphQLObjectType({
              name: 'Risks',
              fields: () => ({
                id: { type: GraphQLString },
                tags: { type: new GraphQLList(GraphQLString) },
                severity: { type: GraphQLString },
                title: { type: GraphQLString },
                generated: { type: GraphQLBoolean },
                risk_status: { type: GraphQLString },
                likelihood: { type: GraphQLString },
                touched: { type: GraphQLBoolean },
                risk_notes: { type: GraphQLString },
                precedents: { 
                  type: new GraphQLList(
                    new GraphQLObjectType({
                      name: 'Precedents',
                      fields: () => ({
                          id: { type: GraphQLString },
                          title: { type: GraphQLString },
                          description: { type: GraphQLString },
                          incident_id: { type: GraphQLInt },
                          tags: { type: new GraphQLList(GraphQLString) },
                      })
                    })
                  )
                }
              })
            })
          )
        },
        id: { type: GraphQLString },
        name: { type: GraphQLString },
    }
});

