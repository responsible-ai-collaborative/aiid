import gql from "graphql-tag";

export default gql`
directive @auth(requires: Role = admin) on OBJECT | FIELD_DEFINITION

enum Role {
  admin
  subscriber
}

scalar Long
scalar ObjectId

type Query {
  _: String
}

type Mutation {
  _: String
}

type DeleteManyPayload {
  deletedCount: Int!
}
`