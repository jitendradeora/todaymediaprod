"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";

interface Article {
  id: number;
  title: string;
  slug: string;
  category: string;
}

interface BreakingNewsBarProps {
  articles: Article[];
}

export function BreakingNewsBar({ articles }: BreakingNewsBarProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Memoize articles to prevent unnecessary re-renders
  const memoizedArticles = useMemo(() => articles, [articles]);

  // Auto slide to next article every 3 seconds
  useEffect(() => {
    if (!memoizedArticles || memoizedArticles.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % memoizedArticles.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [memoizedArticles]);

  if (!memoizedArticles || memoizedArticles.length === 0) return null;

  const currentArticle = memoizedArticles[currentIndex];

  return (
    <div className="bg-[#efefef] dark:bg-gray-800 text-[#0a0a0a] dark:text-white py-2 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-[#c90000] text-white text-sm shrink-0 font-bold">
            عاجل
          </span>
          <div className="flex-1 overflow-hidden">
            <Link
              href={`/${currentArticle.category}/${currentArticle.id}`}
              className="block text-sm hover:text-[#c90000] transition-all duration-500 animate-in slide-in-from-right"
              key={currentIndex}
            >
              {currentArticle.title}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
