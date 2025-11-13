import { NextResponse } from 'next/server';
import { siteConfig } from '@/lib/metadata';
import {
  fetchAllPostsForSitemap,
  fetchAllPagesForSitemap,
  fetchAllCategoriesForSitemap,
  fetchAllTagsForSitemap,
  fetchAllAuthorsForSitemap,
  fetchAllVideosForSitemap,
} from '@/lib/api/sitemap';

// Revalidate sitemap every hour
export const revalidate = 3600;

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
}

/**
 * Format date to ISO 8601 format for sitemap
 */
function formatDate(dateString: string | null | undefined): string {
  if (!dateString) {
    return new Date().toISOString();
  }
  try {
    return new Date(dateString).toISOString();
  } catch {
    return new Date().toISOString();
  }
}

/**
 * Escape XML special characters
 */
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generate sitemap XML
 */
function generateSitemapXml(urls: SitemapUrl[]): string {
  const urlEntries = urls
    .map(
      (url) => `    <url>
      <loc>${escapeXml(url.loc)}</loc>
      <lastmod>${url.lastmod}</lastmod>
      <changefreq>${url.changefreq}</changefreq>
      <priority>${url.priority}</priority>
    </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

export async function GET() {
  try {
    const siteUrl = siteConfig.url;
    const urls: SitemapUrl[] = [];

    // Add homepage
    urls.push({
      loc: siteUrl,
      lastmod: formatDate(new Date().toISOString()),
      changefreq: 'daily',
      priority: '1.0',
    });

    // Fetch all data in parallel
    const [posts, pages, categories, tags, authors, videos] = await Promise.all([
      fetchAllPostsForSitemap(),
      fetchAllPagesForSitemap(),
      fetchAllCategoriesForSitemap(),
      fetchAllTagsForSitemap(),
      fetchAllAuthorsForSitemap(),
      fetchAllVideosForSitemap(),
    ]);

    // Add pages (static pages like about, contact, privacy-policy)
    pages.forEach((page) => {
      // Skip pages that might be handled by special routes
      const specialPages = ['about', 'contact', 'privacy-policy'];
      if (!specialPages.includes(page.slug)) {
        urls.push({
          loc: `${siteUrl}/${page.slug}`,
          lastmod: formatDate(page.modified || page.date),
          changefreq: 'monthly',
          priority: '0.8',
        });
      }
    });

    // Add special static pages (these are handled by Next.js routes)
    urls.push({
      loc: `${siteUrl}/about`,
      lastmod: formatDate(new Date().toISOString()),
      changefreq: 'monthly',
      priority: '0.8',
    });

    urls.push({
      loc: `${siteUrl}/contact`,
      lastmod: formatDate(new Date().toISOString()),
      changefreq: 'monthly',
      priority: '0.8',
    });

    urls.push({
      loc: `${siteUrl}/privacy-policy`,
      lastmod: formatDate(new Date().toISOString()),
      changefreq: 'monthly',
      priority: '0.7',
    });

    urls.push({
      loc: `${siteUrl}/videos`,
      lastmod: formatDate(new Date().toISOString()),
      changefreq: 'daily',
      priority: '0.8',
    });

    urls.push({
      loc: `${siteUrl}/tags`,
      lastmod: formatDate(new Date().toISOString()),
      changefreq: 'weekly',
      priority: '0.7',
    });

    urls.push({
      loc: `${siteUrl}/search`,
      lastmod: formatDate(new Date().toISOString()),
      changefreq: 'weekly',
      priority: '0.6',
    });

    // Add posts (articles) - URL structure: /[category]/[id]
    posts.forEach((post) => {
      const categorySlug = post.categories?.nodes?.[0]?.slug || 'general';
      urls.push({
        loc: `${siteUrl}/${categorySlug}/${post.databaseId}`,
        lastmod: formatDate(post.modified || post.date),
        changefreq: 'weekly',
        priority: '0.9',
      });
    });

    // Add category pages
    categories.forEach((category) => {
      if (category.count > 0) {
        urls.push({
          loc: `${siteUrl}/category/${encodeURIComponent(category.slug)}`,
          lastmod: formatDate(new Date().toISOString()),
          changefreq: 'daily',
          priority: '0.8',
        });
      }
    });

    // Add tag pages
    tags.forEach((tag) => {
      if (tag.count > 0) {
        urls.push({
          loc: `${siteUrl}/tag/${encodeURIComponent(tag.slug)}`,
          lastmod: formatDate(new Date().toISOString()),
          changefreq: 'weekly',
          priority: '0.7',
        });
      }
    });

    // Add author pages
    authors.forEach((author) => {
      urls.push({
        loc: `${siteUrl}/author/${author.databaseId}`,
        lastmod: formatDate(new Date().toISOString()),
        changefreq: 'weekly',
        priority: '0.7',
      });
    });

    // Add video pages - URL structure: /video/[slug]
    videos.forEach((video) => {
      if (video.slug) {
        urls.push({
          loc: `${siteUrl}/video/${encodeURIComponent(video.slug)}`,
          lastmod: formatDate(video.modified || video.date),
          changefreq: 'weekly',
          priority: '0.8',
        });
      }
    });

    // Generate XML
    const sitemapXml = generateSitemapXml(urls);

    return new NextResponse(sitemapXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Return minimal sitemap on error
    const minimalSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteConfig.url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

    return new NextResponse(minimalSitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  }
}

