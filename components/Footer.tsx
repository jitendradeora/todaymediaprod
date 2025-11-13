import { FooterCollapsible } from "./footer/FooterCollapsible";
import { ScrollToTop } from "./footer/ScrollToTop";
import { SocialLinks } from "./footer/SocialLinks";
import { fetchFooterMenusData, fetchFooterData, fetchSocialLinksData } from "@/lib/actions/site/themeSettingsAction";

interface FooterProps {
  footerTagCode?: string | null;
}

export default async function Footer({ footerTagCode }: FooterProps) {
  const footerMenus = await fetchFooterMenusData();
  const footerData = await fetchFooterData();
  const socialData = await fetchSocialLinksData();

  // Debug: Log social data

  return (
    <>
      <footer className="bg-gray-900 text-white mt-12">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* About */}
            <div className="text-right">
              <h3 className="text-xl mb-4 text-red-500">
                {footerData?.aboutHeading || "اليوم ميديا"}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {footerData?.aboutDescription || "موقع إخباري شامل يقدم آخر الأخبار العربية والعالمية على مدار الساعة"}
              </p>
            </div>

            {/* Menu 1 */}
            <FooterCollapsible 
              title={footerData?.menu2Title || "روابط سريعة"} 
              links={footerMenus.quickLinks} 
            />

            {/* Menu 2 */}
            <FooterCollapsible 
              title={footerData?.menu1Title || "الأقسام"} 
              links={footerMenus.categories} 
            />

            {/* Social Media */}
            <SocialLinks 
              heading={socialData?.heading}
              socialLinks={socialData?.links}
              aboutLinks={footerMenus.aboutLinks} 
            />
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>{footerData?.copyrightText1 || "جميع الحقوق محفوظة لـ Todaymedia© 2025"}</p>
            <p>{footerData?.copyrightText2 || "Affiliated with the Arab Media House - London"}</p>
          </div>
        </div>
        {/* Inject footerTagCode just before closing </footer> tag */}
        {footerTagCode && (
          <div dangerouslySetInnerHTML={{ __html: footerTagCode }} />
        )}
      </footer>

      <ScrollToTop />
    </>
  );
}
