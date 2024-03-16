import { ApolloServer } from 'apollo-server';
import { loadFilesSync } from '@graphql-tools/load-files';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { join } from 'path';
import { resolvers } from './resolvers';

const typeDefs = loadFilesSync(join(__dirname, 'schema.graphql'));
const schema = makeExecutableSchema({ typeDefs, resolvers });

const server = new ApolloServer({ schema });

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
