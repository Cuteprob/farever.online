"use client";

import { useEffect, useState } from "react";
import { MiniTrendChart } from "@/components/mini-trend-chart";
import { SourceBadge } from "@/components/source-badge";

interface PlayerData {
  current: number | null;
  site24hPeak: number | null;
  displayAllTimePeak: number | null;
  siteTrackedPeak: number | null;
  samplesToday: number;
  historyAvailable: boolean;
  storageMode?: "d1" | "memory";
  lastUpdated: string;
  source: string;
  error?: string;
}

interface PlayerHistoryPoint {
  sampledAt: string;
  playerCount: number;
}

function formatLocalTime(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(iso));
}

export function PlayerCount() {
  const [data, setData] = useState<PlayerData | null>(null);
  const [points, setPoints] = useState<PlayerHistoryPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlayerCount() {
      try {
        const [countRes, historyRes] = await Promise.all([
          fetch("/api/player-count"),
          fetch("/api/player-history?days=7"),
        ]);
        const [countJson, historyJson] = await Promise.all([countRes.json(), historyRes.json()]);
        setData(countJson);
        setPoints(historyJson.points || []);
      } catch {
        setData({
          current: null,
          site24hPeak: null,
          displayAllTimePeak: null,
          siteTrackedPeak: null,
          samplesToday: 0,
          historyAvailable: false,
          storageMode: "memory",
          lastUpdated: new Date().toISOString(),
          source: "unavailable",
          error: "Failed to connect",
        });
        setPoints([]);
      } finally {
        setLoading(false);
      }
    }

    fetchPlayerCount();
    // Refresh every 5 minutes
    const interval = setInterval(fetchPlayerCount, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-lg border border-theme-dark-600 bg-theme-dark-800/90 p-6 shadow-game">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <div className="absolute inset-0 h-3 w-3 rounded-full bg-green-500 opacity-50 animate-ping" />
          </div>
          <div>
            <h2 className="font-theme-heading text-lg font-semibold text-white">
              Live Pulse
            </h2>
            <p className="text-xs text-muted-foreground">Current players plus site-tracked sampling.</p>
          </div>
        </div>
        <SourceBadge type="site-tracked" label={data?.storageMode === "d1" ? "Site-Tracked" : "Live Only"} />
      </div>

      {loading ? (
        <div className="space-y-3">
          <div className="h-12 w-32 bg-theme-dark-700 rounded-lg animate-pulse" />
          <div className="h-4 w-48 bg-theme-dark-700 rounded animate-pulse" />
        </div>
      ) : data?.current !== null && data?.current !== undefined ? (
        <div className="space-y-5">
          <div>
            <div className="flex items-end gap-3">
              <span className="font-theme-mono text-4xl font-bold tracking-tight text-white tabular-nums sm:text-5xl">
                {data.current.toLocaleString()}
              </span>
              <span className="pb-1 text-sm uppercase tracking-[0.12em] text-muted-foreground">
                playing now
              </span>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span>Source: {data.source}</span>
              <span>Updated: {formatLocalTime(data.lastUpdated)}</span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-theme-dark-600 bg-theme-dark-900/70 p-4">
              <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Sampled 24H Peak</div>
              <div className="mt-2 font-theme-mono text-2xl font-semibold text-white tabular-nums">
                {data.site24hPeak?.toLocaleString() || "--"}
              </div>
            </div>
            <div className="rounded-lg border border-theme-dark-600 bg-theme-dark-900/70 p-4">
              <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">All-Time Peak</div>
              <div className="mt-2 font-theme-mono text-2xl font-semibold text-white tabular-nums">
                {data.displayAllTimePeak?.toLocaleString() || "--"}
              </div>
            </div>
            <div className="rounded-lg border border-theme-dark-600 bg-theme-dark-900/70 p-4">
              <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Samples Today</div>
              <div className="mt-2 font-theme-mono text-2xl font-semibold text-white tabular-nums">
                {data.samplesToday.toLocaleString()}
              </div>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-theme-heading text-sm font-medium uppercase tracking-[0.14em] text-theme-frost-300">
                7-Day Trend
              </h3>
              {!data.historyAvailable && (
                <span className="text-[11px] text-muted-foreground">Waiting for more samples</span>
              )}
            </div>
            <MiniTrendChart points={points} />
          </div>

          <p className="text-xs leading-6 text-muted-foreground">
            Current players come from the Steam API. The 24-hour peak and trend chart come from Farever.online sampling. All-time peak uses the higher value between Farever.online tracked history and your configured launch reference.
            {data.storageMode !== "d1" ? " Persistent 24-hour peaks require the Cloudflare D1 binding." : ""}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Live player count is temporarily unavailable. Check{" "}
            <a
              href="https://steamdb.info/app/3672400/charts/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-theme-frost-400 hover:underline"
            >
              SteamDB
            </a>{" "}
            for external live charts.
          </p>
          <p className="text-xs leading-6 text-muted-foreground">
            Site-tracked peak and trend data appear automatically after storage is configured and enough samples are collected.
          </p>
        </div>
      )}
    </div>
  );
}
