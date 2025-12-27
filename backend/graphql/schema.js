const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Message {
    id: ID!
    text: String!
    user: String!
    timestamp: String!
    sender: ID!
    receiver:ID!
  }

  type User {
    id: ID!
    name: String
    email: String!
    createdAt: String
    lastSeen : String
  }

  type AuthResponse {
    token: String!
    user: User!
    message: String!
  }

  type Query {
    messagesWith(userId:ID!): [Message]!
    me: User
    users:[User!]!
  }

  type Mutation {
    sendMessage(receiver:ID!, text: String!): Message!

    registerUser(name: String!, email: String!, password: String!): AuthResponse!
    login(email: String!, password: String!): AuthResponse!

    logout: Boolean!
  }
`;

module.exports = typeDefs;
