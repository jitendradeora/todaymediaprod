import React from "react";
import { notFound } from "next/navigation";
import { getAboutPageData } from "@/lib/actions/about/aboutAction";
import { getIcon } from "@/lib/utils/iconMapper";
import Link from "next/link";
import { generateAboutPageSchema, generateBreadcrumbSchema } from "@/lib/schemas";
import { siteConfig } from "@/lib/metadata";

export default async function About() {
  const data = await getAboutPageData();

  if (!data?.page?.aboutUs) {
    notFound();
  }

  const aboutData = data.page.aboutUs;
  const PageIcon = getIcon(aboutData.pageIconClass);
  const VisionIcon = getIcon(aboutData.visionIconClass);
  const MissionIcon = getIcon(aboutData.iconClassMission);

  // Generate schemas for SEO
  const aboutUrl = `${siteConfig.url}/about`;
  const aboutPageSchema = generateAboutPageSchema(
    aboutData.pageTitle || 'من نحن',
    aboutData.pageDescription || 'تعرف على اليوم ميديا',
    aboutUrl
  );
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'الرئيسية', url: siteConfig.url },
    { name: aboutData.pageTitle || 'من نحن', url: aboutUrl }
  ]);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="container mx-auto px-4 py-8 max-w-[85.375rem]">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-full">
              <PageIcon className="w-12 h-12 text-[#c90000]" />
            </div>
          </div>
          <h1 className="text-4xl mb-4 text-gray-900 dark:text-white">
            {aboutData.pageTitle}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {aboutData.pageDescription}
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-right">
            <h2 className="text-2xl mb-4 text-gray-900 dark:text-white">
              {aboutData.headingAboutSection}
            </h2>
            <div 
              className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: aboutData.descriptionAboutSection }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-6xl mx-auto">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-right">
            <div className="flex justify-end mb-4">
              <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full">
                <VisionIcon className="w-8 h-8 text-[#c90000]" />
              </div>
            </div>
            <h2 className="text-2xl mb-4 text-gray-900 dark:text-white">
              {aboutData.visionHeading}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {aboutData.visionDescription}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-right">
            <div className="flex justify-end mb-4">
              <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full">
                <MissionIcon className="w-8 h-8 text-[#c90000]" />
              </div>
            </div>
            <h2 className="text-2xl mb-4 text-gray-900 dark:text-white">
              {aboutData.missonHeading}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {aboutData.missionDescription}
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mb-12">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-right">
            <h2 className="text-2xl mb-6 text-gray-900 dark:text-white text-center">
              {aboutData.ourValuesSectionHeading}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aboutData.addValues.map((value, index) => {
                const ValueIcon = getIcon(value.ourValuesIconClass);
                return (
                  <div key={index} className="text-right">
                    <div className="flex justify-end mb-3">
                      <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
                        <ValueIcon className="w-6 h-6 text-[#c90000]" />
                      </div>
                    </div>
                    <h3 className="text-xl mb-2 text-gray-900 dark:text-white">
                      {value.ourValuesHeading}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      {value.ourValuesDescription}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-right">
            <h2 className="text-2xl mb-6 text-gray-900 dark:text-white">
              {aboutData.whatWeCoverSectionHeading}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700 dark:text-gray-300">
              {aboutData.whatWeCoverContent.map((item, index) => (
                <div key={index}>
                  <h3 className="text-lg mb-2 text-gray-900 dark:text-white">
                    {item.whatWeCoverTitle}
                  </h3>
                  <p className="text-sm">
                    {item.whatWeCoverDescription}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-right">
            <h2 className="text-2xl mb-4 text-gray-900 dark:text-white">
              {aboutData.ourTeamSectionHeading}
            </h2>
            <div 
              className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: aboutData.ourTeamDescription }}
            />
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-[#c90000] to-[#a00000] p-8 rounded-lg shadow-md text-center text-white">
            <h2 className="text-2xl mb-4">
              {aboutData.ctaHeading}
            </h2>
            <p className="mb-6 leading-relaxed">
              {aboutData.ctaDescription}
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href={aboutData.ctaLink}
                className="bg-white text-[#c90000] px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors inline-block"
              >
                اتصل بنا
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
