// lib/api/tags.ts
import apolloClient from "@/lib/client/ApolloClient";
import { GET_ALL_TAGS, GET_TAG_BY_SLUG } from "@/lib/queries/tags/tagQueries";
import { SEOData } from "@/types/articles";

export interface Tag {
  id: string;
  name: string;
  slug: string;
  count: number;
  databaseId: number;
  seo?: SEOData;
}

interface WordPressTagsResponse {
  tags: {
    nodes: any[];
  };
}

interface WordPressTagResponse {
  tag: any;
}

/**
 * Fetch all tags from WordPress
 */
export async function fetchAllTags(): Promise<Tag[]> {
  try {
    const { data } = await apolloClient.query<WordPressTagsResponse>({
      query: GET_ALL_TAGS,
      variables: { first: 100 },
    });

    if (!data?.tags?.nodes) {
      return [];
    }

    return data.tags.nodes.map((tag: any) => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      count: tag.count || 0,
      databaseId: tag.databaseId,
      seo: tag.seo,
    }));
  } catch (error) {
    console.error("Error fetching tags:", error);
    return [];
  }
}

/**
 * Fetch single tag with SEO data by slug
 */
export async function fetchTagBySlug(slug: string): Promise<Tag | null> {
  try {
    const { data } = await apolloClient.query<WordPressTagResponse>({
      query: GET_TAG_BY_SLUG,
      variables: { slug },
      fetchPolicy: 'network-only',
    });

    if (!data?.tag) {
      return null;
    }

    const tag = data.tag;
    return {
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      count: tag.count || 0,
      databaseId: tag.databaseId,
      seo: tag.seo,
    };
  } catch (error) {
    console.error("Error fetching tag:", error);
    return null;
  }
}
