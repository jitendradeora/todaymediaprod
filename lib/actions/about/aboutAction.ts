import client from "@/lib/client/ApolloClient";
import { GET_ABOUT_PAGE } from "@/lib/queries/site/aboutQueries";
import { AboutPageData } from "@/types/about";
import { revalidatePath } from "next/cache";

/**
 * Fetch About page data from WordPress
 * Uses ISR with revalidation
 */
export async function getAboutPageData(): Promise<AboutPageData | null> {
  try {
    const { data, error } = await client.query<AboutPageData>({
      query: GET_ABOUT_PAGE,
      fetchPolicy: 'network-only',
      context: {
        fetchOptions: {
          next: { 
            revalidate: 3600, // Revalidate every hour
            tags: ['about-page', 'wordpress']
          },
        },
      },
    });

    if (error) {
      console.error("About page query error:", error);
      return null;
    }

    if (!data?.page?.aboutUs) {
      console.warn("About page data not found or invalid structure");
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error fetching about page data:", error);
    return null;
  }
}

/**
 * Revalidate the About page
 * Call this after updating content in WordPress
 */
export async function revalidateAboutPage(): Promise<void> {
  try {
    revalidatePath('/about');
    console.log('About page revalidated successfully');
  } catch (error) {
    console.error('Error revalidating about page:', error);
  }
}
