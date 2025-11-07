import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { fetchArticlesByCategory } from '@/lib/api/articles';
import { generateCategoryMetadata, siteConfig } from '@/lib/metadata';
import { generateCollectionPageSchema, generateBreadcrumbSchema } from '@/lib/schemas';

// Dynamically import NewsCard to reduce initial bundle
const NewsCard = dynamic(() => import('@/components/NewsCard'), {
  loading: () => <div className="h-96 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />,
  ssr: true,
});

interface PageProps {
  params: Promise<{
    category: string;
  }>;
}

// Generate static params for all categories
export async function generateStaticParams() {
  // Return empty array to enable dynamic rendering
  // This avoids fetching all articles at build time
  return [];
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { category } = await params;
    const { articles } = await fetchArticlesByCategory(category, 1);

    if (articles.length === 0) {
      return {
        title: "القسم غير موجود",
      };
    }

    const categoryName = articles[0]?.category || category;
    return generateCategoryMetadata(categoryName);
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "القسم غير موجود",
    };
  }
}

export default async function ArticleListingPage({ params }: PageProps) {
  try {
    const { category } = await params;
    
    // Fetch fewer articles initially for better performance (12 instead of 20)
    const { articles: filteredArticles } = await fetchArticlesByCategory(category, 12);

    const categoryName = filteredArticles.length > 0 
      ? filteredArticles[0]?.category 
      : decodeURIComponent(category);
    const categoryUrl = `${siteConfig.url}/articles/${category}`;
    
    // Generate breadcrumb items
    const breadcrumbItems = [
      { name: 'الرئيسية', url: siteConfig.url },
      { name: categoryName, url: categoryUrl },
    ];

    // Generate JSON-LD schemas only if we have articles
    const collectionSchema = filteredArticles.length > 0 ? generateCollectionPageSchema(
      categoryName,
      `تصفح جميع أخبار ومقالات ${categoryName}`,
      categoryUrl,
      filteredArticles.map(article => ({
        title: article.title,
        url: `${siteConfig.url}/article/${article.id}`,
      }))
    ) : null;

    const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

    return (
      <div className="min-h-screen">
        {/* JSON-LD Schemas */}
        {collectionSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
          />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">الرئيسية</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{categoryName}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl mb-2">{categoryName}</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {filteredArticles.length} {filteredArticles.length === 1 ? 'مقال' : 'مقالات'}
            </p>
          </div>

          {/* Articles Grid or Empty State */}
          {filteredArticles.length > 0 ? (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article) => (
                  <NewsCard key={article.id} {...article} />
                ))}
              </div>

              {/* Load More Button */}
              <div className="text-center mt-12">
                <button className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  تحميل المزيد
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">لا توجد مقالات في هذا القسم</p>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading category page:", error);
    notFound();
  }
}