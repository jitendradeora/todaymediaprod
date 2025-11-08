import NewsCard from '@/components/NewsCard';
import { fetchArticlesByAuthorId, fetchAuthorArticlesCount } from '@/lib/api/articles';
import { FileText } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { LoadMoreButton } from '@/components/shared/LoadMoreButton';
import { loadMoreAuthorArticles } from './actions';
import { generatePersonSchema, generateBreadcrumbSchema, generateCollectionPageSchema } from '@/lib/schemas';
import { siteConfig } from '@/lib/metadata';

interface PageProps {
  params: Promise<{ 
    id: string;
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  
  const { articles } = await fetchArticlesByAuthorId(Number(id), 1);
  const authorName = articles[0]?.author || id;
  const authorSlug = articles[0]?.authorSlug || id;
  const canonicalUrl = `https://todaymedia.net/author/${id}`;

  return {
    title: `${authorName} - اليوم ميديا`,
    description: `مقالات ${authorName} في اليوم ميديا - اقرأ جميع المقالات والتحليلات من ${authorName}`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${authorName} - اليوم ميديا`,
      description: `مقالات ${authorName} في اليوم ميديا`,
      url: canonicalUrl,
      siteName: 'اليوم ميديا',
      locale: 'ar_SA',
      type: 'profile',
    },
    twitter: {
      card: 'summary',
      title: `${authorName} - اليوم ميديا`,
      description: `مقالات ${authorName} في اليوم ميديا`,
    },
  };
}

export default async function AuthorPage({ params }: PageProps) {
  const { id } = await params;
  
  // Fetch initial 9 articles
  const { articles: authorArticles, pageInfo } = await fetchArticlesByAuthorId(Number(id), 9);
  
  if (!authorArticles || authorArticles.length === 0) {
    notFound();
  }

  // Get author info from first article
  const authorName = authorArticles[0]?.author || id;
  
  // Fetch total count of articles by this author
  const totalArticlesCount = await fetchAuthorArticlesCount(Number(id));

  // Generate schemas for SEO
  const authorUrl = `${siteConfig.url}/author/${id}`;
  const personSchema = generatePersonSchema(
    authorName,
    `كاتب في ${siteConfig.name} - ${totalArticlesCount} مقال`,
    siteConfig.url,
    Number(id)
  );
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'الرئيسية', url: siteConfig.url },
    { name: authorName, url: authorUrl }
  ]);
  const collectionSchema = generateCollectionPageSchema(
    `مقالات ${authorName}`,
    `تصفح جميع مقالات ${authorName}`,
    authorUrl,
    authorArticles.map(article => ({
      title: article.title,
      url: `${siteConfig.url}/${article.categorySlug}/${article.id}`
    }))
  );

  return (
    <div className="min-h-screen">
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <main className="container mx-auto px-4 py-8">
        {/* Author Profile */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 mb-8 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-32 h-32 bg-[#c90000] rounded-full flex items-center justify-center text-white text-5xl shrink-0">
              {authorName.charAt(0)}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl mb-2">{authorName}</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">كاتب</p>
              <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>{totalArticlesCount} {totalArticlesCount === 1 ? 'مقال' : 'مقالات'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Author Articles */}
        <div className="mb-6">
          <h2 className="text-2xl mb-4">المقالات</h2>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {authorArticles.map((article) => (
            <NewsCard key={article.id} {...article} />
          ))}
        </div>

        {/* Load More Button */}
        {pageInfo.hasNextPage && (
          <LoadMoreButton
            hasNextPage={pageInfo.hasNextPage}
            endCursor={pageInfo.endCursor}
            fetchMore={loadMoreAuthorArticles}
            categorySlug={id}
          />
        )}
      </main>
    </div>
  );
}