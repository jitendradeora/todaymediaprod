"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Article {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  author: string;
  authorId?: number;
  authorSlug?: string;
  readTime: string;
  category: string;
  categorySlug: string;
}

interface HeroSliderProps {
  articles: Article[];
}

export function HeroSlider({ articles }: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  
  // Limit to 3 slides for better performance
  const displayArticles = articles.slice(0, 3);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % displayArticles.length);
  }, [displayArticles.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + displayArticles.length) % displayArticles.length);
  }, [displayArticles.length]);

  // Handle touch/swipe gestures for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      // Swiped left (next slide in RTL)
      prevSlide();
    }
    if (touchEndX.current - touchStartX.current > 50) {
      // Swiped right (previous slide in RTL)
      nextSlide();
    }
  };

  return (
    <section className="container mx-auto px-2 lg:px-4 py-2 lg:py-8">
      <div className="relative">
        <div
          className="relative overflow-hidden rounded-xl lg:rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 shadow-xl lg:shadow-2xl min-h-[700px] lg:h-[600px] mb-4 lg:mb-0"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {displayArticles.map((article, index) => (
            <div
              key={article.id}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="grid lg:grid-cols-5 gap-0 h-full">
                {/* Text Content - 40% Left Side */}
                <div className="lg:col-span-2 p-6 lg:p-12 flex flex-col justify-center text-right relative z-10 order-2 lg:order-1 h-full overflow-hidden pb-8 lg:pb-12">
                  <div className="space-y-4 lg:space-y-6">
                    {/* Category Badge with Icon */}
                    <div className="flex items-center gap-2 justify-start">
                      <Link 
                        href={`/${article.categorySlug}/${article.id}`}
                        aria-label={`قراءة مقال ${article.title}`}
                        className="w-8 h-8 lg:w-12 lg:h-12 bg-[#c90000] rounded-full flex items-center justify-center shadow-lg hover:bg-[#a00000] transition-colors cursor-pointer"
                      >
                        <TrendingUp className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
                      </Link>
                      <Badge className="bg-[#c90000] hover:bg-[#a00000] text-white px-2 py-1 lg:px-4 lg:py-2 text-xs lg:text-sm shadow-lg">
                        {article.category}
                      </Badge>
                    </div>

                    {/* Title */}
                    <Link 
                      href={`/${article.categorySlug}/${article.id}`}
                      aria-label={`قراءة المقال: ${article.title}`}
                    >
                      <h2 className="text-2xl lg:text-3xl xl:text-4xl leading-tight text-foreground hover:text-[#c90000] transition-colors cursor-pointer line-clamp-3">
                        {article.title}
                      </h2>
                    </Link>

                    {/* Excerpt */}
                    <p className="text-muted-foreground text-base lg:text-lg leading-relaxed line-clamp-2 lg:line-clamp-3">
                      {article.excerpt}
                    </p>

                    {/* Decorative Line */}
                    <div className="w-20 h-1 bg-gradient-to-l from-[#c90000] to-[#ff4444] ml-auto"></div>

                    {/* Meta Info */}
                    <div className="flex items-center gap-3 lg:gap-4 text-xs lg:text-sm text-muted-foreground justify-start">
                      <span>{article.date}</span>
                      <span>•</span>
                      {article.authorId ? (
                        <Link 
                          href={`/author/${article.authorId}`}
                          className="hover:text-[#c90000] cursor-pointer transition-colors truncate max-w-[100px]"
                        >
                          {article.author}
                        </Link>
                      ) : (
                        <span className="hover:text-[#c90000] cursor-pointer transition-colors truncate max-w-[100px]">
                          {article.author}
                        </span>
                      )}
                      <span>•</span>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{article.readTime}</span>
                      </div>
                    </div>

                    {/* Read More Button */}
                    <Link 
                      href={`/${article.categorySlug}/${article.id}`}
                      className="bg-[#c90000] hover:bg-[#a00000] text-white px-4 lg:px-8 py-1.5 lg:py-3 rounded-lg transition-all shadow-lg hover:shadow-xl hover:scale-105 inline-flex items-center gap-1 lg:gap-2 ml-auto text-sm lg:text-base"
                      aria-label={`اقرأ المزيد عن ${article.title}`}
                    >
                      <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5" />
                      <span>اقرأ المزيد</span>
                    </Link>
                  </div>
                </div>

                {/* Image - 60% Right Side */}
                <div className="lg:col-span-3 relative overflow-hidden order-1 lg:order-2 h-full min-h-[280px] lg:min-h-[550px]">
                  {/* <Link
                    href={`/${article.categorySlug}/${article.id}`}
                    className="block h-full group"
                  > */}
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 60vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      priority={index === 0}
                      loading={index === 0 ? "eager" : "lazy"}
                      quality={index === 0 ? 90 : 75}
                      fetchPriority={index === 0 ? "high" : "low"}
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCNAFAAH//Z"
                    />
                    {/* Subtle gradient overlay for better text readability on mobile */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent lg:hidden" />

                    {/* Decorative corner element */}
                    <div className="absolute top-0 left-0 w-32 h-32 bg-[#c90000] opacity-20 rounded-br-full hidden lg:block"></div>
                    <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-[#c90000]/30 to-transparent rounded-tl-full hidden lg:block"></div>
                  {/* </Link> */}

                  {/* Slider Controls - Desktop only, positioned at bottom left of image */}
                  <div className="hidden lg:flex absolute left-6 bottom-6 gap-3 z-20">
                    <button
                      onClick={nextSlide}
                      className="w-12 h-12 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-700 rounded-full flex items-center justify-center text-foreground backdrop-blur-sm shadow-xl hover:scale-110 transition-all"
                      aria-label="Next slide"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <button
                      onClick={prevSlide}
                      className="w-12 h-12 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-700 rounded-full flex items-center justify-center text-foreground backdrop-blur-sm shadow-xl hover:scale-110 transition-all"
                      aria-label="Previous slide"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Slider Dots - Outside on mobile only */}
        <div className="flex lg:hidden justify-center gap-3 mt-6">
          {displayArticles.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all min-h-11 min-w-11 h-11 flex items-center justify-center ${
                index === currentSlide
                  ? "w-8 bg-[#c90000]"
                  : "w-3 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400"
              } rounded-full`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
