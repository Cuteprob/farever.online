import type { Metadata } from "next";
import { Fredoka, Nunito, Fira_Code } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Toaster } from "sonner";
import WebVitals from "@/components/WebVitals";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

// 配置可爱游戏风格字体
const fredoka = Fredoka({ 
  weight: '400',
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-fredoka',
});

const nunito = Nunito({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-nunito',
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-fira-code',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_WEB_URL || 'https://bunnymarket.app'),
  openGraph: {
    siteName: 'BunnyMarket',
    locale: 'en',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#3b82f6" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* DNS预解析和资源预加载 */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <link rel="dns-prefetch" href="//pagead2.googlesyndication.com" />
        
        {/* 关键API预加载 - 首屏数据 */}
        <link rel="preload" href="/api/getMainGames" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/api/getAllGames" as="fetch" crossOrigin="anonymous" />
        
        {/* 关键字体预加载 - 避免字体闪烁 */}
        <link rel="preload" href="https://fonts.gstatic.com/s/fredoka/v14/X7nP4R87HX_qjq0KmJzxfpM.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="https://fonts.gstatic.com/s/nunito/v26/XRXI3I6Li01BKofiOc5wtlZ2di8HDLshdTA.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        
        {/* 关键图片预加载 */}
        <link rel="preload" href="/logo.png" as="image" />
        <link rel="preload" href="/placeholder.png" as="image" />
        
        {/* 关键CSS预加载 */}
        <link rel="preload" href="/globals.css" as="style" />
        
        {/* 字体预连接 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
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
        {process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID && (
          <Script 
            async 
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID}`} 
            data-overlays="bottom" 
            crossOrigin="anonymous"
          ></Script>
        )}
        {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}');
              `}
            </Script>
          </>
        )}
      </head>
      <body 
        className={`
          ${fredoka.variable} 
          ${nunito.variable} 
          ${firaCode.variable} 
          font-body 
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
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
