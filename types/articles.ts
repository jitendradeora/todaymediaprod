export interface SEOData {
  seoTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: {
    node?: {
      sourceUrl?: string;
    };
  };
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: {
    node?: {
      sourceUrl?: string;
    };
  };
}

export interface Article {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  categorySlug: string;
  categoryCount?: number;
  date: string;
  author: string;
  authorId?: number;
  authorSlug?: string;
  readTime: string;
  tags?: Array<{
    name: string;
    slug: string;
  }>;
  seo?: SEOData;
}
