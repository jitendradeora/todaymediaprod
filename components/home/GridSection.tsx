import { SectionHeader } from "@/components/shared/SectionHeader";
import { ArticleCard } from "@/components/shared/ArticleCard";

interface Article {
  id: number;
  title: string;
  image: string;
  date: string;
  excerpt?: string;
}

interface GridSectionProps {
  title: string;
  articles: Article[];
  color: string;
  columns?: 2 | 3 | 4;
  showExcerpt?: boolean;
  bgColor?: string;
  sectionNumber?: number;
  adBanner?: string | null;
  categoryLink?: string;
}

export function GridSection({
  title,
  articles,
  color,
  columns = 4,
  showExcerpt = false,
  bgColor = "bg-muted/20",
  sectionNumber,
  adBanner,
  categoryLink,
}: GridSectionProps) {
  if (articles.length === 0) return null;

  const gridCols = 
    columns === 2 ? "sm:grid-cols-2" :
    columns === 3 ? "md:grid-cols-3" : 
    "sm:grid-cols-2 lg:grid-cols-4";

  // Clean and convert AMP HTML to regular HTML
  const cleanAdBanner = adBanner 
    ? adBanner
        .trim()
        // Replace line breaks with spaces
        .replace(/\r\n/g, ' ')
        .replace(/\n/g, ' ')
        // Normalize whitespace
        .replace(/\s+/g, ' ')
        // Convert AMP img to regular img
        .replace(/<amp-img\s+/gi, '<img ')
        .replace(/<\/amp-img>/gi, '')
        // Remove AMP-specific attributes
        .replace(/\s+layout=["']responsive["']\s*/gi, ' ')
        .replace(/\s+layout=["']intrinsic["']\s*/gi, ' ')
        .replace(/\s+layout=["']fixed["']\s*/gi, ' ')
        // Ensure img tag is properly closed
        .replace(/<img([^>]*?)(?:\s*\/)?>/gi, (match, attrs) => {
          // Remove layout attribute if still present
          attrs = attrs.replace(/\s+layout=["'][^"']*["']/gi, '');
          // Ensure self-closing
          if (!match.endsWith('/>') && !match.endsWith('>')) {
            return `<img${attrs} />`;
          }
          return `<img${attrs} />`;
        })
    : null;

  return (
    <>
      <div className={`${bgColor} py-12 category-container`}>
        <section className="container mx-auto px-4">
          <SectionHeader title={title} color={color} href={categoryLink} />
          <div className={`grid ${gridCols} gap-6`}>
            {articles.slice(0, columns).map((article) => (
              <ArticleCard
                key={article.id}
                {...article}
                showExcerpt={showExcerpt}
              />
            ))}
          </div>
        </section>
      </div>
      {cleanAdBanner && (
        <div 
          className="container mx-auto px-4 py-4 flex justify-center"
          dangerouslySetInnerHTML={{ __html: cleanAdBanner }}
        />
      )}
    </>
  );
}
