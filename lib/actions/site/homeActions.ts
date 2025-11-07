import apolloClient from '@/lib/client/ApolloClient';
import { GET_HOME_PAGE } from '@/lib/queries/site/homeQueries';
import { fetchArticlesByCategory } from '@/lib/api/articles';

export interface HomeSection {
  enableCta: boolean;
  enableExcerpt: boolean;
  sectionTitle: string | null;
  sectionTitleLink: string | null;
  sectionTitleUndelineColor: string;
  sectionColumnLayout: string | null;
  categories: string[]; // Category slugs
  categoryNames: string[]; // Category names
}

export interface VideoSectionConfig {
  sectionTitleVideos: string | null;
  sectionTitleUndelineColorVideos: string;
  ctaLabelVideos: string | null;
  ctaLinkVideos: string | null;
}

export interface HomePageData {
  sections: HomeSection[];
  heroSection: HomeSection | null;
  videoSection: VideoSectionConfig | null;
}

/**
 * Fetch home page configuration from WordPress
 */
export async function fetchHomePageConfig(): Promise<HomePageData> {
  try {
    const { data } = await apolloClient.query<{
      page: {
        homePageOptions: {
          homePageContent: Array<{
            enableCta: boolean;
            enableExcerpt: boolean;
            sectionTitle: string | null;
            sectionTitleLink: string | null;
            sectionTitleUndelineColor: string;
            sectionColumnLayout: string | null;
            selectCategory: {
              nodes: Array<{
                slug: string;
                name: string;
              }>;
            };
          }>;
          sectionTitleVideos: string | null;
          sectionTitleUndelineColorVideos: string;
          ctaLabelVideos: string | null;
          ctaLinkVideos: string | null;
        };
      };
    }>({
      query: GET_HOME_PAGE,
    });

    if (!data?.page?.homePageOptions?.homePageContent) {
      return { sections: [], heroSection: null, videoSection: null };
    }

    const content = data.page.homePageOptions.homePageContent;
    const homePageOptions = data.page.homePageOptions;
    
    // First section with "1home" category is the hero section
    const heroSection = content.find(section => 
      section.selectCategory?.nodes?.some(cat => cat.slug === '1home')
    );

    // Extract video section config from homePageOptions level
    const videoSection: VideoSectionConfig | null = {
      sectionTitleVideos: homePageOptions.sectionTitleVideos,
      sectionTitleUndelineColorVideos: homePageOptions.sectionTitleUndelineColorVideos,
      ctaLabelVideos: homePageOptions.ctaLabelVideos,
      ctaLinkVideos: homePageOptions.ctaLinkVideos,
    };

    // Other sections (excluding hero)
    const sections = content
      .filter(section => 
        !section.selectCategory?.nodes?.some(cat => cat.slug === '1home')
      )
      .map(section => ({
        enableCta: section.enableCta,
        enableExcerpt: section.enableExcerpt,
        sectionTitle: section.sectionTitle,
        sectionTitleLink: section.sectionTitleLink,
        sectionTitleUndelineColor: section.sectionTitleUndelineColor,
        sectionColumnLayout: section.sectionColumnLayout,
        categories: section.selectCategory?.nodes?.map(cat => cat.slug) || [],
        categoryNames: section.selectCategory?.nodes?.map(cat => cat.name) || [],
      }));

    return {
      sections,
      videoSection,
      heroSection: heroSection ? {
        enableCta: heroSection.enableCta,
        enableExcerpt: heroSection.enableExcerpt,
        sectionTitle: heroSection.sectionTitle,
        sectionTitleLink: heroSection.sectionTitleLink,
        sectionTitleUndelineColor: heroSection.sectionTitleUndelineColor,
        sectionColumnLayout: heroSection.sectionColumnLayout,
        categories: heroSection.selectCategory?.nodes?.map(cat => cat.slug) || [],
        categoryNames: heroSection.selectCategory?.nodes?.map(cat => cat.name) || [],
      } : null,
    };
  } catch (error) {
    console.error('Error fetching home page config:', error);
    return { sections: [], heroSection: null, videoSection: null };
  }
}

/**
 * Fetch all articles for home page sections
 */
export async function fetchHomePageArticles(config: HomePageData) {
  try {
    // Fetch hero articles (from first category or latest)
    const heroCategory = config.heroSection?.categories[0] || 'world-news';

    // Fetch articles for each section in parallel
    const sectionPromises = config.sections.map(async (section) => {
      // For sections with multiple categories, fetch from all and combine
      if (section.categories.length > 1) {
        const articlePromises = section.categories.map(cat => 
          fetchArticlesByCategory(cat, 4)
        );
        const results = await Promise.all(articlePromises);
        const allArticles = results.flatMap(r => r.articles);
        // Sort by date and limit to 8
        return allArticles
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 8);
      } else if (section.categories.length === 1) {
        // Single category
        const { articles } = await fetchArticlesByCategory(
          section.categories[0],
          section.enableExcerpt ? 4 : 8
        );
        return articles;
      } else {
        return [];
      }
    });

    const [heroArticles, ...sectionArticles] = await Promise.all([
      fetchArticlesByCategory(heroCategory, 5),
      ...sectionPromises,
    ]);

    return {
      heroArticles: heroArticles.articles,
      sectionArticles,
    };
  } catch (error) {
    console.error('Error fetching home page articles:', error);
    return {
      heroArticles: [],
      sectionArticles: [],
    };
  }
}
