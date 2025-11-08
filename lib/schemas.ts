// JSON-LD Schema Generators for SEO

interface NewsArticleSchemaProps {
  title: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified: string;
  authorName: string;
  category: string;
  url: string;
  siteUrl: string;
}

export function generateNewsArticleSchema({
  title,
  description,
  image,
  datePublished,
  dateModified,
  authorName,
  category,
  url,
  siteUrl,
}: NewsArticleSchemaProps) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: title,
    description: description,
    image: image,
    datePublished: datePublished,
    dateModified: dateModified,
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'اليوم ميديا',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    articleSection: category,
    inLanguage: 'ar',
  };
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateOrganizationSchema(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'اليوم ميديا',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    sameAs: [
      'https://facebook.com/todaymedia',
      'https://twitter.com/todaymedia',
      'https://instagram.com/todaymedia',
    ],
  };
}

export function generateWebsiteSchema(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'اليوم ميديا',
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
    inLanguage: 'ar',
  };
}

export function generatePersonSchema(name: string, bio: string, siteUrl: string, authorId: number) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: name,
    description: bio,
    url: `${siteUrl}/author/${authorId}`,
  };
}

export function generateCollectionPageSchema(
  title: string,
  description: string,
  url: string,
  articles: Array<{ title: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description: description,
    url: url,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: articles.map((article, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: article.url,
        name: article.title,
      })),
    },
    inLanguage: 'ar',
  };
}

export function generateVideoObjectSchema(
  title: string,
  description: string,
  thumbnailUrl: string,
  uploadDate: string,
  duration: string,
  url: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: title,
    description: description,
    thumbnailUrl: thumbnailUrl,
    uploadDate: uploadDate,
    duration: duration,
    contentUrl: url,
    embedUrl: url,
    inLanguage: 'ar',
  };
}

export function generateFAQPageSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generateAboutPageSchema(
  title: string,
  description: string,
  url: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: title,
    description: description,
    url: url,
    inLanguage: 'ar',
  };
}

export function generateWebPageSchema(
  title: string,
  description: string,
  url: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description: description,
    url: url,
    inLanguage: 'ar',
  };
}