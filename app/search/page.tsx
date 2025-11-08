'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import NewsCard from '@/components/NewsCard';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Article } from '@/types';
import { generateWebPageSchema, generateBreadcrumbSchema } from '@/lib/schemas';
import { siteConfig } from '@/lib/metadata';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(query);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSearchTerm(query);
  }, [query]);

  // Fetch articles based on search term
  useEffect(() => {
    async function performSearch() {
      if (!searchTerm) {
        setArticles([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch('/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: searchTerm }),
        });
        
        if (response.ok) {
          const data = await response.json();
          setArticles(data.articles || []);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    }

    const debounce = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchTerm]);

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl mb-6">نتائج البحث</h1>
          
          <div className="relative max-w-2xl mb-6">
            <Input
              type="text"
              placeholder="ابحث عن الأخبار..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-12 pl-4 py-3 text-lg text-right"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>

          {searchTerm && !loading && (
            <p className="text-gray-600">
              {articles.length} نتيجة للبحث عن "{searchTerm}"
            </p>
          )}

          {loading && (
            <p className="text-gray-600">جاري البحث...</p>
          )}
        </div>

        {!loading && articles.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <NewsCard key={article.id} {...article} />
            ))}
          </div>
        ) : !loading && searchTerm ? (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">لم يتم العثور على نتائج</p>
            <p className="text-gray-400">جرب البحث بكلمات مختلفة</p>
          </div>
        ) : null}
      </main>
    </div>
  );
}

export default function SearchPage() {
  // Generate schemas for SEO
  const searchUrl = `${siteConfig.url}/search`;
  const webPageSchema = generateWebPageSchema(
    'البحث',
    'ابحث عن الأخبار والمقالات على اليوم ميديا',
    searchUrl
  );
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'الرئيسية', url: siteConfig.url },
    { name: 'البحث', url: searchUrl }
  ]);

  return (
    <>
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Suspense fallback={
        <div className="min-h-screen">
          <main className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="text-3xl mb-6">نتائج البحث</h1>
              <p className="text-gray-600">جاري التحميل...</p>
            </div>
          </main>
        </div>
      }>
        <SearchContent />
      </Suspense>
    </>
  );
}
