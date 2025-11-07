interface SectionHeaderProps {
  title: string;
  color: string;
  className?: string;
}

export function SectionHeader({
  title,
  color,
  className = "",
}: SectionHeaderProps) {
  return (
    <h2
      className={`text-2xl mb-6 pb-2 border-b-4 inline-block text-right ${className}`}
      style={{ borderColor: color }}
    >
      {title}
    </h2>
  );
}
