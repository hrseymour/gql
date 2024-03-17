import { ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';

// Your GraphQL endpoint
const httpLink = new HttpLink({
  uri: 'http://' + process.env.NEXT_PUBLIC_GRAPHQL_ADDRESS + "/graphql", 
});

// Your GraphQL WebSocket endpoint
const wsLink = new WebSocketLink({
  uri: 'ws://' + process.env.NEXT_PUBLIC_GRAPHQL_ADDRESS + "/graphql",
  options: {
    reconnect: true,
  },
});

const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

export default client;

