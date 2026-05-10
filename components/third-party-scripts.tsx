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
