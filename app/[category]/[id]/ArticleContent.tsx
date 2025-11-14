"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Clock,
  User,
  Share2,
  Facebook,
  Twitter,
  Printer,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Article } from "@/types/articles";
import NewsCard from "@/components/NewsCard";

interface ArticleContentProps {
  article: Article;
  previousArticle?: Article | null;
  nextArticle?: Article | null;
  categorySlug: string;
  relatedArticles?: Article[];
}

export default function ArticleContent({ article, previousArticle, nextArticle, categorySlug, relatedArticles = [] }: ArticleContentProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [currentUrl, setCurrentUrl] = useState("");

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
    // Set current URL for sharing
    setCurrentUrl(window.location.href);
  }, []);

  // Gallery images (main image only by default)
  const galleryImages = [article.image];

  // Share handlers
  const handleFacebookShare = () => {
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
    window.open(facebookShareUrl, "_blank", "noopener,noreferrer,width=600,height=400");
  };

  const handleTwitterShare = () => {
    const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(article.title)}`;
    window.open(twitterShareUrl, "_blank", "noopener,noreferrer,width=600,height=400");
  };

  const handleWhatsAppShare = () => {
    const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(article.title + " " + currentUrl)}`;
    window.open(whatsappShareUrl, "_blank", "noopener,noreferrer");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl).then(() => {
      alert("تم نسخ الرابط!");
    }).catch(() => {
      alert("فشل نسخ الرابط");
    });
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">الرئيسية</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/category/${categorySlug}`}>
                {article.category}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>المقال</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Main Article - Full Width */}
        <article className="max-w-4xl mx-auto">
          {/* Article Header */}
          <Badge className="mb-4 bg-[#c90000]">{article.category}</Badge>
          <h1 className="text-3xl md:text-4xl mb-4 leading-tight">
            {article.title}
          </h1>

          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="text-sm">{article.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{article.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm">وقت القراءة: {article.readTime}</span>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="flex items-center gap-2 mb-6 pb-6 border-b">
            <span className="text-sm text-gray-600 ml-2 hidden md:inline">
              مشاركة:
            </span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleFacebookShare}
              title="مشاركة على فيسبوك"
              aria-label="مشاركة على فيسبوك"
            >
              <Facebook className="w-4 h-4 md:ml-2" />
              <span className="hidden md:inline">فيسبوك</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleTwitterShare}
              title="مشاركة على تويتر"
              aria-label="مشاركة على تويتر"
            >
              <Twitter className="w-4 h-4 md:ml-2" />
              <span className="hidden md:inline">تويتر</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleWhatsAppShare}
              title="مشاركة على واتساب"
              aria-label="مشاركة على واتساب"
            >
              <Share2 className="w-4 h-4 md:ml-2" />
              <span className="hidden md:inline">واتساب</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              title="طباعة المقال"
              aria-label="طباعة المقال"
            >
              <Printer className="w-4 h-4 md:ml-2" />
              <span className="hidden md:inline">طباعة</span>
            </Button>
          </div>

          {/* Featured Image */}
          <div className="mb-8">
            <ImageWithFallback
              src={article.image}
              alt={article.title}
              className="w-full h-[250px] md:h-[400px] object-cover rounded-lg"
            />
          </div>

          {/* Article Excerpt */}
          {/* <div className="bg-muted/50 border-r-4 border-[#c90000] p-4 mb-6">
            <p className="text-lg leading-relaxed">{article.excerpt}</p>
          </div> */}

          {/* Article Content */}
          <div
            className="prose prose-lg max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          <Separator className="my-8" />

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8 items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">الوسوم:</span>
              {article.tags.map((tag, index) => (
                <Link key={`${tag.slug}-${index}`} href={`/tag/${tag.slug}`}>
                  <Badge
                    variant="secondary"
                    className="hover:bg-[#c90000] hover:text-white cursor-pointer transition-colors"
                  >
                    {tag.name}
                  </Badge>
                </Link>
              ))}
              <Link
                href="/tags"
                className="text-sm text-[#c90000] hover:underline mr-2"
                prefetch={false}
              >
                عرض جميع الوسوم
              </Link>
            </div>
          )}

          {/* Author Box */}
          <Link href={`/author/${article.authorId || article.author}`} className="block">
            <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 p-4 md:p-8 rounded-lg mb-8 shadow-md hover:shadow-lg transition-all group">
              <div className="flex items-start gap-3 md:gap-6">
                <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-[#c90000] to-[#a00000] rounded-full flex items-center justify-center text-white text-xl md:text-3xl shrink-0 shadow-lg">
                  {article.author.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg md:text-xl group-hover:text-[#c90000] transition-colors">
                      {article.author}
                    </h3>
                    <Badge variant="outline" className="text-xs">
                      كاتب
                    </Badge>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-2 md:mb-3">
                    صحفي متخصص في {article.category}، يمتلك خبرة واسعة في تغطية
                    الأحداث والتطورات في هذا المجال.
                  </p>
                  <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-500 dark:text-gray-400">
                    <span>مقالات الكاتب</span>
                    <span>•</span>
                    <span className="text-[#c90000] group-hover:underline">
                      عرض المقالات ←
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Navigation */}
          {(previousArticle || nextArticle) && (
            <div className="mt-12 pt-8 border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {previousArticle && (
                  <Link
                    href={`/${previousArticle.categorySlug}/${previousArticle.id}`}
                    className="group block p-6 bg-muted/30 hover:bg-muted/50 rounded-lg transition-all"
                  >
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <ChevronRight className="w-4 h-4" />
                      <span>المقال السابق</span>
                    </div>
                    <h3 className="text-lg group-hover:text-[#c90000] transition-colors line-clamp-2">
                      {previousArticle.title}
                    </h3>
                  </Link>
                )}
                {nextArticle && (
                  <Link
                    href={`/${nextArticle.categorySlug}/${nextArticle.id}`}
                    className="group block p-6 bg-muted/30 hover:bg-muted/50 rounded-lg transition-all"
                  >
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2 justify-end">
                      <span>المقال التالي</span>
                      <ChevronLeft className="w-4 h-4" />
                    </div>
                    <h3 className="text-lg group-hover:text-[#c90000] transition-colors line-clamp-2 text-right">
                      {nextArticle.title}
                    </h3>
                  </Link>
                )}
              </div>
            </div>
          )}
        </article>

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <div className="mt-10 lg:mt-16 pt-8 border-t">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-right">
                مقالات ذات صلة
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedArticles.map((relatedArticle) => (
                  <NewsCard key={relatedArticle.id} {...relatedArticle} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
