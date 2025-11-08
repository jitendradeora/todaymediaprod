import Link from 'next/link';
import { fetchAllTags } from '@/lib/api/tags';
import { Badge } from '@/components/ui/badge';
import { Tag } from 'lucide-react';
import type { Metadata } from 'next';
import { generateCollectionPageSchema, generateBreadcrumbSchema } from '@/lib/schemas';
import { siteConfig } from '@/lib/metadata';

export const metadata: Metadata = {
  title: 'جميع الوسوم - اليوم ميديا',
  description: 'تصفح المقالات حسب الوسوم',
};

export default async function TagsPage() {
  const tags = await fetchAllTags();

  // Generate schemas for SEO
  const tagsUrl = `${siteConfig.url}/tags`;
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'الرئيسية', url: siteConfig.url },
    { name: 'جميع الوسوم', url: tagsUrl }
  ]);
  const collectionSchema = tags.length > 0 ? generateCollectionPageSchema(
    'جميع الوسوم',
    'تصفح المقالات حسب الوسوم',
    tagsUrl,
    tags.map(tag => ({
      title: tag.name,
      url: `${siteConfig.url}/tag/${tag.slug}`
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
            <h1 className="text-3xl">جميع الوسوم</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            تصفح المقالات حسب الوسوم
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tags.map((tag) => (
            <Link
              key={tag.id}
              href={`/tag/${tag.slug}`}
              className="bg-white dark:bg-card p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-800 text-right"
            >
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary" className="text-sm">{tag.count}</Badge>
                <h3 className="text-lg">{tag.name}</h3>
              </div>
            </Link>
          ))}
        </div>

        {tags.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">لا توجد وسوم متاحة</p>
          </div>
        )}
      </main>
    </div>
  );
}
