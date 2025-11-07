// import React from "react";
// import { Helmet } from "react-helmet-async";

// interface SEOProps {
//   // Basic Meta
//   title: string;
//   description: string;
//   canonical?: string;
//   robots?: string;

//   // Open Graph
//   ogType?: "website" | "article";
//   ogTitle?: string;
//   ogDescription?: string;
//   ogImage?: string;
//   ogImageAlt?: string;
//   ogUrl?: string;

//   // Twitter Card
//   twitterCard?: "summary" | "summary_large_image";
//   twitterTitle?: string;
//   twitterDescription?: string;
//   twitterImage?: string;
//   twitterImageAlt?: string;

//   // Article specific
//   articlePublishedTime?: string;
//   articleModifiedTime?: string;
//   articleAuthor?: string;
//   articleSection?: string;
//   articleTags?: string[];

//   // Pagination
//   prevPage?: string;
//   nextPage?: string;

//   // Schema.org JSON-LD
//   schema?: object | object[];
// }

// export default function SEO({
//   title,
//   description,
//   canonical,
//   robots = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
//   ogType = "website",
//   ogTitle,
//   ogDescription,
//   ogImage,
//   ogImageAlt,
//   ogUrl,
//   twitterCard = "summary_large_image",
//   twitterTitle,
//   twitterDescription,
//   twitterImage,
//   twitterImageAlt,
//   articlePublishedTime,
//   articleModifiedTime,
//   articleAuthor,
//   articleSection,
//   articleTags,
//   prevPage,
//   nextPage,
//   schema,
// }: SEOProps) {
//   // Site defaults
//   const siteName = "اليوم ميديا ";
//   const siteUrl = "https://todaymedia.net/"; // Replace with your actual domain
//   const defaultImage = `${siteUrl}/assets/img/logo.webp`;
//   const twitterHandle = "@TodaymediaT"; // Replace with your Twitter handle

//   // Use provided values or fallback to defaults
//   const finalCanonical =
//     canonical ||
//     (typeof window !== "undefined" ? window.location.href : siteUrl);
//   const finalOgTitle = ogTitle || title;
//   const finalOgDescription = ogDescription || description;
//   const finalOgImage = ogImage || defaultImage;
//   const finalOgUrl = ogUrl || finalCanonical;
//   const finalTwitterTitle = twitterTitle || finalOgTitle;
//   const finalTwitterDescription = twitterDescription || finalOgDescription;
//   const finalTwitterImage = twitterImage || finalOgImage;

//   return (
//     <Helmet>
//       {/* Basic Meta Tags */}
//       <html lang="ar" dir="rtl" />
//       <title>{title}</title>
//       <meta name="description" content={description} />
//       <meta name="robots" content={robots} />

//       {/* Canonical URL */}
//       {finalCanonical && <link rel="canonical" href={finalCanonical} />}

//       {/* Language and Regional */}
//       <meta name="language" content="Arabic" />
//       <meta httpEquiv="content-language" content="ar" />

//       {/* Google News */}
//       <meta name="news_keywords" content={articleTags?.join(", ")} />

//       {/* Open Graph / Facebook */}
//       <meta property="og:type" content={ogType} />
//       <meta property="og:site_name" content={siteName} />
//       <meta property="og:title" content={finalOgTitle} />
//       <meta property="og:description" content={finalOgDescription} />
//       <meta property="og:image" content={finalOgImage} />
//       {ogImageAlt && <meta property="og:image:alt" content={ogImageAlt} />}
//       <meta property="og:image:width" content="1200" />
//       <meta property="og:image:height" content="630" />
//       <meta property="og:url" content={finalOgUrl} />
//       <meta property="og:locale" content="ar_AR" />

//       {/* Article Specific Open Graph */}
//       {ogType === "article" && (
//         <>
//           {articlePublishedTime && (
//             <meta
//               property="article:published_time"
//               content={articlePublishedTime}
//             />
//           )}
//           {articleModifiedTime && (
//             <meta
//               property="article:modified_time"
//               content={articleModifiedTime}
//             />
//           )}
//           {articleAuthor && (
//             <meta property="article:author" content={articleAuthor} />
//           )}
//           {articleSection && (
//             <meta property="article:section" content={articleSection} />
//           )}
//           {articleTags?.map((tag) => (
//             <meta key={tag} property="article:tag" content={tag} />
//           ))}
//         </>
//       )}

//       {/* Twitter Card */}
//       <meta name="twitter:card" content={twitterCard} />
//       <meta name="twitter:site" content={twitterHandle} />
//       <meta name="twitter:creator" content={twitterHandle} />
//       <meta name="twitter:title" content={finalTwitterTitle} />
//       <meta name="twitter:description" content={finalTwitterDescription} />
//       <meta name="twitter:image" content={finalTwitterImage} />
//       {twitterImageAlt && (
//         <meta name="twitter:image:alt" content={twitterImageAlt} />
//       )}

//       {/* Pagination */}
//       {prevPage && <link rel="prev" href={prevPage} />}
//       {nextPage && <link rel="next" href={nextPage} />}

//       {/* JSON-LD Schema */}
//       {schema && (
//         <script type="application/ld+json">
//           {JSON.stringify(Array.isArray(schema) ? schema : [schema])}
//         </script>
//       )}
//     </Helmet>
//   );
// }

// // Helper functions to generate common schemas

// export const generateOrganizationSchema = (
//   siteUrl: string = "https://todaymedia.net"
// ) => ({
//   "@context": "https://schema.org",
//   "@type": "Organization",
//   name: "اليوم ميديا",
//   alternateName: "Today Media",
//   url: siteUrl,
//   logo: {
//     "@type": "ImageObject",
//     url: `${siteUrl}/assets/img/logo.webp`,
//     width: 600,
//     height: 60,
//   },
//   sameAs: [
//     "https://www.facebook.com/TodaymediaT",
//     "https://x.com/TodaymediaT",
//     "https://www.instagram.com/toda.ymedia/",
//     "https://www.youtube.com/channel/UCrFx2VgF0Pw33-_dC5K8EQg",
//   ],
//   contactPoint: {
//     "@type": "ContactPoint",
//     contactType: "Customer Service",
//     email: "info@todaymedia.net",
//   },
// });

// export const generateWebsiteSchema = (
//   siteUrl: string = "https://todaymedia.net"
// ) => ({
//   "@context": "https://schema.org",
//   "@type": "WebSite",
//   name: "اليوم ميديا",
//   alternateName: "Today Media",
//   url: siteUrl,
//   description:
//     "اليوم ميديا هو موقع إلكتروني إخباري يعرض مختلف الأخبار السياسية والمنوعة.",
//   inLanguage: "ar",
//   potentialAction: {
//     "@type": "SearchAction",
//     target: {
//       "@type": "EntryPoint",
//       urlTemplate: `${siteUrl}/search?q={search_term_string}`,
//     },
//     "query-input": "required name=search_term_string",
//   },
//   publisher: generateOrganizationSchema(siteUrl),
// });

// export const generateNewsArticleSchema = ({
//   title,
//   description,
//   image,
//   datePublished,
//   dateModified,
//   authorName,
//   authorUrl,
//   category,
//   url,
//   siteUrl = "https://todaymedia.net",
// }: {
//   title: string;
//   description: string;
//   image: string;
//   datePublished: string;
//   dateModified?: string;
//   authorName: string;
//   authorUrl?: string;
//   category: string;
//   url: string;
//   siteUrl?: string;
// }) => ({
//   "@context": "https://schema.org",
//   "@type": "NewsArticle",
//   headline: title,
//   description: description,
//   image: {
//     "@type": "ImageObject",
//     url: image,
//     width: 1200,
//     height: 630,
//   },
//   datePublished: datePublished,
//   dateModified: dateModified || datePublished,
//   author: {
//     "@type": "Person",
//     name: authorName,
//     url: authorUrl || `${siteUrl}/author/${encodeURIComponent(authorName)}`,
//   },
//   publisher: generateOrganizationSchema(siteUrl),
//   articleSection: category,
//   inLanguage: "ar",
//   mainEntityOfPage: {
//     "@type": "WebPage",
//     "@id": url,
//   },
// });

// export const generateBreadcrumbSchema = (
//   items: { name: string; url: string }[]
// ) => ({
//   "@context": "https://schema.org",
//   "@type": "BreadcrumbList",
//   itemListElement: items.map((item, index) => ({
//     "@type": "ListItem",
//     position: index + 1,
//     name: item.name,
//     item: item.url,
//   })),
// });

// export const generateCollectionPageSchema = ({
//   title,
//   description,
//   url,
//   siteUrl = "https://todaymedia.net",
// }: {
//   title: string;
//   description: string;
//   url: string;
//   siteUrl?: string;
// }) => ({
//   "@context": "https://schema.org",
//   "@type": "CollectionPage",
//   name: title,
//   description: description,
//   url: url,
//   inLanguage: "ar",
//   isPartOf: {
//     "@type": "WebSite",
//     url: siteUrl,
//     name: "اليوم ميديا",
//   },
// });