'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Article } from '@/types/articles';

// Dynamically import NewsCard to reduce initial bundle
const NewsCard = dynamic(() => import('@/components/NewsCard'), {
  loading: () => <div className="h-96 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />,
  ssr: true,
});

interface CategoryArticlesListProps {
  initialArticles: Article[];
  categorySlug: string;
  hasNextPage: boolean;
  endCursor: string | null;
}

export default function CategoryArticlesList({
  initialArticles,
  categorySlug,
  hasNextPage: initialHasNextPage,
  endCursor: initialEndCursor,
}: CategoryArticlesListProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
  const [endCursor, setEndCursor] = useState(initialEndCursor);
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    if (!hasNextPage || loading || !endCursor) return;

    setLoading(true);
    try {
      const url = new URL('/api/articles/category', window.location.origin);
      url.searchParams.set('slug', categorySlug);
      if (endCursor) {
        url.searchParams.set('after', endCursor);
      }

      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error('Failed to fetch more articles');
      }

      const data = await response.json();
      
      if (data.articles && Array.isArray(data.articles)) {
        setArticles((prev) => [...prev, ...data.articles]);
        setHasNextPage(data.pageInfo?.hasNextPage ?? false);
        setEndCursor(data.pageInfo?.endCursor ?? null);
      }
    } catch (error) {
      console.error('Error loading more articles:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <NewsCard key={article.id} {...article} />
        ))}
      </div>

      {/* Load More Button */}
      {hasNextPage && (
        <div className="text-center mt-12">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={loading ? "جاري التحميل" : "تحميل المزيد من المقالات"}
          >
            {loading ? 'جاري التحميل...' : 'تحميل المزيد'}
          </button>
        </div>
      )}
    </>
  );
}
