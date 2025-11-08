import Link from 'next/link';
import NewsCard from '@/components/NewsCard';
import { fetchArticlesByTag } from '@/lib/api/articles';
import { fetchTagBySlug } from '@/lib/api/tags';
import { Tag } from 'lucide-react';
import type { Metadata } from 'next';
import { generateCollectionPageSchema, generateBreadcrumbSchema } from '@/lib/schemas';
import { siteConfig } from '@/lib/metadata';

interface PageProps {
  params: Promise<{
    tag: string;
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  // Try to fetch tag data with SEO from WordPress
  const tagData = await fetchTagBySlug(tag);

  const canonicalUrl = `https://todaymedia.net/tag/${tag}`;

  // Use WordPress SEO if available
  if (tagData?.seo) {
    return {
      title: tagData.seo.seoTitle || `${decodedTag} - اليوم ميديا`,
      description: tagData.seo.metaDescription || `جميع المقالات المتعلقة بوسم ${decodedTag}`,
      alternates: {
        canonical: tagData.seo.canonicalUrl || canonicalUrl,
      },
      openGraph: {
        title: tagData.seo.ogTitle || `${decodedTag} - اليوم ميديا`,
        description: tagData.seo.ogDescription || `جميع المقالات المتعلقة بوسم ${decodedTag}`,
        url: tagData.seo.canonicalUrl || canonicalUrl,
        siteName: 'اليوم ميديا',
        type: 'website',
        images: tagData.seo.ogImage?.node?.sourceUrl ? [{ url: tagData.seo.ogImage.node.sourceUrl }] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: tagData.seo.twitterTitle || tagData.seo.ogTitle || `${decodedTag} - اليوم ميديا`,
        description: tagData.seo.twitterDescription || tagData.seo.ogDescription || `جميع المقالات المتعلقة بوسم ${decodedTag}`,
        images: tagData.seo.twitterImage?.node?.sourceUrl
          ? [tagData.seo.twitterImage.node.sourceUrl]
          : tagData.seo.ogImage?.node?.sourceUrl
          ? [tagData.seo.ogImage.node.sourceUrl]
          : undefined,
      },
    };
  }

  // Fallback to default SEO
  return {
    title: `${decodedTag} - اليوم ميديا`,
    description: `جميع المقالات المتعلقة بوسم ${decodedTag}`,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function TagPage({ params }: PageProps) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  // Fetch articles by tag from WordPress
  const { articles: tagArticles, pageInfo } = await fetchArticlesByTag(tag, 12);

  // Generate schemas for SEO
  const tagUrl = `${siteConfig.url}/tag/${tag}`;
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'الرئيسية', url: siteConfig.url },
    { name: decodedTag, url: tagUrl }
  ]);
  const collectionSchema = tagArticles.length > 0 ? generateCollectionPageSchema(
    `وسم: ${decodedTag}`,
    `تصفح جميع المقالات الموسومة بـ ${decodedTag}`,
    tagUrl,
    tagArticles.map(article => ({
      title: article.title,
      url: `${siteConfig.url}/${article.categorySlug}/${article.id}`
    }))
  ) : null;

  return (
    <div className="min-h-screen">
      {/* JSON-LD Schemas */}
      {collectionSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Tag className="w-8 h-8 text-[#c90000]" />
            <h1 className="text-3xl">الوسم: {decodedTag}</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {tagArticles.length} مقال
          </p>
        </div>

        {tagArticles.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tagArticles.map((article) => (
              <NewsCard key={article.id} {...article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">لا توجد مقالات لهذا الوسم</p>
          </div>
        )}
      </main>
    </div>
  );
}
