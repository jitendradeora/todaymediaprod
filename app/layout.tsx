import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import ScrollToTop from "@/components/ScrollToTop";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HeaderAdBanner from "@/components/HeaderAdBanner";
import GlobalLoader from "@/components/GlobalLoader";
import { baseMetadata } from "@/lib/metadata";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { fetchHeadBodyFooterCode } from "@/lib/actions/site/themeSettingsAction";
import { HeadCode } from "@/components/HeadCode";
// Use Next.js font loader to self-host Google Fonts and avoid external render-blocking requests
import { Tajawal } from 'next/font/google';

const tajawal = Tajawal({
  weight: ['300', '400', '500', '700', '900'],
  subsets: ['arabic', 'latin'],
  display: 'swap',
  preload: true,
  fallback: ['Arial', 'sans-serif'],
  adjustFontFallback: true,
});

export const metadata: Metadata = baseMetadata;

// Optimize viewport for mobile performance
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a1a' },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch head, body, and footer code snippets
  const { headTagCode, bodyTagCode, footerTagCode } = await fetchHeadBodyFooterCode();

  return (
    <html lang="ar" dir="rtl" className={tajawal.className} suppressHydrationWarning>
      <head>
        {/* Preconnect to WordPress CDN for faster image loading (critical for LCP) */}
        <link rel="preconnect" href="https://biva.todaymedia.net" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://biva.todaymedia.net" />
      </head>
      <body suppressHydrationWarning>
        {/* Inject headTagCode (client-side injection for scripts/meta tags) */}
        {headTagCode && <HeadCode code={headTagCode} />}
        {/* Inject bodyTagCode just after <body> tag */}
        {bodyTagCode && (
          <div dangerouslySetInnerHTML={{ __html: bodyTagCode }} />
        )}
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <GlobalLoader />
          <ScrollToTop />
          <Suspense fallback={
            <div className="bg-background shadow-sm border-b border-border sticky top-0 z-50">
              <Skeleton className="h-20 w-full" />
            </div>
          }>
            <Header />
          </Suspense>
          <Suspense fallback={null}>
            <HeaderAdBanner />
          </Suspense>
          {children}
          <Suspense fallback={<Skeleton className="h-64 w-full" />}>
            <Footer footerTagCode={footerTagCode} />
          </Suspense>
          <Toaster position="top-center" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
