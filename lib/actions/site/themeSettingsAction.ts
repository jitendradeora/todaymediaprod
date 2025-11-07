import apolloClient from "@/lib/client/ApolloClient";
import { GET_THEME_SETTINGS } from "@/lib/queries/site/themeSettingsQueries";

// Types
export interface SocialLink {
  seelctSocialPlatform: string[]; // Note: WordPress has typo in field name, and it's an array!
  socialLinkUrl: string;
}

export interface SocialLinkBlockMenuItem {
  menuItemLabel: string;
  menuItemLink: string;
}

export interface FooterMenu1Item {
  footer_menu1_item_label: string;
  footer_menu1_item_link: string;
}

export interface FooterMenu2Item {
  footer_menu2_item_label: string;
  footer_menu2_item_link: string;
}

export interface ThemeOptionsFields {
  announceBarMessage: string;
  socialLinkBlockHeading: string;
  socialLinks: SocialLink[];
  socialLinkBlockMenu: SocialLinkBlockMenuItem[];
  footerMenu1Title: string;
  footer_menu1_item_label_link: FooterMenu1Item[];
  footer_menu2_title: string;
  footerMenu2ItemLabelLink: FooterMenu2Item[];
  footer_about_heading: string;
  footer_about_description: string;
  copyrightText1: string;
  copyrightText2: string;
}

export interface ThemeSettings {
  themeOptionsFields: ThemeOptionsFields;
}

interface ThemeSettingsResponse {
  themeSettings: ThemeSettings;
}

// Transformed types for footer components
export interface FooterLink {
  href: string;
  label: string;
}

export interface SocialLinkData {
  heading: string;
  links: {
    platform: string;
    url: string;
  }[];
  menuLinks: FooterLink[];
}

export interface FooterData {
  aboutHeading: string;
  aboutDescription: string;
  menu1Title: string;
  menu1Links: FooterLink[];
  menu2Title: string;
  menu2Links: FooterLink[];
  copyrightText1: string;
  copyrightText2: string;
}

/**
 * Fetch all theme settings from WordPress
 * Internal helper function
 */
async function getThemeSettings(): Promise<ThemeSettings | null> {
  try {
    const result = await apolloClient.query<ThemeSettingsResponse>({
      query: GET_THEME_SETTINGS,
      fetchPolicy: 'no-cache', // Force fresh data, bypass Apollo cache
    });

    return result.data?.themeSettings || null;
  } catch (error: any) {
    console.error("Error fetching theme settings:", error?.message);
    return null;
  }
}

/**
 * Fetch announcement bar message
 */
export async function fetchAnnounceBarMessage(): Promise<string> {
  try {
    const settings = await getThemeSettings();
    return settings?.themeOptionsFields?.announceBarMessage || "";
  } catch (error) {
    console.error("Error fetching announcement bar message:", error);
    return "";
  }
}

/**
 * Fetch social links data
 * Returns heading, social platform links, and menu links
 */
export async function fetchSocialLinksData(): Promise<SocialLinkData | null> {
  try {
    const settings = await getThemeSettings();
    
    if (!settings?.themeOptionsFields) {
      return null;
    }

    const fields = settings.themeOptionsFields;

    return {
      heading: fields.socialLinkBlockHeading || "تابعنا",
      links: (fields.socialLinks || []).map(link => ({
        platform: link.seelctSocialPlatform?.[0] || '', // It's an array, take first element
        url: link.socialLinkUrl,
      })),
      menuLinks: (fields.socialLinkBlockMenu || []).map(item => ({
        href: item.menuItemLink,
        label: item.menuItemLabel,
      })),
    };
  } catch (error) {
    console.error("Error fetching social links data:", error);
    return null;
  }
}

/**
 * Fetch footer menus data (matching FooterMenuData structure)
 * Returns aboutLinks, quickLinks, and categories for footer
 */
export async function fetchFooterMenusData(): Promise<{
  aboutLinks: FooterLink[];
  quickLinks: FooterLink[];
  categories: FooterLink[];
}> {
  try {
    const settings = await getThemeSettings();
    
    if (!settings?.themeOptionsFields) {
      return {
        aboutLinks: [],
        quickLinks: [],
        categories: [],
      };
    }

    const fields = settings.themeOptionsFields;

    return {
      // Menu 1 -> categories
      categories: (fields.footer_menu1_item_label_link || []).map(item => ({
        href: item.footer_menu1_item_link,
        label: item.footer_menu1_item_label,
      })),
      // Menu 2 -> quickLinks
      quickLinks: (fields.footerMenu2ItemLabelLink || []).map(item => ({
        href: item.footer_menu2_item_link,
        label: item.footer_menu2_item_label,
      })),
      // Social menu -> aboutLinks
      aboutLinks: (fields.socialLinkBlockMenu || []).map(item => ({
        href: item.menuItemLink,
        label: item.menuItemLabel,
      })),
    };
  } catch (error) {
    console.error("Error fetching footer menus data:", error);
    return {
      aboutLinks: [],
      quickLinks: [],
      categories: [],
    };
  }
}

/**
 * Fetch footer data
 * Returns about section, two footer menus, and copyright texts
 */
export async function fetchFooterData(): Promise<FooterData | null> {
  try {
    const settings = await getThemeSettings();
    
    if (!settings?.themeOptionsFields) {
      return null;
    }

    const fields = settings.themeOptionsFields;

    return {
      aboutHeading: fields.footer_about_heading || "",
      aboutDescription: fields.footer_about_description || "",
      menu1Title: fields.footerMenu1Title || "",
      menu1Links: (fields.footer_menu1_item_label_link || []).map(item => ({
        href: item.footer_menu1_item_link,
        label: item.footer_menu1_item_label,
      })),
      menu2Title: fields.footer_menu2_title || "",
      menu2Links: (fields.footerMenu2ItemLabelLink || []).map(item => ({
        href: item.footer_menu2_item_link,
        label: item.footer_menu2_item_label,
      })),
      copyrightText1: fields.copyrightText1 || "",
      copyrightText2: fields.copyrightText2 || "",
    };
  } catch (error) {
    console.error("Error fetching footer data:", error);
    return null;
  }
}
