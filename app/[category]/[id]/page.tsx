import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from 'next/link';
import { fetchArticleById, fetchArticlesByCategory } from '@/lib/api/articles';
import { generateArticleMetadata, siteConfig } from '@/lib/metadata';
import { generateNewsArticleSchema, generateBreadcrumbSchema } from '@/lib/schemas';
import ArticleContent from './ArticleContent';
import { Article } from '@/types/articles';

interface PageProps {
  params: Promise<{ 
    category: string;
    id: string;
  }>;
}

// Enable dynamic params for better flexibility
export const dynamicParams = true;

// ISR: Revalidate every 5 minutes
export const revalidate = 300;

// Generate static params for all articles
export async function generateStaticParams() {
  // Return empty array to enable dynamic rendering
  // This avoids fetching all articles at build time
  return [];
}

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

export default async function ArticleDetailsPage({ params }: PageProps) {
  try {
    const { category, id } = await params;
    
    // Fetch the current article
    const article = await fetchArticleById(id);

    if (!article) {
      notFound();
    }

    // Verify the article belongs to the correct category
    if (article.categorySlug !== category) {
      notFound();
    }

    // Fetch articles from the same category to get previous/next (20 articles is sufficient)
    const { articles: categoryArticles } = await fetchArticlesByCategory(article.categorySlug, 20);
    
    // Find current article index
    const currentIndex = categoryArticles.findIndex(a => a.id === article.id);
    const previousArticle = currentIndex > 0 ? categoryArticles[currentIndex - 1] : null;
    const nextArticle = currentIndex < categoryArticles.length - 1 ? categoryArticles[currentIndex + 1] : null;

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

    return (
      <>
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
        />
      </>
    );
  } catch (error) {
    console.error("Error loading article:", error);
    notFound();
  }
}
