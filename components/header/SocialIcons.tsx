import { Facebook, Twitter, Instagram, Youtube, Mail, Linkedin } from "lucide-react";

interface SocialLink {
  platform: string;
  url: string;
}

interface SocialIconsProps {
  socialLinks?: SocialLink[];
}

// Map platform names to icons and colors
const getSocialIconAndColor = (platform: string) => {
  if (!platform || typeof platform !== 'string') return null;
  
  const platformLower = platform.toLowerCase();
  
  if (platformLower.includes('facebook')) {
    return { Icon: Facebook, color: 'bg-[#1877f2]', label: 'تابعنا على فيسبوك' };
  }
  if (platformLower.includes('twitter') || platformLower.includes('x')) {
    return { Icon: Twitter, color: 'bg-[#1da1f2]', label: 'تابعنا على تويتر' };
  }
  if (platformLower.includes('instagram')) {
    return { Icon: Instagram, color: 'bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045]', label: 'تابعنا على إنستغرام' };
  }
  if (platformLower.includes('youtube')) {
    return { Icon: Youtube, color: 'bg-[#ff0000]', label: 'تابعنا على يوتيوب' };
  }
  if (platformLower.includes('linkedin')) {
    return { Icon: Linkedin, color: 'bg-[#0077b5]', label: 'تابعنا على لينكد إن' };
  }
  if (platformLower.includes('mail') || platformLower.includes('email')) {
    return { Icon: Mail, color: 'bg-gray-800', label: 'راسلنا عبر البريد الإلكتروني' };
  }
  
  return null;
};

export function SocialIcons({ socialLinks }: SocialIconsProps) {
  // Fallback to hardcoded links if no social links provided
  const defaultSocialLinks: SocialLink[] = [
    { platform: "Facebook", url: "https://www.facebook.com/TodaymediaT" },
    { platform: "Twitter", url: "https://x.com/TodaymediaT" },
    { platform: "Instagram", url: "https://www.instagram.com/toda.ymedia/" },
    { platform: "Youtube", url: "https://www.youtube.com/channel/UCrFx2VgF0Pw33-_dC5K8EQg" },
    { platform: "Email", url: "mailto:info@todaymedia.net" },
  ];

  // Filter out invalid links
  const validSocialLinks = (socialLinks || []).filter(link => 
    link && link.platform && link.url && typeof link.platform === 'string'
  );

  const displayLinks = validSocialLinks.length > 0 ? validSocialLinks : defaultSocialLinks;

  return (
    <div className="flex gap-3 justify-start">
      {displayLinks.map((link) => {
        const iconData = getSocialIconAndColor(link.platform);
        if (!iconData) return null;

        const { Icon, color, label } = iconData;

        return (
          <a
            key={link.url}
            href={link.url}
            aria-label={label}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-11 h-11 min-w-11 min-h-11 ${color} rounded-full flex items-center justify-center text-white hover:opacity-80 transition-opacity`}
          >
            <Icon className="w-4 h-4" />
          </a>
        );
      })}
    </div>
  );
}
