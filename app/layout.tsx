import type { Metadata, Viewport } from "next";
import { Inter, Cinzel, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Toaster } from "sonner";
import WebVitals from "@/components/WebVitals";
import ThirdPartyScripts from "@/components/third-party-scripts";
import { siteConfig } from "@/lib/site-config";

const googleAdSenseId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID;
const googleAnalyticsId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

// Farever 奇幻主题字体
// Cinzel - 古典衬线标题字体，奇幻感
const cinzel = Cinzel({
  weight: ['400', '600', '700'],
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-cinzel',
});

// Inter - 现代高可读性正文字体
const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl || 'https://farever.online'),
  manifest: "/manifest.webmanifest",
  icons: {
    apple: "/apple-touch-icon.png",
    icon: "/favicon.ico",
  },
  openGraph: {
    siteName: siteConfig.siteName,
    locale: siteConfig.siteLocale,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: siteConfig.siteThemeColor,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {googleAdSenseId && (
          <>
            <meta name="google-adsense-account" content={googleAdSenseId} />
            <script
              async
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${googleAdSenseId}`}
              crossOrigin="anonymous"
            />
          </>
        )}
        {googleAnalyticsId && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${googleAnalyticsId}');
                `,
              }}
            />
          </>
        )}

        {/* DNS 预解析 */}
        <link rel="dns-prefetch" href="//pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <link rel="dns-prefetch" href="//api.steampowered.com" />

        {/* 关键 CSS 内联 - 首屏渲染优化 */}
        <style dangerouslySetInnerHTML={{
          __html: `
            body { margin: 0; padding: 0; }
            .loading-skeleton { 
              animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; 
            }
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: .5; }
            }
          `
        }} />
      </head>
      <body 
        className={`
          ${cinzel.variable} 
          ${inter.variable} 
          ${jetbrainsMono.variable} 
          font-theme-body 
          antialiased
        `}
      >
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <Toaster />
        <WebVitals />
        <ThirdPartyScripts />
      </body>
    </html>
  );
}
