import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

/**
 * Apollo Client configured for Next.js App Router with proper cache invalidation
 * 
 * Strategy:
 * - Use cache tags for all GraphQL requests
 * - revalidatePath() will clear Next.js fetch cache
 * - Apollo cache set to network-only to always fetch fresh data after revalidation
 */

const client = new ApolloClient({
  link: new HttpLink({
    uri: `${process.env.NEXT_PUBLIC_DB_URI}/graphql`,
    fetch: (uri, options) => {
      return fetch(uri, {
        ...options,
        next: { 
          revalidate: false, // Static by default
          tags: ['wordpress'], // Tag all WordPress requests
        },
      });
    },
  }),
  cache: new InMemoryCache({
    typePolicies: {
      HomeACF: {
        merge(existing, incoming, { mergeObjects }) {
          return mergeObjects(existing, incoming);
        },
      },
      AboutUsTemplate: {
        merge(existing, incoming, { mergeObjects }) {
          return mergeObjects(existing, incoming);
        },
      },
      ThemeOptions: {
        keyFields: false,
        merge(existing = {}, incoming, { mergeObjects }) {
          return mergeObjects(existing, incoming);
        },
      },
      Page: {
        merge(existing, incoming, { mergeObjects }) {
          return mergeObjects(existing, incoming);
        },
      },
    },
  }),
  // CRITICAL: Use network-only to bypass Apollo's cache
  // This ensures fresh data is fetched after Next.js cache is cleared
  defaultOptions: {
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
  },
});

export default client;
