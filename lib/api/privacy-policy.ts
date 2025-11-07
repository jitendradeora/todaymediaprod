import apolloClient from '@/lib/client/ApolloClient';
import { gql } from '@apollo/client';
import { SEOData } from '@/types/articles';

export interface PrivacyPolicyData {
  importantNoteDescription: string;
  pageTitle: string;
  pageTitleIconClass: string;
  important_note_title: string;
  important_note_icon: string;
  thirdPartyContent: Array<{
    description: string;
    title: string;
  }>;
  policy: Array<{
    desc: string;
    icon: string;
    title: string;
  }>;
  seo?: SEOData;
}

const PRIVACY_POLICY_QUERY = gql`
  query PrivacyPolicyQuery {
    page(id: "privacy-policy", idType: URI) {
      privacyPolicy {
        importantNoteDescription
        pageTitle
        pageTitleIconClass
        important_note_title
        important_note_icon
        thirdPartyContent {
          description
          title
        }
        policy {
          desc
          icon
          title
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

export async function fetchPrivacyPolicy(): Promise<PrivacyPolicyData | null> {
  try {
    const { data } = await apolloClient.query<{
      page: {
        privacyPolicy: PrivacyPolicyData;
        seoCustomOptions?: SEOData;
      };
    }>({
      query: PRIVACY_POLICY_QUERY,
      fetchPolicy: 'network-only',
    });

    if (!data?.page?.privacyPolicy) {
      console.error('Privacy policy data not found');
      return null;
    }

    // Merge SEO data into privacy policy data
    return {
      ...data.page.privacyPolicy,
      seo: data.page.seoCustomOptions,
    };
  } catch (error) {
    console.error('Error fetching privacy policy:', error);
    return null;
  }
}
