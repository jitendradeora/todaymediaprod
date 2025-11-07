import apolloClient from '@/lib/client/ApolloClient';
import { GET_HOME_PAGE } from '@/lib/queries/site/homeQueries';
import { SEOData } from '@/types/articles';

export interface HomePageSEO {
  seo?: SEOData;
}

/**
 * Fetch home page SEO data from WordPress
 */
export async function fetchHomePageSEO(): Promise<HomePageSEO> {
  try {
    const { data } = await apolloClient.query<{
      page: {
        seoCustomOptions?: SEOData;
      };
    }>({
      query: GET_HOME_PAGE,
      fetchPolicy: 'network-only',
    });

    return {
      seo: data?.page?.seoCustomOptions,
    };
  } catch (error) {
    console.error('Error fetching home page SEO:', error);
    return {};
  }
}
