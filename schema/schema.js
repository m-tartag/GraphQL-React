const graphql = require('graphql');
const axios = require('axios');
// const _ = require('lodash');

const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema } = graphql;

// keep company first because it serves info to User

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
  },
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    // treat associations between different schemas.. as if they were another field
    company: { type: CompanyType },
  },
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return (
          axios
            .get(`http://localhost:3000/users/${args.id}`)
            // Very important below
            .then(resp => resp.data)
        );
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
