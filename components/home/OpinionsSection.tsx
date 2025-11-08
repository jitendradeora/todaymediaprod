import { SectionHeader } from "@/components/shared/SectionHeader";
import { ArticleCardWithAuthor } from "@/components/shared/ArticleCardWithAuthor";

interface Article {
  id: number;
  title: string;
  image: string;
  date: string;
  author: string;
}

interface OpinionsSectionProps {
  articles: Article[];
  bgColor?: string;
  title?: string;
  color?: string;
  categoryLink?: string;
}

export function OpinionsSection({
  articles,
  bgColor = "bg-muted/20",
  title = "آراء",
  color = "#f97316",
  categoryLink,
}: OpinionsSectionProps) {
  if (articles.length === 0) return null;

  return (
    <div className={`${bgColor} py-12`}>
      <section className="container mx-auto px-4">
        <SectionHeader title={title} color={color} href={categoryLink} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.slice(0, 4).map((article) => (
            <ArticleCardWithAuthor key={article.id} {...article} />
          ))}
        </div>
      </section>
    </div>
  );
}
