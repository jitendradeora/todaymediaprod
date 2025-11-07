import Link from "next/link";
import { Clock } from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

interface HorizontalArticleCardProps {
  id: number;
  title: string;
  image: string;
  date: string;
  excerpt: string;
  categorySlug?: string;
  className?: string;
}

export function HorizontalArticleCard({
  id,
  title,
  image,
  date,
  excerpt,
  categorySlug = 'news',
  className = "",
}: HorizontalArticleCardProps) {
  return (
    <Link
      href={`/${categorySlug}/${id}`}
      className={`flex gap-4 bg-white dark:bg-card p-4 rounded-lg shadow-md hover:shadow-xl transition-all border border-gray-100 dark:border-border h-full ${className}`}
    >
      <ImageWithFallback
        src={image}
        alt={title}
        className="w-32 h-32 object-cover rounded shrink-0"
      />
      <div className="flex-1 text-right flex flex-col">
        <h3 className="mb-2 leading-snug hover:text-[#c90000] transition-colors font-semibold flex-grow line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
          {excerpt}
        </p>
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 justify-end mt-auto">
          <span>{date}</span>
          <Clock className="w-3 h-3" />
        </div>
      </div>
    </Link>
  );
}
