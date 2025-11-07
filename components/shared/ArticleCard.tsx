import Link from "next/link";
import { Clock } from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

interface ArticleCardProps {
  id: number;
  title: string;
  image: string;
  date: string;
  excerpt?: string;
  category?: string;
  categorySlug?: string;
  author?: string;
  className?: string;
  showExcerpt?: boolean;
}

export function ArticleCard({
  id,
  title,
  image,
  date,
  excerpt,
  category,
  categorySlug = 'news',
  author,
  className = "",
  showExcerpt = false,
}: ArticleCardProps) {
  return (
    <Link
      href={`/${categorySlug}/${id}`}
      className={`group block h-full ${className}`}
    >
      <div className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all border border-border h-full flex flex-col">
        <ImageWithFallback
          src={image}
          alt={title}
          className="w-full h-48 lg:h-58 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="p-4 text-right flex flex-col flex-grow">
          <h3 className="mb-2 leading-snug group-hover:text-[#c90000] transition-colors line-clamp-2 font-semibold flex-grow">
            {title}
          </h3>
          {showExcerpt && excerpt && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
              {excerpt}
            </p>
          )}
          <div className="flex items-center gap-2 text-xs text-muted-foreground justify-start mt-auto">
            <Clock className="w-3 h-3" />
            <span>{date}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
