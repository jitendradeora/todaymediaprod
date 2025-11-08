'use client';

import React, { useState } from 'react';
import { Play } from 'lucide-react';

interface VideoPlayerProps {
  videoSource: string;
  youtubeUrl: string;
  thumbnail: string;
  title: string;
}

export default function VideoPlayer({
  videoSource,
  youtubeUrl,
  thumbnail,
  title,
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string): string | null => {
    if (!url) return null;
    
    // Handle different YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/, // Direct video ID
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  };

  const videoId = getYouTubeVideoId(youtubeUrl);

  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  return (
    <div className="relative w-full aspect-video bg-black lg:rounded-lg overflow-hidden">
      {!isPlaying ? (
        // Thumbnail with play button
        <div className="relative w-full h-full group cursor-pointer" onClick={handlePlayClick}>
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-[#c90000] hover:bg-[#a00000] rounded-full flex items-center justify-center text-white transition-all transform group-hover:scale-110 shadow-2xl">
              <Play className="w-10 h-10 md:w-12 md:h-12 ml-1" fill="white" />
            </div>
          </div>
        </div>
      ) : (
        // Video player (YouTube iframe)
        <>
          {videoSource === 'youtube' && videoId ? (
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="flex items-center justify-center h-full text-white">
              <p>مصدر الفيديو غير متوفر</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
