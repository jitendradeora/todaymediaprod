import { fetchHeaderAdBanner } from "@/lib/actions/site/themeSettingsAction";

export default async function HeaderAdBanner() {
  const adBanner = await fetchHeaderAdBanner();

  if (!adBanner) {
    return null;
  }

  // Clean and convert AMP HTML to regular HTML (same logic as GridSection)
  const cleanAdBanner = adBanner
    .trim()
    // Replace line breaks with spaces
    .replace(/\r\n/g, ' ')
    .replace(/\n/g, ' ')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    // Convert AMP img to regular img
    .replace(/<amp-img\s+/gi, '<img ')
    .replace(/<\/amp-img>/gi, '')
    // Remove AMP-specific attributes
    .replace(/\s+layout=["']responsive["']\s*/gi, ' ')
    .replace(/\s+layout=["']intrinsic["']\s*/gi, ' ')
    .replace(/\s+layout=["']fixed["']\s*/gi, ' ')
    // Ensure img tag is properly closed
    .replace(/<img([^>]*?)(?:\s*\/)?>/gi, (match, attrs) => {
      // Remove layout attribute if still present
      attrs = attrs.replace(/\s+layout=["'][^"']*["']/gi, '');
      // Ensure self-closing
      if (!match.endsWith('/>') && !match.endsWith('>')) {
        return `<img${attrs} />`;
      }
      return `<img${attrs} />`;
    });

  return (
    <div 
      className="w-full bg-background border-b border-border py-2 container mx-auto"
      dangerouslySetInnerHTML={{ __html: cleanAdBanner }}
    />
  );
}

