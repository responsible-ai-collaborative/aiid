import gql from "graphql-tag";

export default gql`

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