import React from "react";
import { Shield, Lock, Eye, FileText, AlertCircle } from "lucide-react";
import { fetchPrivacyPolicy } from "@/lib/api/privacy-policy";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { generateWebPageSchema, generateBreadcrumbSchema } from "@/lib/schemas";
import { siteConfig } from "@/lib/metadata";

// ISR: Revalidate every 24 hours (privacy policy doesn't change often)
export const revalidate = 86400;

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  const privacyData = await fetchPrivacyPolicy();
  
  const canonicalUrl = 'https://todaymedia.net/privacy-policy';
  
  if (!privacyData) {
    return {
      title: "سياسة الخصوصية - اليوم ميديا",
      alternates: {
        canonical: canonicalUrl,
      },
    };
  }

  // Use WordPress SEO if available
  if (privacyData.seo) {
    return {
      title: privacyData.seo.seoTitle || `${privacyData.pageTitle} - اليوم ميديا`,
      description: privacyData.seo.metaDescription || "سياسة الخصوصية لموقع اليوم ميديا. تعرف على كيفية جمع واستخدام وحماية معلوماتك الشخصية",
      keywords: "سياسة الخصوصية، حماية البيانات، الخصوصية، اليوم ميديا",
      alternates: {
        canonical: privacyData.seo.canonicalUrl || canonicalUrl,
      },
      openGraph: {
        title: privacyData.seo.ogTitle || `${privacyData.pageTitle} - اليوم ميديا`,
        description: privacyData.seo.ogDescription || "سياسة الخصوصية لموقع اليوم ميديا",
        url: privacyData.seo.canonicalUrl || canonicalUrl,
        siteName: 'اليوم ميديا',
        type: 'website',
        images: privacyData.seo.ogImage?.node?.sourceUrl ? [{ url: privacyData.seo.ogImage.node.sourceUrl }] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: privacyData.seo.twitterTitle || privacyData.seo.ogTitle || `${privacyData.pageTitle} - اليوم ميديا`,
        description: privacyData.seo.twitterDescription || privacyData.seo.ogDescription || "سياسة الخصوصية لموقع اليوم ميديا",
        images: privacyData.seo.twitterImage?.node?.sourceUrl
          ? [privacyData.seo.twitterImage.node.sourceUrl]
          : privacyData.seo.ogImage?.node?.sourceUrl
          ? [privacyData.seo.ogImage.node.sourceUrl]
          : undefined,
      },
    };
  }

  // Fallback to default SEO
  return {
    title: `${privacyData.pageTitle} - اليوم ميديا`,
    description: "سياسة الخصوصية لموقع اليوم ميديا. تعرف على كيفية جمع واستخدام وحماية معلوماتك الشخصية",
    keywords: "سياسة الخصوصية، حماية البيانات، الخصوصية، اليوم ميديا",
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

// Helper function to get icon component from string
const getIcon = (iconName: string) => {
  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    Shield,
    Lock,
    Eye,
    FileText,
    AlertCircle,
    lock: Lock, // lowercase fallback
  };
  return icons[iconName] || FileText;
};

export default async function PrivacyPolicyPage() {
  const privacyData = await fetchPrivacyPolicy();

  if (!privacyData) {
    notFound();
  }

  const HeaderIcon = getIcon(privacyData.pageTitleIconClass);
  const ImportantNoteIcon = getIcon(privacyData.important_note_icon);

  // Generate schemas for SEO
  const privacyUrl = `${siteConfig.url}/privacy-policy`;
  const webPageSchema = generateWebPageSchema(
    privacyData.pageTitle || 'سياسة الخصوصية',
    'سياسة الخصوصية لموقع اليوم ميديا. تعرف على كيفية جمع واستخدام وحماية معلوماتك الشخصية',
    privacyUrl
  );
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'الرئيسية', url: siteConfig.url },
    { name: privacyData.pageTitle || 'سياسة الخصوصية', url: privacyUrl }
  ]);

  return (
    <>
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8 max-w-[85.375rem]">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-full">
                <HeaderIcon className="w-12 h-12 text-[#c90000]" />
              </div>
            </div>
            <h1 className="text-4xl mb-4 text-gray-900 dark:text-white">
              {privacyData.pageTitle}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              آخر تحديث: 27 أكتوبر 2025
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Dynamic Policy Sections */}
            {privacyData.policy.map((section, index) => {
              const SectionIcon = getIcon(section.icon);
              return (
                <div key={index} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md mb-6 text-right">
                  <h2 className="text-2xl mb-4 text-gray-900 dark:text-white flex items-center justify-end gap-2">
                    <span>{section.title}</span>
                    <SectionIcon className="w-6 h-6 text-[#c90000]" />
                  </h2>
                  <div 
                    className="space-y-4 text-gray-700 dark:text-gray-300 prose prose-lg dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: section.desc }}
                  />
                </div>
              );
            })}

            {/* Third Party Content Sections */}
            {privacyData.thirdPartyContent.map((section, index) => (
              <div key={`third-party-${index}`} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md mb-6 text-right">
                <h2 className="text-2xl mb-4 text-gray-900 dark:text-white">
                  {section.title}
                </h2>
                <div 
                  className="space-y-4 text-gray-700 dark:text-gray-300 prose prose-lg dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: section.description }}
                />
              </div>
            ))}

            {/* Alert Box */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-6 rounded-lg text-right">
              <div className="flex items-start justify-end gap-3">
                <div className="flex-1">
                  <h3 className="text-lg mb-2 text-gray-900 dark:text-white">
                    {privacyData.important_note_title}
                  </h3>
                  <div 
                    className="text-sm text-gray-700 dark:text-gray-300 prose prose-sm dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: privacyData.importantNoteDescription }}
                  />
                </div>
                <ImportantNoteIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-500 flex-shrink-0" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
