import { Article } from "@/types/articles";

/**
 * Decode HTML entities
 */
function decodeHTMLEntities(text: string): string {
  const entities: { [key: string]: string } = {
    '&#8220;': '"',
    '&#8221;': '"',
    '&#8216;': "'",
    '&#8217;': "'",
    '&hellip;': '...',
    '&nbsp;': ' ',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#039;': "'",
  };

  // Replace named entities
  let decoded = text;
  Object.keys(entities).forEach(entity => {
    decoded = decoded.replace(new RegExp(entity, 'g'), entities[entity]);
  });

  // Replace numeric entities (&#1234;)
  decoded = decoded.replace(/&#(\d+);/g, (match, dec) => {
    return String.fromCharCode(dec);
  });

  // Replace hex entities (&#xABCD;)
  decoded = decoded.replace(/&#x([0-9A-Fa-f]+);/g, (match, hex) => {
    return String.fromCharCode(parseInt(hex, 16));
  });

  return decoded;
}

/**
 * Calculate estimated reading time based on content
 */
function calculateReadTime(content: string): string {
  // Remove HTML tags
  const text = content.replace(/<[^>]*>/g, "");
  // Average reading speed: 200 words per minute
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} دقائق`;
}

/**
 * Transform WordPress GraphQL post data to Article interface
 */
export function transformPostToArticle(post: any): Article {
  // Decode and clean excerpt
  const rawExcerpt = post.excerpt || "";
  const decodedExcerpt = decodeHTMLEntities(rawExcerpt);
  const cleanExcerpt = decodedExcerpt.replace(/<[^>]*>/g, "").trim();

  return {
    id: post.databaseId || parseInt(post.id),
    title: decodeHTMLEntities(post.title || ""),
    excerpt: cleanExcerpt,
    content: post.content || "",
    image: post.featuredImage?.node?.sourceUrl,
    category: post.categories?.nodes?.[0]?.name || "عام",
    categorySlug: post.categories?.nodes?.[0]?.slug || "general",
    categoryCount: post.categories?.nodes?.[0]?.count,
    date: formatDate(post.date),
    author: post.author?.node?.name || "اليوم ميديا",
    authorId: post.author?.node?.databaseId,
    authorSlug: post.author?.node?.slug,
    readTime: calculateReadTime(post.content || ""),
    tags: post.tags?.nodes?.map((tag: any) => ({
      name: tag.name,
      slug: tag.slug,
    })) || [],
    seo: post.seoCustomOptions ? {
      seoTitle: post.seoCustomOptions.seoTitle,
      metaDescription: post.seoCustomOptions.metaDescription,
      focusKeyword: post.seoCustomOptions.focusKeyword,
      canonicalUrl: post.seoCustomOptions.canonicalUrl,
      ogTitle: post.seoCustomOptions.ogTitle,
      ogDescription: post.seoCustomOptions.ogDescription,
      ogImage: post.seoCustomOptions.ogImage,
      twitterTitle: post.seoCustomOptions.twitterTitle,
      twitterDescription: post.seoCustomOptions.twitterDescription,
      twitterImage: post.seoCustomOptions.twitterImage,
    } : undefined,
  };
}

/**
 * Transform multiple posts to Article array
 */
export function transformPostsToArticles(posts: any[]): Article[] {
  return posts.map(transformPostToArticle);
}

/**
 * Format date to Arabic format
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("ar-SA", options);
}

/**
 * WordPress GraphQL Response Types
 */
export interface WordPressPost {
  id: string;
  databaseId: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  slug: string;
  link: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText?: string;
      mediaDetails?: {
        width: number;
        height: number;
      };
    };
  };
  categories: {
    nodes: Array<{
      name: string;
      slug: string;
      count?: number;
    }>;
  };
  author: {
    node: {
      name: string;
      slug: string;
    };
  };
}

export interface WordPressPostsResponse {
  posts: {
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
    nodes: WordPressPost[];
  };
}

export interface WordPressPostResponse {
  post: WordPressPost;
}
