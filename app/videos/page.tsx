import { Metadata } from 'next';
import { fetchVideos } from '@/lib/api/videos';
import VideosList from './VideosList';

export const metadata: Metadata = {
  title: 'جميع الفيديوهات - اليوم ميديا',
  description: 'شاهد جميع الفيديوهات على اليوم ميديا',
};

export default async function VideosPage() {
  const { videos, hasMore, endCursor } = await fetchVideos(10);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-[85.375rem]">
        {/* Page Header */}
        <div className="mb-8 text-right">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900 dark:text-white">
            جميع الفيديوهات
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {videos.length > 0 ? `${videos.length} فيديو متاح` : 'لا توجد فيديوهات'}
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
