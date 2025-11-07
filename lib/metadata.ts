import { Metadata } from 'next';
import { SEOData } from '@/types/articles';

// Site configuration
export const siteConfig = {
  name: 'اليوم ميديا',
  url: process.env.SITE_URL || 'https://todaymedia.net',
  description: 'منصة أخبار شاملة تغطي آخر الأخبار المحلية والعالمية',
  locale: 'ar_SA',
  social: {
    facebook: 'https://facebook.com/todaymedia',
    twitter: 'https://twitter.com/todaymedia',
    instagram: 'https://instagram.com/todaymedia',
  },
};

// Base metadata
export const baseMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ['أخبار', 'الشرق الأوسط', 'سياسة', 'اقتصاد', 'رياضة', 'تكنولوجيا'],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    creator: '@todaymedia',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// Generate home page metadata
export function generateHomeMetadata(seoData?: SEOData): Metadata {
  // Use WordPress SEO data if available, otherwise use defaults
  const title = seoData?.seoTitle || 'الرئيسية';
  const description = seoData?.metaDescription || 'تابع آخر الأخبار والتطورات في الشرق الأوسط والعالم على منصة اليوم ميديا';
  const ogTitle = seoData?.ogTitle || `الرئيسية | ${siteConfig.name}`;
  const ogDescription = seoData?.ogDescription || description;
  const canonicalUrl = seoData?.canonicalUrl || siteConfig.url;
  const ogImage = seoData?.ogImage?.node?.sourceUrl;
  const twitterImage = seoData?.twitterImage?.node?.sourceUrl || ogImage;
  
  const metadata: Metadata = {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonicalUrl,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: seoData?.twitterTitle || ogTitle,
      description: seoData?.twitterDescription || ogDescription,
    },
  };

  // Add OG image if available
  if (ogImage) {
    metadata.openGraph!.images = [{ url: ogImage }];
  }
  
  // Add Twitter image if available
  if (twitterImage) {
    metadata.twitter!.images = [twitterImage];
  }

  return metadata;
}

// Generate article metadata
interface ArticleMetadataProps {
  title: string;
  excerpt: string;
  image: string;
  author: string;
  category: string;
  publishedDate: string;
  slug: string;
  seoData?: SEOData;
}

export function generateArticleMetadata({
  title,
  excerpt,
  image,
  author,
  category,
  publishedDate,
  slug,
  seoData,
}: ArticleMetadataProps): Metadata {
  const url = `${siteConfig.url}/article/${slug}`;
  
  // Use WordPress SEO data if available, otherwise use defaults
  const metaTitle = seoData?.seoTitle || title;
  const metaDescription = seoData?.metaDescription || excerpt;
  const ogTitle = seoData?.ogTitle || `${title} | ${siteConfig.name}`;
  const ogDescription = seoData?.ogDescription || excerpt;
  const canonicalUrl = seoData?.canonicalUrl || url;
  const ogImage = seoData?.ogImage?.node?.sourceUrl || image;
  const twitterImage = seoData?.twitterImage?.node?.sourceUrl || ogImage;
  
  return {
    title: metaTitle,
    description: metaDescription,
    authors: [{ name: author }],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonicalUrl,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: 'article',
      publishedTime: publishedDate,
      authors: [author],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: seoData?.twitterTitle || ogTitle,
      description: seoData?.twitterDescription || ogDescription,
      creator: '@todaymedia',
      images: [twitterImage],
    },
  };
}

// Generate category metadata
export function generateCategoryMetadata(category: string): Metadata {
  const url = `${siteConfig.url}/articles/${category}`;
  
  return {
    title: category,
    description: `تصفح جميع الأخبار المتعلقة بـ ${category} على منصة اليوم ميديا`,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${category} | ${siteConfig.name}`,
      description: `تصفح جميع الأخبار المتعلقة بـ ${category} على منصة اليوم ميديا`,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: 'website',
    },
  };
}

// Generate tag metadata
export function generateTagMetadata(tag: string): Metadata {
  const url = `${siteConfig.url}/tags/${tag}`;
  
  return {
    title: `وسم: ${tag}`,
    description: `تصفح جميع المقالات الموسومة بـ ${tag} على منصة اليوم ميديا`,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `وسم: ${tag} | ${siteConfig.name}`,
      description: `تصفح جميع المقالات الموسومة بـ ${tag} على منصة اليوم ميديا`,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: 'website',
    },
  };
}

// Generate author metadata
export function generateAuthorMetadata(authorName: string, authorId: number): Metadata {
  const url = `${siteConfig.url}/author/${authorId}`;
  
  return {
    title: `مقالات ${authorName}`,
    description: `تصفح جميع مقالات ${authorName} على منصة اليوم ميديا`,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `مقالات ${authorName} | ${siteConfig.name}`,
      description: `تصفح جميع مقالات ${authorName} على منصة اليوم ميديا`,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: 'profile',
    },
  };
}
