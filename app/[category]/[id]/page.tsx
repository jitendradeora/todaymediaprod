import { Metadata } from "next";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { fetchArticleById, fetchArticlesByCategory } from '@/lib/api/articles';
import { fetchPreviewPostById } from '@/lib/api/preview';
import { generateArticleMetadata, siteConfig } from '@/lib/metadata';
import { generateNewsArticleSchema, generateBreadcrumbSchema } from '@/lib/schemas';
import { fetchArticlePageAdBanner } from '@/lib/actions/site/themeSettingsAction';
import ArticleContent from './ArticleContent';
import { Article } from '@/types/articles';

// Dynamically import PreviewBanner (client component)
const PreviewBanner = dynamic(() => import('@/components/PreviewBanner'), {
  ssr: true,
});

interface PageProps {
  params: Promise<{ 
    category: string;
    id: string;
  }>;
  searchParams: Promise<{
    preview?: string;
    token?: string;
  }>;
}

// Disable static generation (required for preview mode with searchParams)
// This makes the page server-rendered on demand
export const dynamicParams = true;

// ISR: Revalidate every 5 minutes
export const revalidate = 300;

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { category, id } = await params;
    const article = await fetchArticleById(id);

    if (!article) {
      return {
        title: "المقال غير موجود",
      };
    }

    // Generate correct canonical URL for this article
    const canonicalUrl = `${siteConfig.url}/${category}/${id}`;

    const metadata = generateArticleMetadata({
      title: article.title,
      excerpt: article.excerpt,
      image: article.image,
      author: article.author,
      category: article.category,
      publishedDate: new Date().toISOString(),
      slug: id,
      seoData: article.seo, // Pass WordPress SEO data
    });

    // Override canonical URL with the correct one
    return {
      ...metadata,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        ...metadata.openGraph,
        url: canonicalUrl,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "المقال غير موجود",
    };
  }
}

export default async function ArticleDetailsPage({ params, searchParams }: PageProps) {
  try {
    const { category, id } = await params;
    
    // Check if we're in draft/preview mode
    const { isEnabled: isDraftMode } = await draftMode();
    
    // Only get searchParams if in draft mode (to avoid static generation issues)
    let token: string | undefined;
    if (isDraftMode) {
      const resolvedSearchParams = await searchParams;
      token = resolvedSearchParams.token;
    }
    
    console.log('📄 Loading article:', { id, category, isDraftMode, hasToken: !!token });
    
    // Fetch the article (use preview API if in draft mode)
    let article: Article | null = null;
    
    if (isDraftMode) {
      console.log('👁️ Fetching preview content...');
      article = await fetchPreviewPostById(id, token);
    } else {
      article = await fetchArticleById(id);
    }

    if (!article) {
      console.error('❌ Article not found:', id);
      notFound();
    }

    // Verify the article belongs to the correct category (skip check in preview mode for drafts)
    if (!isDraftMode && article.categorySlug !== category) {
      console.error('❌ Category mismatch:', { expected: category, actual: article.categorySlug });
      notFound();
    }

    // Fetch articles from the same category to get previous/next and related articles
    const { articles: categoryArticles } = await fetchArticlesByCategory(article.categorySlug, 20);
    
    // Find current article index
    const currentIndex = categoryArticles.findIndex(a => a.id === article.id);
    const previousArticle = currentIndex > 0 ? categoryArticles[currentIndex - 1] : null;
    const nextArticle = currentIndex < categoryArticles.length - 1 ? categoryArticles[currentIndex + 1] : null;
    
    // Get related articles (exclude current article, limit to 6)
    const relatedArticles = categoryArticles
      .filter(a => a.id !== article.id)
      .slice(0, 6);

    // Generate schemas for SEO
    const articleUrl = `${siteConfig.url}/${category}/${id}`;
    const categoryUrl = `${siteConfig.url}/category/${category}`;
    
    const breadcrumbItems = [
      { name: 'الرئيسية', url: siteConfig.url },
      { name: article.category, url: categoryUrl },
      { name: article.title, url: articleUrl },
    ];

    // Generate JSON-LD schemas
    const newsArticleSchema = generateNewsArticleSchema({
      title: article.title,
      description: article.excerpt,
      image: article.image,
      datePublished: new Date().toISOString(),
      dateModified: new Date().toISOString(),
      authorName: article.author,
      category: article.category,
      url: articleUrl,
      siteUrl: siteConfig.url,
    });

    const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

    // Fetch article page ad banner
    const articlePageAdBanner = await fetchArticlePageAdBanner();

    // Clean and convert AMP HTML to regular HTML for ad banner
    const cleanAdBanner = articlePageAdBanner 
      ? articlePageAdBanner
          .trim()
          .replace(/\r\n/g, ' ')
          .replace(/\n/g, ' ')
          .replace(/\s+/g, ' ')
          .replace(/<amp-img\s+/gi, '<img ')
          .replace(/<\/amp-img>/gi, '')
          .replace(/\s+layout=["']responsive["']\s*/gi, ' ')
          .replace(/\s+layout=["']intrinsic["']\s*/gi, ' ')
          .replace(/\s+layout=["']fixed["']\s*/gi, ' ')
          .replace(/<img([^>]*?)(?:\s*\/)?>/gi, (match, attrs) => {
            attrs = attrs.replace(/\s+layout=["'][^"']*["']/gi, '');
            if (!match.endsWith('/>') && !match.endsWith('>')) {
              return `<img${attrs} />`;
            }
            return `<img${attrs} />`;
          })
      : null;

    return (
      <>
        {/* Preview Banner - Only shown in draft mode */}
        {isDraftMode && <PreviewBanner />}
        
        {/* Add spacing when preview banner is visible */}
        {isDraftMode && <div className="h-16" />}
        
        {/* JSON-LD Schema - Use generated schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticleSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        
        {/* Pass article data to client component for interactivity */}
        <ArticleContent 
          article={article}
          previousArticle={previousArticle}
          nextArticle={nextArticle}
          categorySlug={category}
          relatedArticles={relatedArticles}
        />

        {/* Article Page Ad Banner - Before Footer */}
        {cleanAdBanner && (
          <div className="container mx-auto px-4 py-8 flex justify-center">
            <div 
              dangerouslySetInnerHTML={{ __html: cleanAdBanner }}
            />
          </div>
        )}
      </>
    );
  } catch (error) {
    console.error("Error loading article:", error);
    notFound();
  }
}
