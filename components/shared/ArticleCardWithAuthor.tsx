import Link from "next/link";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

interface ArticleCardWithAuthorProps {
  id: number;
  title: string;
  image: string;
  date: string;
  author: string;
  categorySlug?: string;
  className?: string;
}

export function ArticleCardWithAuthor({
  id,
  title,
  image,
  date,
  author,
  categorySlug = 'news',
  className = "",
}: ArticleCardWithAuthorProps) {
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
          <div className="flex items-center gap-3 mt-4">
            <div>
              <p className="text-sm font-medium">{author}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {date}
              </p>
            </div>
            <div className="w-10 h-10 bg-[#c90000] rounded-full flex items-center justify-center text-white shrink-0">
              {author.charAt(0)}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
