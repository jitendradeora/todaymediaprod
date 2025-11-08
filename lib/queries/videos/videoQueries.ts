import { gql } from '@apollo/client';

export const GET_LATEST_VIDEOS = gql`
  query Latest4Videos {
    videos(first: 4, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        databaseId
        title
        slug
        date
        videoOptions {
          videoSource
          youtubeUrl
          image
        }
        videoCategories {
          nodes {
            name
          }
        }
      }
    }
  }
`;

export const GET_VIDEOS = gql`
  query GetVideos($first: Int!, $after: String) {
    videos(first: $first, after: $after, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        databaseId
        title
        slug
        date
        videoOptions {
          videoSource
          youtubeUrl
          image
        }
        videoCategories {
          nodes {
            name
            count
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_VIDEO_BY_SLUG = gql`
  query GetVideoBySlug($slug: ID!) {
    video(id: $slug, idType: SLUG) {
      databaseId
      title
      slug
      date
      content
      videoOptions {
        videoSource
        youtubeUrl
        image
      }
      videoCategories {
        nodes {
          name
        }
      }
    }
  }
`;