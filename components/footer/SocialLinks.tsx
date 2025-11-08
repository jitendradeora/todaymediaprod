import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Linkedin,
} from "lucide-react";

interface FooterLink {
  href: string;
  label: string;
}

interface SocialLink {
  platform: string;
  url: string;
}

interface SocialLinksProps {
  heading?: string;
  socialLinks?: SocialLink[];
  aboutLinks: FooterLink[];
}

// Map platform names to icons
const getSocialIcon = (platform: string) => {
  if (!platform || typeof platform !== 'string') return null;
  
  const platformLower = platform.toLowerCase();
  
  if (platformLower.includes('facebook')) return Facebook;
  if (platformLower.includes('twitter') || platformLower.includes('x')) return Twitter;
  if (platformLower.includes('instagram')) return Instagram;
  if (platformLower.includes('youtube')) return Youtube;
  if (platformLower.includes('linkedin')) return Linkedin;
  if (platformLower.includes('mail') || platformLower.includes('email')) return Mail;
  
  return null;
};

// Get aria label for platform
const getAriaLabel = (platform: string) => {
  if (!platform || typeof platform !== 'string') return 'تابعنا';
  
  const platformLower = platform.toLowerCase();
  
  if (platformLower.includes('facebook')) return 'تابعنا على فيسبوك';
  if (platformLower.includes('twitter') || platformLower.includes('x')) return 'تابعنا على تويتر';
  if (platformLower.includes('instagram')) return 'تابعنا على إنستغرام';
  if (platformLower.includes('youtube')) return 'تابعنا على يوتيوب';
  if (platformLower.includes('linkedin')) return 'تابعنا على لينكد إن';
  if (platformLower.includes('mail') || platformLower.includes('email')) return 'راسلنا عبر البريد الإلكتروني';
  
  return `تابعنا على ${platform}`;
};

export function SocialLinks({ heading = "تابعنا", socialLinks = [], aboutLinks }: SocialLinksProps) {

  // Fallback to hardcoded links if no social links provided
  const defaultSocialLinks: SocialLink[] = [
    { platform: "Facebook", url: "https://www.facebook.com/TodaymediaT" },
    { platform: "Twitter", url: "https://x.com/TodaymediaT" },
    { platform: "Instagram", url: "https://www.instagram.com/toda.ymedia/" },
    { platform: "Youtube", url: "https://www.youtube.com/channel/UCrFx2VgF0Pw33-_dC5K8EQg" },
    { platform: "Email", url: "mailto:info@todaymedia.net" },
  ];

  // Filter out invalid links first
  const validSocialLinks = (socialLinks || []).filter(link => 
    link && link.platform && link.url && typeof link.platform === 'string'
  );

  const displayLinks = validSocialLinks.length > 0 ? validSocialLinks : defaultSocialLinks;

  return (
    <div className="text-right">
      <h4 className="mb-4">{heading}</h4>
      <div className="flex gap-3 justify-start mb-6">
        {displayLinks.map((link) => {
          // Skip invalid links
          if (!link || !link.platform || !link.url) return null;
          
          const Icon = getSocialIcon(link.platform);
          if (!Icon) return null;

          return (
            <a
              key={link.url}
              href={link.url}
              className="bg-gray-800 w-11 h-11 min-w-11 min-h-11 rounded-full hover:bg-red-600 transition-colors flex items-center justify-center"
              aria-label={getAriaLabel(link.platform)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon className="w-5 h-5" />
            </a>
          );
        })}
      </div>

      {/* Divider */}
      {aboutLinks.length > 0 && (
        <>
          <div className="border-t border-gray-700 mb-4"></div>

          {/* Additional Links - Inline */}
          <div className="flex flex-wrap gap-2 items-center text-sm">
            {aboutLinks.map((link, index) => (
              <span key={`${link.href}-${index}`} className="contents">
                {index > 0 && <span className="text-gray-600">•</span>}
                <Link
                  href={link.href}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
