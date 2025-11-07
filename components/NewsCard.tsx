import { Clock } from "lucide-react";
import { Badge } from "./ui/badge";
import Image from "next/image";
import Link from "next/link";

interface Article {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  categorySlug: string;
  date: string;
  readTime: string;
}

export default function NewsCard(article: Article) {
  return (
    <Link href={`/${article.categorySlug}/${article.id}`} className="group block h-full">
      <div className="bg-white dark:bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all h-full flex flex-col">
        <div className="relative w-full h-48 lg:h-58 overflow-hidden">
          <Image
            src={article.image}
            alt={article.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            quality={75}
          />
        </div>
        <div className="p-4 text-right flex flex-col flex-grow">
          <Badge variant="secondary" className="mb-2 self-start">
            {article.category}
          </Badge>
          <h3 className="mb-2 leading-snug group-hover:text-[#c90000] transition-colors line-clamp-2 font-semibold">
            {article.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 flex-grow">
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-auto">
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3" />
              <span>{article.readTime}</span>
            </div>
            <span>{article.date}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
