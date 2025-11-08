import { notFound } from "next/navigation";
import { Metadata } from "next";
import { fetchVideoBySlug } from "@/lib/api/videos";
import VideoPlayer from "@/components/video/VideoPlayer";

interface VideoPageProps {
  params: {
    videoId: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: VideoPageProps): Promise<Metadata> {
  const { videoId } = await params;
  const videoSlug = decodeURIComponent(videoId);
  const video = await fetchVideoBySlug(videoSlug);
  
  if (!video) {
    return {
      title: "فيديو غير موجود - اليوم ميديا",
    };
  }

  return {
    title: `${video.title} - اليوم ميديا`,
    description: video.content || `مشاهدة فيديو ${video.title}`,
    openGraph: {
      title: video.title,
      description: video.content || `مشاهدة فيديو ${video.title}`,
      images: video.thumbnail ? [{ url: video.thumbnail }] : [],
      type: 'video.other',
    },
  };
}

export default async function VideoPage({ params }: VideoPageProps) {
  const { videoId } = await params;
  const videoSlug = decodeURIComponent(videoId);
  const video = await fetchVideoBySlug(videoSlug);

  if (!video) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-0 lg:px-4 py-0 lg:py-8 max-w-[85.375rem] ">
        <div className="max-w-5xl mx-auto">
          {/* Video Player */}
          <VideoPlayer
            videoSource={video.videoSource || 'youtube'}
            youtubeUrl={video.youtubeUrl || ''}
            thumbnail={video.thumbnail}
            title={video.title}
          />

          {/* Video Details */}
          <div className="mt-6 bg-white dark:bg-gray-800 p-6 text-right">
            <h1 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              {video.title}
            </h1>
            
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
              <span>{new Date(video.date).toLocaleDateString('ar-SA')}</span>
            </div>

            {video.content && (
              <div 
                className="prose prose-lg dark:prose-invert max-w-none text-right"
                dangerouslySetInnerHTML={{ __html: video.content }}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
