import { ApolloProvider } from '@apollo/client';
import type { AppProps } from 'next/app';
import '../styles/globals.css';

import Layout from '../components/Layout';
import apolloClient from '../lib/apolloClient';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={apolloClient}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ApolloProvider>
  );
}

export default MyApp;
