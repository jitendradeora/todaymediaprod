import { gql } from '@apollo/client';
import apolloClient from '@/lib/client/ApolloClient';
import { transformPostsToArticles } from '@/lib/transforms/articleTransform';
import { Article } from '@/types';

export const getBlogsSearch = (query: string) => gql`
  query SearchPosts {
    posts(first: 8, where: { search: "${query}" }) {
      nodes {
        databaseId
        date
        title
        slug
        excerpt
        content
        featuredImage {
          node {
            altText
            sourceUrl
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
        author {
          node {
            name
          }
        }
      }
      pageInfo {
        startCursor
        hasPreviousPage
        hasNextPage
        endCursor
      }
    }
  }
`;

interface SearchResult {
  articles: Article[];
  pageInfo: {
    startCursor: string;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    endCursor: string;
  };
}

/**
 * Search for articles in WordPress using GraphQL
 * @param query - The search query string
 * @returns Object containing articles array and pagination info
 */
export async function searchArticles(query: string): Promise<SearchResult> {
  if (!query || query.trim() === '') {
    return {
      articles: [],
      pageInfo: {
        startCursor: '',
        hasPreviousPage: false,
        hasNextPage: false,
        endCursor: '',
      },
    };
  }

  try {
    const { data } = await apolloClient.query<{
      posts: {
        nodes: any[];
        pageInfo: {
          startCursor: string;
          hasPreviousPage: boolean;
          hasNextPage: boolean;
          endCursor: string;
        };
      };
    }>({
      query: getBlogsSearch(query),
    });

    if (!data || !data.posts) {
      return {
        articles: [],
        pageInfo: {
          startCursor: '',
          hasPreviousPage: false,
          hasNextPage: false,
          endCursor: '',
        },
      };
    }

    const articles = transformPostsToArticles(data.posts.nodes);

    return {
      articles,
      pageInfo: data.posts.pageInfo,
    };
  } catch (error) {
    console.error('Search articles error:', error);
    return {
      articles: [],
      pageInfo: {
        startCursor: '',
        hasPreviousPage: false,
        hasNextPage: false,
        endCursor: '',
      },
    };
  }
}
