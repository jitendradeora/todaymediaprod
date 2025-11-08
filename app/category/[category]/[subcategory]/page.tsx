import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { fetchArticlesByCategory } from '@/lib/api/articles';
import { generateCategoryMetadata, siteConfig } from '@/lib/metadata';
import { generateCollectionPageSchema, generateBreadcrumbSchema } from '@/lib/schemas';

// Dynamically import NewsCard for better performance
const NewsCard = dynamic(() => import('@/components/NewsCard'), {
  loading: () => <div className="h-96 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />,
  ssr: true,
});

interface PageProps {
  params: Promise<{
    category: string;
    subcategory: string;
  }>;
}

// Generate static params for all subcategories
export async function generateStaticParams() {
  // Return empty array to enable dynamic rendering
  // This avoids fetching all articles at build time
  return [];
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { subcategory } = await params;
    const { articles } = await fetchArticlesByCategory(subcategory, 1);

    if (articles.length === 0) {
      return {
        title: "القسم غير موجود",
      };
    }

    const categoryName = articles[0]?.category || subcategory;
    return generateCategoryMetadata(categoryName);
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "القسم غير موجود",
    };
  }
}

export default async function SubCategoryListingPage({ params }: PageProps) {
  try {
    const { category, subcategory } = await params;
    
    
    // Fetch articles by subcategory from WordPress (12 for better performance)
    const { articles: filteredArticles } = await fetchArticlesByCategory(subcategory, 12);

    if (filteredArticles.length === 0) {
      notFound();
    }

    const subcategoryName = filteredArticles[0]?.category || subcategory;
    const categoryUrl = `${siteConfig.url}/articles/${category}`;
    const subcategoryUrl = `${siteConfig.url}/articles/${category}/${subcategory}`;
    
    // Generate breadcrumb items (parent category name from first article or use slug)
    const breadcrumbItems = [
      { name: 'الرئيسية', url: siteConfig.url },
      { name: category, url: categoryUrl },
      { name: subcategoryName, url: subcategoryUrl },
    ];

    // Generate JSON-LD schemas
    const collectionSchema = generateCollectionPageSchema(
      subcategoryName,
      `تصفح جميع أخبار ومقالات ${subcategoryName}`,
      subcategoryUrl,
      filteredArticles.map(article => ({
        title: article.title,
        url: `${siteConfig.url}/article/${article.id}`,
      }))
    );

    const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

    return (
      <div className="min-h-screen">
        {/* JSON-LD Schemas */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
        />
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
                <BreadcrumbLink href={categoryUrl}>{category}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{subcategoryName}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl mb-2">{subcategoryName}</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {(() => {
                const totalCount = filteredArticles[0]?.categoryCount ?? filteredArticles.length;
                return `${totalCount} ${totalCount === 1 ? 'مقال' : 'مقالات'}`;
              })()}
            </p>
          </div>

          {/* Articles Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <NewsCard key={article.id} {...article} />
            ))}
          </div>

          {/* Load More Button */}
          {filteredArticles.length > 0 && (
            <div className="text-center mt-12">
              <button className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                تحميل المزيد
              </button>
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