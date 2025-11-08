import React from "react";
import { Metadata } from "next";
import { Mail, Phone, MapPin } from "lucide-react";
import { fetchContactPage } from "@/lib/api/contact";
import { notFound } from "next/navigation";
import ContactForm from "./ContactForm";
import { generateWebPageSchema, generateBreadcrumbSchema } from "@/lib/schemas";
import { siteConfig } from "@/lib/metadata";

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  const contactData = await fetchContactPage();

  const canonicalUrl = 'https://todaymedia.net/contact';

  if (!contactData) {
    return {
      title: "اتصل بنا - اليوم ميديا",
      alternates: {
        canonical: canonicalUrl,
      },
    };
  }

  // Use WordPress SEO if available
  if (contactData.seo) {
    return {
      title: contactData.seo.seoTitle || "اتصل بنا - اليوم ميديا",
      description: contactData.seo.metaDescription || contactData.sectionSubtitle,
      alternates: {
        canonical: contactData.seo.canonicalUrl || canonicalUrl,
      },
      openGraph: {
        title: contactData.seo.ogTitle || "اتصل بنا - اليوم ميديا",
        description: contactData.seo.ogDescription || contactData.sectionSubtitle,
        url: contactData.seo.canonicalUrl || canonicalUrl,
        siteName: 'اليوم ميديا',
        type: 'website',
        images: contactData.seo.ogImage?.node?.sourceUrl
          ? [{ url: contactData.seo.ogImage.node.sourceUrl }]
          : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: contactData.seo.twitterTitle || contactData.seo.ogTitle || "اتصل بنا - اليوم ميديا",
        description: contactData.seo.twitterDescription || contactData.seo.ogDescription || contactData.sectionSubtitle,
        images: contactData.seo.twitterImage?.node?.sourceUrl
          ? [contactData.seo.twitterImage.node.sourceUrl]
          : contactData.seo.ogImage?.node?.sourceUrl
          ? [contactData.seo.ogImage.node.sourceUrl]
          : undefined,
      },
    };
  }

  // Fallback to default SEO
  return {
    title: "اتصل بنا - اليوم ميديا",
    description: contactData.sectionSubtitle,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function ContactPage() {
  const contactData = await fetchContactPage();

  if (!contactData) {
    notFound();
  }

  // Generate schemas for SEO
  const contactUrl = `${siteConfig.url}/contact`;
  const webPageSchema = generateWebPageSchema(
    contactData.sectiontitle || 'اتصل بنا',
    contactData.sectionSubtitle || 'تواصل معنا في اليوم ميديا',
    contactUrl
  );
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'الرئيسية', url: siteConfig.url },
    { name: contactData.sectiontitle || 'اتصل بنا', url: contactUrl }
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
            <h1 className="text-4xl mb-4 text-gray-900 dark:text-white">
              {contactData.sectiontitle}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {contactData.sectionSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Email Card */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-right">
              <div className="flex justify-end mb-4">
                <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full">
                  <Mail className="w-6 h-6 text-[#c90000]" />
                </div>
              </div>
              <h3 className="text-xl mb-2 text-gray-900 dark:text-white">
                {contactData.emailTitle}
              </h3>
              {contactData.emails.map((email, index) => (
                <p
                  key={index}
                  className="text-gray-600 dark:text-gray-400 text-sm"
                >
                  {email.emails}
                </p>
              ))}
            </div>

            {/* Phone Card */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-right">
              <div className="flex justify-end mb-4">
                <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full">
                  <Phone className="w-6 h-6 text-[#c90000]" />
                </div>
              </div>
              <h3 className="text-xl mb-2 text-gray-900 dark:text-white">
                {contactData.phoneTitle}
              </h3>
              {contactData.phoneNumbers.map((phone, index) => (
                <p
                  key={index}
                  className="text-gray-600 dark:text-gray-400 text-sm"
                  dir="ltr"
                >
                  {phone.phoneNumber}
                </p>
              ))}
            </div>

            {/* Address Card */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-right">
              <div className="flex justify-end mb-4">
                <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full">
                  <MapPin className="w-6 h-6 text-[#c90000]" />
                </div>
              </div>
              <h3 className="text-xl mb-2 text-gray-900 dark:text-white">
                {contactData.addressTitle}
              </h3>
              <div
                className="text-gray-600 dark:text-gray-400 text-sm whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: contactData.addressText }}
              />
            </div>
          </div>

          {/* Contact Form - Client Component */}
          <ContactForm
            formId={contactData.formId}
            importantNoteTitle={contactData.importantNoteTitle}
            importantNoteDescription={contactData.importantNoteDescription}
          />
        </div>
      </main>
    </>
  );
}