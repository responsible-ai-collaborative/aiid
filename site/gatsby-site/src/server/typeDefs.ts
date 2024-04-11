import gql from "graphql-tag";

export default gql`
directive @auth(requires: Role = admin) on OBJECT | FIELD_DEFINITION

enum Role {
  admin
  subscriber
}

scalar Long
scalar ObjectId

type QuickAdd {
  _id: ObjectId
  date_submitted: String!
  incident_id: Long
  source_domain: String
  url: String!
}

input QuickaddQueryInput {
  _id: ObjectId
}

type Query {
  quickadds(query: QuickaddQueryInput): [QuickAdd]
}


type DeleteManyPayload {
  deletedCount: Int!
}

type Mutation {
  deleteManyQuickadds(query: QuickaddQueryInput): DeleteManyPayload @auth(requires: admin)
}
`