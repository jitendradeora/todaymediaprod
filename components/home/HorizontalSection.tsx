import { SectionHeader } from "@/components/shared/SectionHeader";
import { HorizontalArticleCard } from "@/components/shared/HorizontalArticleCard";

interface Article {
  id: number;
  title: string;
  image: string;
  date: string;
  excerpt: string;
}

interface HorizontalSectionProps {
  title: string;
  articles: Article[];
  color: string;
  bgColor?: string;
  categoryLink?: string;
}

export function HorizontalSection({
  title,
  articles,
  color,
  bgColor = "bg-background",
  categoryLink,
}: HorizontalSectionProps) {
  if (articles.length === 0) return null;

  return (
    <div className={`${bgColor} py-12`}>
      <section className="container mx-auto px-4">
        <SectionHeader title={title} color={color} href={categoryLink} />
        <div className="grid sm:grid-cols-2 gap-6">
          {articles.slice(0, 2).map((article) => (
            <HorizontalArticleCard key={article.id} {...article} />
          ))}
        </div>
      </section>
    </div>
  );
}
