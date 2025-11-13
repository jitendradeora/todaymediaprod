import { gql } from "@apollo/client";

/**
 * GraphQL query to fetch all posts for sitemap
 * Fetches slug, modified date, and category slug for URL generation
 */
export const GET_ALL_POSTS_FOR_SITEMAP = gql`
  query GetAllPostsForSitemap($first: Int = 100, $after: String) {
    posts(first: $first, after: $after, where: { status: PUBLISH }) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        databaseId
        slug
        modified
        date
        categories {
          nodes {
            slug
          }
        }
      }
    }
  }
`;

/**
 * GraphQL query to fetch all pages for sitemap
 */
export const GET_ALL_PAGES_FOR_SITEMAP = gql`
  query GetAllPagesForSitemap($first: Int = 100, $after: String) {
    pages(first: $first, after: $after, where: { status: PUBLISH }) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        databaseId
        slug
        modified
        date
      }
    }
  }
`;

/**
 * GraphQL query to fetch all categories for sitemap
 */
export const GET_ALL_CATEGORIES_FOR_SITEMAP = gql`
  query GetAllCategoriesForSitemap($first: Int = 100, $after: String) {
    categories(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        slug
        count
      }
    }
  }
`;

/**
 * GraphQL query to fetch all tags for sitemap
 */
export const GET_ALL_TAGS_FOR_SITEMAP = gql`
  query GetAllTagsForSitemap($first: Int = 100, $after: String) {
    tags(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        slug
        count
      }
    }
  }
`;

/**
 * GraphQL query to fetch all authors for sitemap
 */
export const GET_ALL_AUTHORS_FOR_SITEMAP = gql`
  query GetAllAuthorsForSitemap($first: Int = 100, $after: String) {
    users(first: $first, after: $after, where: { hasPublishedPosts: POST }) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        databaseId
        slug
      }
    }
  }
`;

/**
 * GraphQL query to fetch all videos for sitemap
 */
export const GET_ALL_VIDEOS_FOR_SITEMAP = gql`
  query GetAllVideosForSitemap($first: Int = 100, $after: String) {
    videos(first: $first, after: $after, where: { orderby: { field: DATE, order: DESC } }) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        databaseId
        slug
        date
        modified
      }
    }
  }
`;

