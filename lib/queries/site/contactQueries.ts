import { gql } from '@apollo/client';

export const GET_CONTACT_PAGE = gql`
  query GetContactPage {
    page(id: "contact", idType: URI) {
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
      contact {
        sectiontitle
        sectionSubtitle
        phoneTitle
        phoneNumbers {
          phoneNumber
        }
        addressText
        addressTitle
        emailTitle
        emails {
          emails
        }
        importantNoteTitle
        importantNoteDescription
        formId
      }
    }
  }
`;
