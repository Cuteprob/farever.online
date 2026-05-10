export interface AdsterraSlotConfig {
  containerId: string;
  scriptSrc: string;
}

function getAdsterraSlot(prefix: string): AdsterraSlotConfig | null {
  const containerId = process.env[`${prefix}_CONTAINER_ID`];
  const scriptSrc = process.env[`${prefix}_SCRIPT_SRC`];

  if (!containerId || !scriptSrc) {
    return null;
  }

  return { containerId, scriptSrc };
}

export const adConfig = {
  homeNative: getAdsterraSlot("NEXT_PUBLIC_ADSTERRA_HOME_NATIVE"),
  guideMidNative: getAdsterraSlot("NEXT_PUBLIC_ADSTERRA_GUIDE_MID_NATIVE"),
  guideEndNative: getAdsterraSlot("NEXT_PUBLIC_ADSTERRA_GUIDE_END_NATIVE"),
};
