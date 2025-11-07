import dynamic from "next/dynamic";
import { fetchHomePageConfig, fetchHomePageArticles } from "@/lib/actions/site/homeActions";
import { fetchLatestVideos } from "@/lib/api/videos";

// Dynamically import heavy client components to reduce initial JS bundle
// This improves TBT (Total Blocking Time) significantly on mobile
const BreakingNewsBar = dynamic(() => import("@/components/home/BreakingNewsBar").then(mod => ({ default: mod.BreakingNewsBar })), {
  ssr: true,
});

const HeroSlider = dynamic(() => import("@/components/home/HeroSlider").then(mod => ({ default: mod.HeroSlider })), {
  ssr: true,
  loading: () => <div className="h-[600px] bg-gray-100 dark:bg-gray-800 animate-pulse rounded-2xl" />
});

const GridSection = dynamic(() => import("@/components/home/GridSection").then(mod => ({ default: mod.GridSection })), {
  ssr: true,
});

const HorizontalSection = dynamic(() => import("@/components/home/HorizontalSection").then(mod => ({ default: mod.HorizontalSection })), {
  ssr: true,
});

const OpinionsSection = dynamic(() => import("@/components/home/OpinionsSection").then(mod => ({ default: mod.OpinionsSection })), {
  ssr: true,
});

const VideoSection = dynamic(() => import("@/components/home/VideoSection").then(mod => ({ default: mod.VideoSection })), {
  ssr: true,
});

export default async function Home() {
  // Fetch home page configuration from WordPress
  const config = await fetchHomePageConfig();
  
  // Fetch latest videos from WordPress
  const videos = await fetchLatestVideos(4);
  
  // Fetch all articles based on configuration
  const { heroArticles, sectionArticles } = await fetchHomePageArticles(config);

  // Extract individual section articles
  const section1 = sectionArticles[0] || [];
  const section2 = sectionArticles[1] || [];
  const section3 = sectionArticles[2] || [];
  const section4 = sectionArticles[3] || [];
  const section5 = sectionArticles[4] || [];
  const section6 = sectionArticles[5] || [];
  const section7 = sectionArticles[6] || [];
  const section8 = sectionArticles[7] || [];
  const section9 = sectionArticles[8] || [];
  const section10 = sectionArticles[9] || [];
  const section11 = sectionArticles[10] || [];

  // Get section configurations
  const sections = config.sections;

  // Helper function to determine number of columns
  const getColumns = (layout: string | null): 2 | 3 | 4 => {
    if (!layout) return 4;
    
    // Extract number from formats like 'three-columns', 'four-columns', '3', '4'
    const layoutStr = String(layout).toLowerCase();
    if (layoutStr.includes('three') || layoutStr === '3') return 3;
    if (layoutStr.includes('four') || layoutStr === '4') return 4;
    if (layoutStr.includes('two') || layoutStr === '2') return 2;
    return 4; // Default to 4 columns
  };

  return (
    <div className="min-h-screen">
      {/* Breaking News Bar - Client Component */}
      <BreakingNewsBar 
        articles={heroArticles.slice(0, 10).map(article => ({
          id: article.id,
          title: article.title,
          slug: article.categorySlug,
          category: article.categorySlug
        }))} 
      />

      <main>
        {/* Hero Slider - Client Component */}
        <HeroSlider articles={heroArticles} />

        <div className="gridholder mx-auto px-4 py-8">
          {/* Section 1 */}
          {sections[0] && section1.length > 0 && (
            sections[0].enableCta ? (
              <OpinionsSection 
                articles={section1} 
                bgColor="bg-background"
                title={sections[0].sectionTitle || undefined}
                color={sections[0].sectionTitleUndelineColor || "#ea580c"}
              />
            ) : sections[0].enableExcerpt ? (
              <HorizontalSection
                title={sections[0].sectionTitle || ""}
                articles={section1}
                color={sections[0].sectionTitleUndelineColor || "#ea580c"}
                bgColor="bg-background"
              />
            ) : (
              <GridSection
                title={sections[0].sectionTitle || ""}
                articles={section1}
                color={sections[0].sectionTitleUndelineColor || "#ea580c"}
                columns={getColumns(sections[0].sectionColumnLayout)}
                showExcerpt={sections[0].enableExcerpt}
                bgColor="bg-background"
              />
            )
          )}

          {/* Section 2 */}
          {sections[1] && section2.length > 0 && (
            sections[1].enableCta ? (
              <OpinionsSection 
                articles={section2} 
                bgColor="bg-muted/20"
                title={sections[1].sectionTitle || undefined}
                color={sections[1].sectionTitleUndelineColor || "#ea580c"}
              />
            ) : sections[1].enableExcerpt ? (
              <HorizontalSection
                title={sections[1].sectionTitle || ""}
                articles={section2}
                color={sections[1].sectionTitleUndelineColor || "#ea580c"}
                bgColor="bg-muted/20"
              />
            ) : (
              <GridSection
                title={sections[1].sectionTitle || ""}
                articles={section2}
                color={sections[1].sectionTitleUndelineColor || "#ea580c"}
                columns={getColumns(sections[1].sectionColumnLayout)}
                showExcerpt={sections[1].enableExcerpt}
                bgColor="bg-muted/20"
              />
            )
          )}

          {/* Section 3 */}
          {sections[2] && section3.length > 0 && (
            sections[2].enableCta ? (
              <OpinionsSection 
                articles={section3} 
                bgColor="bg-background"
                title={sections[2].sectionTitle || undefined}
                color={sections[2].sectionTitleUndelineColor || "#ea580c"}
              />
            ) : (
              <GridSection
                title={sections[2].sectionTitle || ""}
                articles={section3}
                color={sections[2].sectionTitleUndelineColor || "#ea580c"}
                columns={getColumns(sections[2].sectionColumnLayout)}
                showExcerpt={sections[2].enableExcerpt}
                bgColor="bg-background"
              />
            )
          )}

          {/* Section 4 */}
          {sections[3] && section4.length > 0 && (
            sections[3].enableCta ? (
              <OpinionsSection 
                articles={section4} 
                bgColor="bg-muted/20"
                title={sections[3].sectionTitle || undefined}
                color={sections[3].sectionTitleUndelineColor || "#ea580c"}
              />
            ) : (
              <GridSection
                title={sections[3].sectionTitle || ""}
                articles={section4}
                color={sections[3].sectionTitleUndelineColor || "#ea580c"}
                columns={getColumns(sections[3].sectionColumnLayout)}
                showExcerpt={sections[3].enableExcerpt}
                bgColor="bg-muted/20"
              />
            )
          )}

          {/* Section 5 */}
          {sections[4] && section5.length > 0 && (
            sections[4].enableCta ? (
              <OpinionsSection 
                articles={section5} 
                bgColor="bg-background"
                title={sections[4].sectionTitle || undefined}
                color={sections[4].sectionTitleUndelineColor || "#ea580c"}
              />
            ) : (
              <GridSection
                title={sections[4].sectionTitle || ""}
                articles={section5}
                color={sections[4].sectionTitleUndelineColor || "#ea580c"}
                columns={getColumns(sections[4].sectionColumnLayout)}
                showExcerpt={sections[4].enableExcerpt}
                bgColor="bg-background"
              />
            )
          )}

          {/* Section 6 */}
          {sections[5] && section6.length > 0 && (
            sections[5].enableCta ? (
              <OpinionsSection 
                articles={section6} 
                bgColor="bg-muted/20"
                title={sections[5].sectionTitle || undefined}
                color={sections[5].sectionTitleUndelineColor || "#ea580c"}
              />
            )  : (
              <GridSection
                title={sections[5].sectionTitle || ""}
                articles={section6}
                color={sections[5].sectionTitleUndelineColor || "#ea580c"}
                columns={getColumns(sections[5].sectionColumnLayout)}
                showExcerpt={sections[5].enableExcerpt}
                bgColor="bg-muted/20"
              />
            )
          )}

          {/* Section 7 */}
          {sections[6] && section7.length > 0 && (
            sections[6].enableCta ? (
              <OpinionsSection 
                articles={section7} 
                bgColor="bg-background"
                title={sections[6].sectionTitle || undefined}
                color={sections[6].sectionTitleUndelineColor || "#ea580c"}
              />
            ) : (
              <GridSection
                title={sections[6].sectionTitle || ""}
                articles={section7}
                color={sections[6].sectionTitleUndelineColor || "#ea580c"}
                columns={getColumns(sections[6].sectionColumnLayout)}
                showExcerpt={sections[6].enableExcerpt}
                bgColor="bg-background"
              />
            )
          )}

          {/* Section 8 */}
          {sections[7] && section8.length > 0 && (
            sections[7].enableCta ? (
              <OpinionsSection 
                articles={section8} 
                bgColor="bg-muted/20"
                title={sections[7].sectionTitle || undefined}
                color={sections[7].sectionTitleUndelineColor || "#ea580c"}
              />
            ) : sections[7].enableExcerpt ? (
              <HorizontalSection
                title={sections[7].sectionTitle || ""}
                articles={section8}
                color={sections[7].sectionTitleUndelineColor || "#ea580c"}
                bgColor="bg-muted/20"
              />
            ) : (
              <GridSection
                title={sections[7].sectionTitle || ""}
                articles={section8}
                color={sections[7].sectionTitleUndelineColor || "#ea580c"}
                columns={getColumns(sections[7].sectionColumnLayout)}
                showExcerpt={sections[7].enableExcerpt}
                bgColor="bg-muted/20"
              />
            )
          )}

          {/* Section 9 */}
          {sections[8] && section9.length > 0 && (
              <HorizontalSection
                title={sections[8].sectionTitle || ""}
                articles={section9}
                color={sections[8].sectionTitleUndelineColor || "#ea580c"}
                bgColor="bg-background"
              />
          )}


          {/* Section 10 */}
          {sections[9] && section10.length > 0 && (
            sections[9].enableCta ? (
              <OpinionsSection 
                articles={section10} 
                bgColor="bg-muted/20"
                title={sections[9].sectionTitle || undefined}
                color={sections[9].sectionTitleUndelineColor || "#ea580c"}
              />
            ) :(
              <GridSection
                title={sections[9].sectionTitle || ""}
                articles={section10}
                color={sections[9].sectionTitleUndelineColor || "#ea580c"}
                columns={getColumns(sections[9].sectionColumnLayout)}
                showExcerpt={sections[9].enableExcerpt}
                bgColor="bg-muted/20"
              />
            )
          )}

          {/* Section 11 */}
          {sections[10] && section11.length > 0 && (
            sections[10].enableCta ? (
              <OpinionsSection 
                articles={section11} 
                bgColor="bg-background"
                title={sections[10].sectionTitle || undefined}
                color={sections[10].sectionTitleUndelineColor || "#ea580c"}
              />
            ) : (
              <GridSection
                title={sections[10].sectionTitle || ""}
                articles={section11}
                color={sections[10].sectionTitleUndelineColor || "#ea580c"}
                columns={getColumns(sections[10].sectionColumnLayout)}
                showExcerpt={sections[10].enableExcerpt}
                bgColor="bg-background"
              />
            )
          )}

          {/* Videos Section */}
          <VideoSection 
            videos={videos} 
            bgColor="bg-muted/20"
            title={config.videoSection?.sectionTitleVideos}
            color={config.videoSection?.sectionTitleUndelineColorVideos || "#c90000"}
            ctaLabel={config.videoSection?.ctaLabelVideos}
            ctaLink={config.videoSection?.ctaLinkVideos}
          />
        </div>
      </main>
    </div>
  );
}
