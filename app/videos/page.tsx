import { Metadata } from 'next';
import { fetchVideos, fetchTotalVideosCount } from '@/lib/api/videos';
import VideosList from './VideosList';
import { generateCollectionPageSchema, generateBreadcrumbSchema } from '@/lib/schemas';
import { siteConfig } from '@/lib/metadata';

export const metadata: Metadata = {
  title: 'جميع الفيديوهات - اليوم ميديا',
  description: 'شاهد جميع الفيديوهات على اليوم ميديا',
};

export default async function VideosPage() {
  const { videos, hasMore, endCursor } = await fetchVideos(12);
  const totalCount = await fetchTotalVideosCount();

  // Generate schemas for SEO
  const videosUrl = `${siteConfig.url}/videos`;
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'الرئيسية', url: siteConfig.url },
    { name: 'الفيديوهات', url: videosUrl }
  ]);
  const collectionSchema = videos.length > 0 ? generateCollectionPageSchema(
    'جميع الفيديوهات',
    'شاهد جميع الفيديوهات على اليوم ميديا',
    videosUrl,
    videos.map(video => ({
      title: video.title,
      url: `${siteConfig.url}/video/${video.slug || video.id}`
    }))
  ) : null;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
      <div className="container mx-auto px-4 py-8 max-w-[85.375rem]">
        {/* Page Header */}
        <div className="mb-8 text-right">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900 dark:text-white">
            جميع الفيديوهات
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {totalCount === 0 
              ? 'لا توجد فيديوهات' 
              : `${totalCount} ${totalCount === 1 ? 'فيديو متاح' : 'فيديو متاح'}`}
          </p>
        </div>

        {/* Videos List with Load More */}
        {videos.length > 0 ? (
          <VideosList 
            initialVideos={videos} 
            hasMore={hasMore}
            initialEndCursor={endCursor}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              لا توجد فيديوهات متاحة حالياً
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
