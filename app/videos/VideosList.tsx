'use client';

import { useState } from 'react';
import { VideoCard } from '@/components/shared/VideoCard';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import type { Video } from '@/lib/api/videos';

interface VideosListProps {
  initialVideos: Video[];
  hasMore: boolean;
  initialEndCursor: string | null;
}

export default function VideosList({ 
  initialVideos, 
  hasMore: initialHasMore,
  initialEndCursor 
}: VideosListProps) {
  const [videos, setVideos] = useState<Video[]>(initialVideos);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [endCursor, setEndCursor] = useState<string | null>(initialEndCursor);

  const loadMore = async () => {
    setIsLoading(true);
    try {
      const url = endCursor 
        ? `/api/videos?after=${encodeURIComponent(endCursor)}&limit=12`
        : `/api/videos?limit=12`;
        
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.videos && data.videos.length > 0) {
        // Filter out any duplicate videos based on id
        const existingIds = new Set(videos.map(v => v.id));
        const newVideos = data.videos.filter((v: Video) => !existingIds.has(v.id));
        
        if (newVideos.length > 0) {
          setVideos([...videos, ...newVideos]);
        }
        setEndCursor(data.endCursor);
        setHasMore(data.hasMore);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more videos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map((video) => (
          <VideoCard key={video.id} {...video} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-12 text-center">
          <Button
            onClick={loadMore}
            disabled={isLoading}
            size="lg"
            className="bg-[#c90000] hover:bg-[#a00000] text-white px-8"
          >
            {isLoading ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                جاري التحميل...
              </>
            ) : (
              'تحميل المزيد'
            )}
          </Button>
        </div>
      )}
    </>
  );
}
