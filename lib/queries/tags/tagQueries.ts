// lib/queries/tags/tagQueries.ts
import { gql } from "@apollo/client";

export const GET_ALL_TAGS = gql`
  query GetAllTags($first: Int = 100) {
    tags(first: $first) {
      nodes {
        id
        name
        slug
        count
        databaseId
        seoCustomOptions {
          seoTitle
          metaDescription
          ogTitle
          ogDescription
        }
      }
    }
  }
`;

export const GET_TAG_BY_SLUG = gql`
  query GetTagBySlug($slug: ID!) {
    tag(id: $slug, idType: SLUG) {
      id
      name
      slug
      count
      databaseId
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
