const {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString
} = require('graphql');

const {
  globalIdField,
} = require('graphql-relay');

const IoC = require('AppIoC');

const postType = (
  postModel,
  nodeInterface,
  userType
) => new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: globalIdField('Post'),
    slug: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    coverImage: { type: GraphQLString },
    logoImage: { type: GraphQLString },
    creator: {
      type: new GraphQLNonNull(userType),
      resolve: post => post.getCreator(),
    },
  }),
  interfaces: [nodeInterface],
  isTypeOf: obj => obj instanceof postModel,
});

IoC.callable('app.graphQL.postType', [
  'blog.postModel',
  'app.graphQL.nodeInterface',
  'app.graphQL.userType',
], postType);
