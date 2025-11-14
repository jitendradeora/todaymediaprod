import { transformPostToArticle } from "@/lib/transforms/articleTransform";
import { Article } from "@/types/articles";

/**
 * Fetch a preview post by database ID using custom WordPress REST endpoint
 * This includes draft, pending, and unpublished posts
 * 
 * Note: We use a custom WordPress REST endpoint (/nextjs/v1/preview-post)
 * that validates the token and returns draft posts.
 * 
 * @param id - Post database ID
 * @param token - Optional preview token (from cookie in preview mode)
 */
export async function fetchPreviewPostById(id: string | number, token?: string): Promise<Article | null> {
  try {
    console.log('🔍 Fetching preview post by ID:', id);
    
    const wpUrl = process.env.NEXT_PUBLIC_DB_URI;
    if (!wpUrl) {
      console.error('❌ NEXT_PUBLIC_DB_URI not configured');
      return null;
    }

    // Try the custom preview endpoint if token is available
    if (token) {
      console.log('📡 Using custom preview endpoint with token');
      const previewUrl = `${wpUrl}/wp-json/nextjs/v1/preview-post?post_id=${id}&token=${encodeURIComponent(token)}`;
      
      const response = await fetch(previewUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 0 }, // Use Next.js cache option instead
      });

      if (response.ok) {
        const post = await response.json();
        console.log('✅ Preview post fetched via custom endpoint:', {
          id: post.id,
          title: post.title,
          status: post.status,
        });
        return transformCustomRestPostToArticle(post);
      } else {
        console.warn('⚠️ Custom preview endpoint failed:', response.status);
      }
    }

    // Fallback: Try standard REST API (works for published posts)
    console.log('📡 Falling back to standard REST API');
    const restUrl = `${wpUrl}/wp-json/wp/v2/posts/${id}?_embed`;
    
    const response = await fetch(restUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 0 }, // Use Next.js cache option instead
    });

    if (!response.ok) {
      console.error('❌ REST API error:', response.status, response.statusText);
      return null;
    }

    const post = await response.json();
    
    console.log('✅ Post fetched via standard REST API:', {
      id: post.id,
      title: post.title?.rendered,
      status: post.status,
    });

    return transformRestPostToArticle(post);
  } catch (error) {
    console.error("❌ Error fetching preview post by ID:", error);
    return null;
  }
}

/**
 * Transform WordPress REST API post to Article interface
 */
function transformRestPostToArticle(post: any): Article {
  // Extract category
  const categoryId = post.categories?.[0];
  const category = post._embedded?.['wp:term']?.[0]?.find((t: any) => t.id === categoryId);
  
  // Extract tags
  const tagIds = post.tags || [];
  const allTags = post._embedded?.['wp:term']?.[1] || [];
  const tags = tagIds.map((tagId: number) => {
    const tag = allTags.find((t: any) => t.id === tagId);
    return tag ? { name: tag.name, slug: tag.slug } : null;
  }).filter(Boolean);

  // Extract featured image
  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;

  // Extract author
  const author = post._embedded?.['author']?.[0];

  // Calculate read time
  const content = post.content?.rendered || '';
  const text = content.replace(/<[^>]*>/g, '');
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  const readTime = `${minutes} دقائق`;

  // Format date
  const date = new Date(post.date);
  const formattedDate = date.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Decode HTML entities in title
  const tempDiv = typeof document !== 'undefined' ? document.createElement('div') : null;
  let decodedTitle = post.title?.rendered || '';
  if (tempDiv) {
    tempDiv.innerHTML = decodedTitle;
    decodedTitle = tempDiv.textContent || decodedTitle;
  }

  // Clean excerpt
  let cleanExcerpt = post.excerpt?.rendered || '';
  cleanExcerpt = cleanExcerpt.replace(/<[^>]*>/g, '').trim();
  cleanExcerpt = cleanExcerpt
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8216;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&hellip;/g, '...')
    .replace(/&nbsp;/g, ' ');

  return {
    id: post.id,
    title: decodedTitle,
    excerpt: cleanExcerpt,
    content: content,
    image: featuredImage,
    category: category?.name || 'عام',
    categorySlug: category?.slug || 'general',
    categoryCount: category?.count,
    date: formattedDate,
    author: author?.name || 'اليوم ميديا',
    authorId: author?.id,
    authorSlug: author?.slug,
    readTime,
    tags,
    // REST API doesn't include custom SEO fields by default
    // You would need a custom REST endpoint or plugin for this
    seo: undefined,
  };
}

/**
 * Fetch a preview post by slug (fallback method)
 * This includes draft, pending, and unpublished posts
 */
export async function fetchPreviewPostBySlug(slug: string): Promise<Article | null> {
  try {
    console.log('🔍 Fetching preview post by slug via REST API:', slug);
    
    const wpUrl = process.env.NEXT_PUBLIC_DB_URI;
    if (!wpUrl) {
      console.error('❌ NEXT_PUBLIC_DB_URI not configured');
      return null;
    }

    // Fetch post by slug from WordPress REST API
    const restUrl = `${wpUrl}/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&_embed&status=any`;
    
    const response = await fetch(restUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 0 }, // Use Next.js cache option instead
    });

    if (!response.ok) {
      console.error('❌ REST API error:', response.status, response.statusText);
      return null;
    }

    const posts = await response.json();
    
    if (!posts || posts.length === 0) {
      console.warn('⚠️ Preview post not found by slug');
      return null;
    }

    const post = posts[0];
    
    console.log('✅ Preview post fetched:', {
      id: post.id,
      title: post.title?.rendered,
      status: post.status,
    });

    return transformRestPostToArticle(post);
  } catch (error) {
    console.error("❌ Error fetching preview post by slug:", error);
    return null;
  }
}

/**
 * Transform custom WordPress REST endpoint response to Article interface
 * Used for the /nextjs/v1/preview-post endpoint
 */
function transformCustomRestPostToArticle(post: any): Article {
  // Calculate read time
  const content = post.content || '';
  const text = content.replace(/<[^>]*>/g, '');
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  const readTime = `${minutes} دقائق`;

  // Format date
  const date = new Date(post.date);
  const formattedDate = date.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Get category info
  const category = post.categories?.[0];
  
  return {
    id: post.id,
    title: post.title || '',
    excerpt: post.excerpt || '',
    content: post.content || '',
    image: post.featured_image || '/assets/img/default-article.jpg',
    category: category?.name || 'عام',
    categorySlug: category?.slug || 'general',
    categoryCount: category?.count,
    date: formattedDate,
    author: post.author?.name || 'اليوم ميديا',
    authorId: post.author?.id,
    authorSlug: post.author?.slug,
    readTime,
    tags: post.tags || [],
    seo: post.seo,
  };
}

/**
 * Check if a post is in preview/draft status
 */
export function isPreviewPost(status?: string): boolean {
  return status ? ['draft', 'pending', 'future', 'private'].includes(status) : false;
}
