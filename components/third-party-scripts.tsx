"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { siteConfig } from "@/lib/site-config";
import { shouldLoadThirdPartyScripts } from "@/lib/runtime-helpers";

export function ThirdPartyScripts() {
  const [shouldLoadScripts, setShouldLoadScripts] = useState(false);

  useEffect(() => {
    setShouldLoadScripts(shouldLoadThirdPartyScripts(window.location.hostname, siteConfig.siteUrl));
  }, []);

  if (!shouldLoadScripts) {
    return null;
  }

  return (
    <>
      {process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID && (
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID}`}
          crossOrigin="anonymous"
        />
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
      {siteConfig.plausibleDomain && (
        <Script
          defer
          data-domain={siteConfig.plausibleDomain}
          src={siteConfig.plausibleScriptSrc}
        />
      )}
    </>
  );
}

export default ThirdPartyScripts;
