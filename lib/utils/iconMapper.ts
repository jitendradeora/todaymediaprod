import * as LucideIcons from 'lucide-react';

// Map of icon class names to Lucide React components
const iconMap: Record<string, React.ComponentType<any>> = {
  users: LucideIcons.Users,
  target: LucideIcons.Target,
  eye: LucideIcons.Eye,
  award: LucideIcons.Award,
  globe: LucideIcons.Globe,
  heart: LucideIcons.Heart,
  briefcase: LucideIcons.Briefcase,
  newspaper: LucideIcons.Newspaper,
  trophy: LucideIcons.Trophy,
  cpu: LucideIcons.Cpu,
  activity: LucideIcons.Activity,
  palette: LucideIcons.Palette,
  lightbulb: LucideIcons.Lightbulb,
  shield: LucideIcons.Shield,
  zap: LucideIcons.Zap,
  star: LucideIcons.Star,
  messageCircle: LucideIcons.MessageCircle,
  'message-circle': LucideIcons.MessageCircle,
};

/**
 * Get Lucide icon component from icon class name
 * @param iconClass - The icon class name (e.g., 'users', 'target', 'eye')
 * @returns The corresponding Lucide icon component or a default icon
 */
export function getIcon(iconClass: string | null | undefined): React.ComponentType<any> {
  if (!iconClass) {
    return LucideIcons.Circle; // Default fallback icon
  }

  // Convert to lowercase and remove any extra spaces
  const normalizedIconClass = iconClass.toLowerCase().trim();

  // Return the matched icon or default icon
  return iconMap[normalizedIconClass] || LucideIcons.Circle;
}
