import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  color: string;
  className?: string;
  href?: string;
}

export function SectionHeader({
  title,
  color,
  className = "",
  href,
}: SectionHeaderProps) {
  const headerContent = (
    <h2
      className={`text-2xl mb-6 pb-2 border-b-4 inline-block text-right ${className} ${href ? 'hover:opacity-80 transition-opacity cursor-pointer' : ''}`}
      style={{ borderColor: color }}
    >
      {title}
    </h2>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block">
        {headerContent}
      </Link>
    );
  }

  return headerContent;
}
