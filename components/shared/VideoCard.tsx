import Link from "next/link";
import { Clock, Eye, Play } from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Badge } from "@/components/ui/badge";

// Helper function to calculate time ago
const getTimeAgo = (dateString: string): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'الآن';
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `منذ ${minutes} ${minutes === 1 ? 'دقيقة' : 'دقائق'}`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `منذ ${hours} ${hours === 1 ? 'ساعة' : 'ساعات'}`;
  }
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `منذ ${days} ${days === 1 ? 'يوم' : 'أيام'}`;
  }
  if (diffInSeconds < 2592000) {
    const weeks = Math.floor(diffInSeconds / 604800);
    return `منذ ${weeks} ${weeks === 1 ? 'أسبوع' : 'أسابيع'}`;
  }
  if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    return `منذ ${months} ${months === 1 ? 'شهر' : 'أشهر'}`;
  }
  const years = Math.floor(diffInSeconds / 31536000);
  return `منذ ${years} ${years === 1 ? 'سنة' : 'سنوات'}`;
};

interface VideoCardProps {
  id: number;
  title: string;
  thumbnail: string;
  date: string;
  duration: string;
  views: string;
  category: string;
  slug?: string;
  className?: string;
}

export function VideoCard({
  id,
  title,
  thumbnail,
  date,
  duration,
  views,
  category,
  slug,
  className = "",
}: VideoCardProps) {
  // Ensure slug is properly encoded for URL
  const videoUrl = slug ? `/video/${encodeURIComponent(slug)}` : "/video/video";
  
  return (
    <Link
      href={videoUrl}
      className={`group block h-full ${className}`}
    >
      <div className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all border border-border h-full flex flex-col">
        <div className="relative">
          <ImageWithFallback
            src={thumbnail}
            alt={title}
            className="w-full h-48 lg:h-58 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
            <div className="w-16 h-16 bg-[#c90000] hover:bg-[#a00000] rounded-full flex items-center justify-center text-white transition-colors">
              <Play className="w-8 h-8 ml-1" />
            </div>
          </div>
          <Badge className="absolute top-2 right-2 bg-black/70 text-white">
            {category}
          </Badge>
          <span className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {duration}
          </span>
        </div>
        <div className="p-4 text-right flex flex-col flex-grow">
          <h3 className="mb-3 leading-snug group-hover:text-[#c90000] transition-colors line-clamp-2 font-semibold flex-grow">
            {title}
          </h3>
          <div className="flex items-center gap-3 text-xs text-muted-foreground justify-start mt-auto">
            {views && (
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>{views}</span>
              </div>
            )}
            {date && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{getTimeAgo(date)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
