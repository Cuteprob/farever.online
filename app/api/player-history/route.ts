import { NextRequest, NextResponse } from "next/server";
import { getPlayerHistoryPayload } from "@/lib/player-tracking";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const appId = process.env.NEXT_PUBLIC_STEAM_APP_ID || "3672400";
  const daysParam = request.nextUrl.searchParams.get("days");
  const days = Math.min(Math.max(Number(daysParam || "7"), 1), 14);

  try {
    const payload = await getPlayerHistoryPayload(appId, Number.isNaN(days) ? 7 : days);
    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Failed to fetch player history:", error);
    return NextResponse.json({ points: [], historyAvailable: false }, { status: 200 });
  }
}

