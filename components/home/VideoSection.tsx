import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { VideoCard } from "@/components/shared/VideoCard";

interface Video {
  id: number;
  title: string;
  thumbnail: string;
  date: string;
  duration: string;
  views: string;
  category: string;
  slug?: string;
}

interface VideoSectionProps {
  videos: Video[];
  bgColor?: string;
  title?: string | null;
  color?: string;
  ctaLabel?: string | null;
  ctaLink?: string | null;
}

export function VideoSection({ 
  videos, 
  bgColor = "bg-muted/20",
  title = "فيديو",
  color = "#c90000",
  ctaLabel = "عرض الكل",
  ctaLink = "/video-category"
}: VideoSectionProps) {
  if (!videos || videos.length === 0) {
    return null;
  }

  return (
    <div className={`${bgColor} py-12`}>
      <section className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <Link
            href={ctaLink || "/video-category"}
            className="group flex items-center gap-2 bg-[#c90000] hover:bg-[#a00000] text-white px-5 py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg hover:scale-105"
          >
            <span className="font-medium">{ctaLabel || "عرض الكل"}</span>
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </Link>
          <h2 
            className="text-2xl pb-2 border-b-4 inline-block text-right"
            style={{ borderColor: color }}
          >
            {title || "فيديو"}
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.slice(0, 3).map((video) => (
            <VideoCard key={video.id} {...video} />
          ))}
        </div>
      </section>
    </div>
  );
}
