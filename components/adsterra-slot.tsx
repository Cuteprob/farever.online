"use client";

import { useEffect, useId, useState } from "react";
import { adConfig, AdsterraSlotConfig } from "@/lib/ad-config";
import { shouldLoadThirdPartyScripts } from "@/lib/runtime-helpers";
import { siteConfig } from "@/lib/site-config";

type AdsterraSlotVariant = "home" | "guide";

const variantHeights: Record<AdsterraSlotVariant, string> = {
  home: "min-h-[320px] sm:min-h-[340px] lg:min-h-[280px]",
  guide: "min-h-[360px] sm:min-h-[420px] lg:min-h-[300px]",
};

interface AdsterraSlotProps {
  slot: AdsterraSlotConfig | null;
  variant?: AdsterraSlotVariant;
  className?: string;
}

function joinClasses(...values: Array<string | undefined>): string {
  return values.filter(Boolean).join(" ");
}

export function AdsterraSlot({
  slot,
  variant = "guide",
  className,
}: AdsterraSlotProps) {
  const [mounted, setMounted] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const id = useId().replace(/:/g, "");

  useEffect(() => {
    setMounted(true);
    setShouldLoad(shouldLoadThirdPartyScripts(window.location.hostname, siteConfig.siteUrl));
  }, []);

  useEffect(() => {
    if (!slot || !shouldLoad) {
      return;
    }

    const mountNode = document.getElementById(`${slot.containerId}-${id}`);
    if (!mountNode) {
      return;
    }

    mountNode.innerHTML = "";

    const slotContainer = document.createElement("div");
    slotContainer.id = slot.containerId;

    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src = slot.scriptSrc;

    mountNode.appendChild(script);
    mountNode.appendChild(slotContainer);

    return () => {
      mountNode.innerHTML = "";
    };
  }, [id, shouldLoad, slot]);

  if (!slot || !mounted) {
    return null;
  }

  return (
    <section
      aria-label="Advertisement"
      className={joinClasses(
        "rounded-2xl border border-theme-dark-600 bg-theme-dark-800/75 p-4 shadow-game",
        variantHeights[variant],
        className,
      )}
    >
      <div className="mb-3 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
        Advertisement
      </div>
      <div
        id={`${slot.containerId}-${id}`}
        className="flex min-h-[280px] items-center justify-center overflow-hidden rounded-xl bg-theme-dark-900/70"
      />
    </section>
  );
}

export function HomeAdsterraSlot() {
  return <AdsterraSlot slot={adConfig.homeNative} variant="home" />;
}

export function GuideMidAdsterraSlot() {
  return <AdsterraSlot slot={adConfig.guideMidNative} variant="guide" />;
}

export function GuideEndAdsterraSlot() {
  return <AdsterraSlot slot={adConfig.guideEndNative} variant="guide" />;
}
