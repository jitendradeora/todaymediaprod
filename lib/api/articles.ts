import apolloClient from "@/lib/client/ApolloClient";
import {
  GET_ARTICLE,
  GET_ARTICLES,
  GET_ARTICLES_BY_CATEGORY,
  GET_ARTICLES_BY_TAG,
  GET_ARTICLES_BY_AUTHOR,
  GET_ARTICLES_BY_AUTHOR_ID,
  GET_AUTHOR_POST_COUNT,
} from "@/lib/queries/article/articleQuires";
import {
  transformPostToArticle,
  transformPostsToArticles,
  WordPressPostResponse,
  WordPressPostsResponse,
} from "@/lib/transforms/articleTransform";
import { Article } from "@/types/articles";

/**
 * Fetch a single article by database ID
 */
export async function fetchArticleById(id: string | number): Promise<Article | null> {
  try {
    const { data } = await apolloClient.query<WordPressPostResponse>({
      query: GET_ARTICLE,
      variables: { id: id.toString() },
      fetchPolicy: 'network-only',
    });

    if (!data?.post) {
      return null;
    }

    return transformPostToArticle(data.post);
  } catch (error) {
    console.error("Error fetching article:", error);
    return null;
  }
}

/**
 * Fetch a single article by slug (alias for backward compatibility)
 */
export async function fetchArticleBySlug(slug: string): Promise<Article | null> {
  return fetchArticleById(slug);
}

/**
 * Fetch multiple articles with pagination
 */
export async function fetchArticles(
  first: number = 10,
  after?: string
): Promise<{
  articles: Article[];
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string | null;
  };
}> {
  try {
    const { data } = await apolloClient.query<WordPressPostsResponse>({
      query: GET_ARTICLES,
      variables: { first, after },
      fetchPolicy: 'network-only',
    });

    if (!data?.posts) {
      return {
        articles: [],
        pageInfo: { hasNextPage: false, endCursor: null },
      };
    }

    return {
      articles: transformPostsToArticles(data.posts.nodes),
      pageInfo: data.posts.pageInfo,
    };
  } catch (error) {
    console.error("Error fetching articles:", error);
    return {
      articles: [],
      pageInfo: { hasNextPage: false, endCursor: null },
    };
  }
}

/**
 * Fetch articles by category
 */
export async function fetchArticlesByCategory(
  categorySlug: string,
  first: number = 10,
  after?: string
): Promise<{
  articles: Article[];
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string | null;
  };
}> {
  try {
    // Decode the category slug in case it's URL encoded (Arabic slugs)
    const decodedSlug = decodeURIComponent(categorySlug);
    
    const { data } = await apolloClient.query<WordPressPostsResponse>({
      query: GET_ARTICLES_BY_CATEGORY,
      variables: { categorySlug: decodedSlug, first, after },
      fetchPolicy: 'network-only',
    });

    if (!data?.posts) {
      return {
        articles: [],
        pageInfo: { hasNextPage: false, endCursor: null },
      };
    }

    return {
      articles: transformPostsToArticles(data.posts.nodes),
      pageInfo: data.posts.pageInfo,
    };
  } catch (error) {
    console.error("Error fetching articles by category:", error);
    console.error("Category slug was:", categorySlug);
    return {
      articles: [],
      pageInfo: { hasNextPage: false, endCursor: null },
    };
  }
}

/**
 * Fetch articles by tag
 */
export async function fetchArticlesByTag(
  tagSlug: string,
  first: number = 10,
  after?: string
): Promise<{
  articles: Article[];
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string | null;
  };
}> {
  try {
    // Decode the tag slug in case it's URL encoded (Arabic slugs)
    const decodedSlug = decodeURIComponent(tagSlug);
    
    const { data } = await apolloClient.query<WordPressPostsResponse>({
      query: GET_ARTICLES_BY_TAG,
      variables: { tagSlug: decodedSlug, first, after },
      fetchPolicy: 'network-only',
    });

    if (!data?.posts) {
      return {
        articles: [],
        pageInfo: { hasNextPage: false, endCursor: null },
      };
    }

    return {
      articles: transformPostsToArticles(data.posts.nodes),
      pageInfo: data.posts.pageInfo,
    };
  } catch (error) {
    console.error("Error fetching articles by tag:", error);
    return {
      articles: [],
      pageInfo: { hasNextPage: false, endCursor: null },
    };
  }
}

/**
 * Fetch articles by author
 */
export async function fetchArticlesByAuthor(
  authorSlug: string,
  first: number = 10,
  after?: string
): Promise<{
  articles: Article[];
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string | null;
  };
}> {
  try {
        const { data } = await apolloClient.query<WordPressPostsResponse>({
      query: GET_ARTICLES_BY_AUTHOR,
      variables: { authorSlug, first, after },
      fetchPolicy: 'network-only',
    });

    if (!data?.posts) {
      return {
        articles: [],
        pageInfo: { hasNextPage: false, endCursor: null },
      };
    }

    return {
      articles: transformPostsToArticles(data.posts.nodes),
      pageInfo: data.posts.pageInfo,
    };
  } catch (error) {
    console.error("Error fetching articles by author:", error);
    return {
      articles: [],
      pageInfo: { hasNextPage: false, endCursor: null },
    };
  }
}

/**
 * Fetch articles by author ID
 */
export async function fetchArticlesByAuthorId(
  authorId: number,
  first: number = 10,
  after?: string
): Promise<{
  articles: Article[];
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string | null;
  };
}> {
  try {
    const { data } = await apolloClient.query<WordPressPostsResponse>({
      query: GET_ARTICLES_BY_AUTHOR_ID,
      variables: { authorId, first, after },
      fetchPolicy: 'network-only',
    });

    if (!data?.posts) {
      return {
        articles: [],
        pageInfo: { hasNextPage: false, endCursor: null },
      };
    }

    return {
      articles: transformPostsToArticles(data.posts.nodes),
      pageInfo: data.posts.pageInfo,
    };
  } catch (error) {
    console.error("Error fetching articles by author ID:", error);
    return {
      articles: [],
      pageInfo: { hasNextPage: false, endCursor: null },
    };
  }
}

/**
 * Fetch total count of articles by author ID using GraphQL query
 */
export async function fetchAuthorArticlesCount(authorId: number): Promise<number> {
  try {
    const { data } = await apolloClient.query<{
      authorPostCount: number;
    }>({
      query: GET_AUTHOR_POST_COUNT,
      variables: { authorId },
      fetchPolicy: 'network-only',
    });

    return data?.authorPostCount || 0;
  } catch (error) {
    console.error('Error fetching author articles count:', error);
    return 0;
  }
}

/**
 * Fetch all articles (for static generation)
 */
export async function fetchAllArticles(): Promise<Article[]> {
  const allArticles: Article[] = [];
  let hasNextPage = true;
  let after: string | null = null;

  while (hasNextPage) {
    const { articles, pageInfo } = await fetchArticles(100, after || undefined);
    allArticles.push(...articles);
    hasNextPage = pageInfo.hasNextPage;
    after = pageInfo.endCursor;
  }

  return allArticles;
}
