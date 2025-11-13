import apolloClient from "@/lib/client/ApolloClient";
import {
  GET_ALL_POSTS_FOR_SITEMAP,
  GET_ALL_PAGES_FOR_SITEMAP,
  GET_ALL_CATEGORIES_FOR_SITEMAP,
  GET_ALL_TAGS_FOR_SITEMAP,
  GET_ALL_AUTHORS_FOR_SITEMAP,
  GET_ALL_VIDEOS_FOR_SITEMAP,
} from "@/lib/queries/site/sitemapQueries";

interface SitemapPost {
  databaseId: number;
  slug: string;
  modified: string;
  date: string;
  categories: {
    nodes: Array<{
      slug: string;
    }>;
  };
}

interface SitemapPage {
  databaseId: number;
  slug: string;
  modified: string;
  date: string;
}

interface SitemapCategory {
  slug: string;
  count: number;
}

interface SitemapTag {
  slug: string;
  count: number;
}

interface SitemapAuthor {
  databaseId: number;
  slug: string;
}

interface SitemapVideo {
  databaseId: number;
  slug: string;
  date: string;
  modified?: string | null;
}

/**
 * Fetch all posts for sitemap with pagination
 */
export async function fetchAllPostsForSitemap(): Promise<SitemapPost[]> {
  const allPosts: SitemapPost[] = [];
  let hasNextPage = true;
  let after: string | null = null;

  while (hasNextPage) {
    try {
      const { data } = await apolloClient.query<{
        posts: {
          pageInfo: {
            hasNextPage: boolean;
            endCursor: string | null;
          };
          nodes: SitemapPost[];
        };
      }>({
        query: GET_ALL_POSTS_FOR_SITEMAP,
        variables: { first: 100, after },
        fetchPolicy: 'network-only',
      });

      if (data?.posts?.nodes) {
        allPosts.push(...data.posts.nodes);
        hasNextPage = data.posts.pageInfo.hasNextPage;
        after = data.posts.pageInfo.endCursor;
      } else {
        hasNextPage = false;
      }
    } catch (error) {
      console.error("Error fetching posts for sitemap:", error);
      hasNextPage = false;
    }
  }

  return allPosts;
}

/**
 * Fetch all pages for sitemap with pagination
 */
export async function fetchAllPagesForSitemap(): Promise<SitemapPage[]> {
  const allPages: SitemapPage[] = [];
  let hasNextPage = true;
  let after: string | null = null;

  while (hasNextPage) {
    try {
      const { data } = await apolloClient.query<{
        pages: {
          pageInfo: {
            hasNextPage: boolean;
            endCursor: string | null;
          };
          nodes: SitemapPage[];
        };
      }>({
        query: GET_ALL_PAGES_FOR_SITEMAP,
        variables: { first: 100, after },
        fetchPolicy: 'network-only',
      });

      if (data?.pages?.nodes) {
        allPages.push(...data.pages.nodes);
        hasNextPage = data.pages.pageInfo.hasNextPage;
        after = data.pages.pageInfo.endCursor;
      } else {
        hasNextPage = false;
      }
    } catch (error) {
      console.error("Error fetching pages for sitemap:", error);
      hasNextPage = false;
    }
  }

  return allPages;
}

/**
 * Fetch all categories for sitemap with pagination
 */
export async function fetchAllCategoriesForSitemap(): Promise<SitemapCategory[]> {
  const allCategories: SitemapCategory[] = [];
  let hasNextPage = true;
  let after: string | null = null;

  while (hasNextPage) {
    try {
      const { data } = await apolloClient.query<{
        categories: {
          pageInfo: {
            hasNextPage: boolean;
            endCursor: string | null;
          };
          nodes: SitemapCategory[];
        };
      }>({
        query: GET_ALL_CATEGORIES_FOR_SITEMAP,
        variables: { first: 100, after },
        fetchPolicy: 'network-only',
      });

      if (data?.categories?.nodes) {
        allCategories.push(...data.categories.nodes);
        hasNextPage = data.categories.pageInfo.hasNextPage;
        after = data.categories.pageInfo.endCursor;
      } else {
        hasNextPage = false;
      }
    } catch (error) {
      console.error("Error fetching categories for sitemap:", error);
      hasNextPage = false;
    }
  }

  return allCategories;
}

/**
 * Fetch all tags for sitemap with pagination
 */
export async function fetchAllTagsForSitemap(): Promise<SitemapTag[]> {
  const allTags: SitemapTag[] = [];
  let hasNextPage = true;
  let after: string | null = null;

  while (hasNextPage) {
    try {
      const { data } = await apolloClient.query<{
        tags: {
          pageInfo: {
            hasNextPage: boolean;
            endCursor: string | null;
          };
          nodes: SitemapTag[];
        };
      }>({
        query: GET_ALL_TAGS_FOR_SITEMAP,
        variables: { first: 100, after },
        fetchPolicy: 'network-only',
      });

      if (data?.tags?.nodes) {
        allTags.push(...data.tags.nodes);
        hasNextPage = data.tags.pageInfo.hasNextPage;
        after = data.tags.pageInfo.endCursor;
      } else {
        hasNextPage = false;
      }
    } catch (error) {
      console.error("Error fetching tags for sitemap:", error);
      hasNextPage = false;
    }
  }

  return allTags;
}

/**
 * Fetch all authors for sitemap with pagination
 */
export async function fetchAllAuthorsForSitemap(): Promise<SitemapAuthor[]> {
  const allAuthors: SitemapAuthor[] = [];
  let hasNextPage = true;
  let after: string | null = null;

  while (hasNextPage) {
    try {
      const { data } = await apolloClient.query<{
        users: {
          pageInfo: {
            hasNextPage: boolean;
            endCursor: string | null;
          };
          nodes: SitemapAuthor[];
        };
      }>({
        query: GET_ALL_AUTHORS_FOR_SITEMAP,
        variables: { first: 100, after },
        fetchPolicy: 'network-only',
      });

      if (data?.users?.nodes) {
        allAuthors.push(...data.users.nodes);
        hasNextPage = data.users.pageInfo.hasNextPage;
        after = data.users.pageInfo.endCursor;
      } else {
        hasNextPage = false;
      }
    } catch (error) {
      console.error("Error fetching authors for sitemap:", error);
      hasNextPage = false;
    }
  }

  return allAuthors;
}

/**
 * Fetch all videos for sitemap with pagination
 */
export async function fetchAllVideosForSitemap(): Promise<SitemapVideo[]> {
  const allVideos: SitemapVideo[] = [];
  let hasNextPage = true;
  let after: string | null = null;

  while (hasNextPage) {
    try {
      const { data } = await apolloClient.query<{
        videos: {
          pageInfo: {
            hasNextPage: boolean;
            endCursor: string | null;
          };
          nodes: SitemapVideo[];
        };
      }>({
        query: GET_ALL_VIDEOS_FOR_SITEMAP,
        variables: { first: 100, after },
        fetchPolicy: 'network-only',
      });

      if (data?.videos?.nodes) {
        allVideos.push(...data.videos.nodes);
        hasNextPage = data.videos.pageInfo.hasNextPage;
        after = data.videos.pageInfo.endCursor;
      } else {
        hasNextPage = false;
      }
    } catch (error) {
      console.error("Error fetching videos for sitemap:", error);
      hasNextPage = false;
    }
  }

  return allVideos;
}

