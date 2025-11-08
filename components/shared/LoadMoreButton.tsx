'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import NewsCard from '@/components/NewsCard';
import { Article } from '@/types/articles';

interface LoadMoreButtonProps {
  hasNextPage: boolean;
  endCursor: string | null;
  fetchMore: (slug: string, first: number, after?: string) => Promise<{
    articles: Article[];
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
  }>;
  categorySlug: string;
}

export function LoadMoreButton({ hasNextPage, endCursor, fetchMore, categorySlug }: LoadMoreButtonProps) {
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentEndCursor, setCurrentEndCursor] = useState(endCursor);
  const [hasMore, setHasMore] = useState(hasNextPage);

  const handleLoadMore = async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    try {
      const { articles: newArticles, pageInfo } = await fetchMore(
        categorySlug,
        9,
        currentEndCursor || undefined
      );

      setArticles((prev) => [...prev, ...newArticles]);
      setCurrentEndCursor(pageInfo.endCursor);
      setHasMore(pageInfo.hasNextPage);
    } catch (error) {
      console.error('Error loading more articles:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Show newly loaded articles */}
      {articles.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {articles.map((article) => (
            <NewsCard key={article.id} {...article} />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="bg-[#c90000] hover:bg-[#a00000] text-white px-8 py-3 rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            aria-label={loading ? "جاري التحميل" : "تحميل المزيد من المقالات"}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>جاري التحميل...</span>
              </>
            ) : (
              <span>تحميل المزيد</span>
            )}
          </button>
        </div>
      )}
    </>
  );
}
