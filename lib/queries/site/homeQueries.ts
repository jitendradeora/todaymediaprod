import { gql } from '@apollo/client';

export const GET_HOME_PAGE = gql`
  query GetHomePageByID {
    page(id: "home-new", idType: URI) {
      id
      databaseId
      title
      slug
      content
      uri
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
      homePageOptions {
        homePageContent {
          enableCta
          enableExcerpt
          sectionTitle
          sectionTitleLink
          sectionTitleUndelineColor
          sectionColumnLayout
          selectCategory {
            nodes {
              slug
              name
            }
          }
        }
        sectionTitleVideos
        sectionTitleUndelineColorVideos
        ctaLabelVideos
        ctaLinkVideos
      }
    }
  }
`;
