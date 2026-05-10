import { NextResponse } from "next/server";
import { getPlayerCountPayload } from "@/lib/player-tracking";

export const runtime = "edge";

const CACHE_DURATION = 300;

export async function GET() {
  const appId = process.env.NEXT_PUBLIC_STEAM_APP_ID || "3672400";

  try {
    const payload = await getPlayerCountPayload(appId);

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${CACHE_DURATION * 2}`,
      },
    });
  } catch (error) {
    console.error("Failed to fetch player count:", error);

    return NextResponse.json(
      {
        current: null,
        site24hPeak: null,
        displayAllTimePeak: null,
        siteTrackedPeak: null,
        samplesToday: 0,
        historyAvailable: false,
        storageMode: "memory",
        lastUpdated: new Date().toISOString(),
        source: "unavailable",
        error: "Steam API temporarily unavailable",
      },
      { status: 200 }
    );
  }
}
