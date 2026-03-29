import type { Metadata, Viewport } from "next";
import { Orbitron, Rajdhani, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Toaster } from "sonner";
import WebVitals from "@/components/WebVitals";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import ThirdPartyScripts from "@/components/third-party-scripts";
import { siteConfig } from "@/lib/site-config";

// 配置Speed Stars运动风格字体
// Orbitron - 科技感标题字体
// Rajdhani - 运动风格正文字体，具有现代感和动感
const orbitron = Orbitron({ 
  weight: ['400', '700', '900'],
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-orbitron',
});

const rajdhani = Rajdhani({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-rajdhani',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl || 'https://example.com'),
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
        {/* DNS预解析和资源预加载 */}
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <link rel="dns-prefetch" href="//pagead2.googlesyndication.com" />

        {/* 关键API预加载 - 首屏数据 */}
        <link rel="preload" href="/api/getMainGames" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/api/getAllGames" as="fetch" crossOrigin="anonymous" />

        {/* 关键图片预加载 */}
        <link rel="preload" href="/logo.png" as="image" />
        <link rel="preload" href="/placeholder.png" as="image" />

        {/* 关键CSS内联 - 首屏渲染优化 */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* 关键CSS - 首屏渲染 */
            body { margin: 0; padding: 0; }
            .loading-skeleton { 
              animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; 
            }
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: .5; }
            }
            /* 防止布局偏移的关键样式 */
            .aspect-ratio-4-3 { aspect-ratio: 4/3; }
            .aspect-ratio-16-9 { aspect-ratio: 16/9; }
          `
        }} />
      </head>
      <body 
        className={`
          ${orbitron.variable} 
          ${rajdhani.variable} 
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
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
