import Home from '@/components/HomePage';
import { Metadata } from 'next';
import { fetchHomePageSEO } from '@/lib/api/home';
import { generateHomeMetadata, siteConfig } from '@/lib/metadata';
import { generateOrganizationSchema, generateWebsiteSchema, generateBreadcrumbSchema } from '@/lib/schemas';

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  try {
    const homeData = await fetchHomePageSEO();
    return generateHomeMetadata(homeData.seo);
  } catch (error) {
    console.error('Error generating home metadata:', error);
    return generateHomeMetadata();
  }
}

const page = async () => {
  // Generate JSON-LD schemas for homepage
  const organizationSchema = generateOrganizationSchema(siteConfig.url);
  const websiteSchema = generateWebsiteSchema(siteConfig.url);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'الرئيسية', url: siteConfig.url }
  ]);

  return (
    <>
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Home />
    </>
  );
};

export default page;