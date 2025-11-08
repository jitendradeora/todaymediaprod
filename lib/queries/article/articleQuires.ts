// lib/queries/article/articleQuires.ts
import { gql } from "@apollo/client";

export const GET_ARTICLE = gql`
  query GetArticle($id: ID!) {
    post(id: $id, idType: DATABASE_ID) {
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

export const GET_ARTICLES = gql`
  query GetArticles($first: Int = 10, $after: String) {
    posts(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
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
  }
`;

export const GET_ARTICLES_BY_CATEGORY = gql`
  query GetArticlesByCategory($categorySlug: String!, $first: Int = 10, $after: String) {
    posts(
      first: $first
      after: $after
      where: { categoryName: $categorySlug }
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
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
          }
        }
        categories {
          nodes {
            name
            slug
            count
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
  }
`;

export const GET_ARTICLES_BY_TAG = gql`
  query GetArticlesByTag($tagSlug: String!, $first: Int = 10, $after: String) {
    posts(
      first: $first
      after: $after
      where: { tag: $tagSlug }
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
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
  }
`;

export const GET_ARTICLES_BY_AUTHOR = gql`
  query GetArticlesByAuthor($authorSlug: String!, $first: Int = 10, $after: String) {
    posts(
      first: $first
      after: $after
      where: { authorName: $authorSlug }
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
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
          }
        }
        categories {
          nodes {
            name
            slug
            count
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
  }
`;

export const GET_ARTICLES_BY_AUTHOR_ID = gql`
  query GetArticlesByAuthorId($authorId: Int!, $first: Int = 10, $after: String) {
    posts(
      first: $first
      after: $after
      where: { author: $authorId }
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
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
  }
`;

export const GET_AUTHOR_POST_COUNT = gql`
  query GetAuthorPostCount($authorId: Int!) {
    authorPostCount(authorId: $authorId)
  }
`;
