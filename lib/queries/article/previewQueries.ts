import { gql } from "@apollo/client";

/**
 * GraphQL query to fetch a post by slug (including drafts and pending posts)
 * Used for preview functionality
 */
export const GET_POST_BY_SLUG_PREVIEW = gql`
  query GetPostBySlugPreview($id: ID!) {
    post(id: $id, idType: DATABASE_ID, asPreview: true) {
      id
      databaseId
      title
      excerpt
      content
      date
      slug
      link
      featuredImage {
        node {
          sourceUrl
          altText
          mediaDetails {
            width
            height
          }
        }
      }
      categories {
        nodes {
          name
          slug
        }
      }
      tags {
        nodes {
          name
          slug
        }
      }
      author {
        node {
          name
          slug
          databaseId
        }
      }
    }
  }
`;

/**
 * GraphQL query to fetch a post by database ID (including drafts and pending posts)
 * Used for preview functionality
 */
export const GET_POST_BY_ID_PREVIEW = gql`
  query GetPostByIdPreview($id: ID!) {
    post(id: $id, idType: DATABASE_ID, asPreview: true) {
      id
      databaseId
      title
      excerpt
      content
      date
      slug
      link
      status
      featuredImage {
        node {
          sourceUrl
          altText
          mediaDetails {
            width
            height
          }
        }
      }
      categories {
        nodes {
          name
          slug
        }
      }
      tags {
        nodes {
          name
          slug
        }
      }
      author {
        node {
          name
          slug
          databaseId
        }
      }
      seoCustomOptions {
        seoTitle
        metaDescription
        focusKeyword
        canonicalUrl
        ogTitle
        ogDescription
        ogImage {
          node {
            sourceUrl
          }
        }
        twitterTitle
        twitterDescription
        twitterImage {
          node {
            sourceUrl
          }
        }
      }
    }
  }
`;

/**
 * GraphQL query to get post by slug (simple version)
 * Returns just the database ID and basic info
 */
export const GET_POST_ID_BY_SLUG = gql`
  query GetPostIdBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      databaseId
      slug
      status
      categories {
        nodes {
          slug
        }
      }
    }
  }
`;

