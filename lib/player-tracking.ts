import { getRequestContext } from "@cloudflare/next-on-pages";

const CACHE_DURATION = 300;
const SAMPLE_INTERVAL_MS = 5 * 60 * 1000;
const HISTORY_DAYS = 7;
const FALLBACK_ALL_TIME_PEAK = 7331;

type PlayerSample = {
  playerCount: number;
  sampledAt: string;
};

type PlayerSummary = {
  site24hPeak: number | null;
  displayAllTimePeak: number | null;
  siteTrackedPeak: number | null;
  samplesToday: number;
  historyAvailable: boolean;
  storageMode: "d1" | "memory";
};

declare global {
  // eslint-disable-next-line no-var
  var __fareverPlayerSamples__: PlayerSample[] | undefined;
}

function getMemorySamples() {
  if (!globalThis.__fareverPlayerSamples__) {
    globalThis.__fareverPlayerSamples__ = [];
  }
  return globalThis.__fareverPlayerSamples__;
}

async function fetchCurrentPlayers(appId: string) {
  const res = await fetch(
    `https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${appId}`,
    {
      next: { revalidate: CACHE_DURATION },
      headers: { "User-Agent": "Farever.online/1.0" },
    }
  );

  if (!res.ok) {
    throw new Error(`Steam API returned ${res.status}`);
  }

  const data = await res.json();
  const playerCount = data?.response?.player_count;

  if (typeof playerCount !== "number") {
    throw new Error("Invalid player count response");
  }

  return playerCount;
}

function getDb() {
  try {
    const { env } = getRequestContext();
    return env.PLAYER_DB as D1Database | undefined;
  } catch {
    return undefined;
  }
}

function hasPersistentStorage() {
  return Boolean(getDb());
}

function getConfiguredAllTimePeak() {
  return FALLBACK_ALL_TIME_PEAK;
}

async function ensureTable() {
  const db = getDb();
  if (!db) {
    return null;
  }

  try {
    await db
      .prepare(
        `CREATE TABLE IF NOT EXISTS player_samples (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          app_id TEXT NOT NULL,
          player_count INTEGER NOT NULL,
          sampled_at TEXT NOT NULL
        )`
      )
      .run();

    await db
      .prepare(
        "CREATE INDEX IF NOT EXISTS idx_player_samples_app_time ON player_samples(app_id, sampled_at DESC)"
      )
      .run();

    return db;
  } catch (error) {
    console.error("D1 ensureTable failed, falling back to memory:", error);
    return null;
  }
}

function trimMemorySamples(samples: PlayerSample[]) {
  const cutoff = Date.now() - HISTORY_DAYS * 24 * 60 * 60 * 1000;
  return samples.filter((sample) => new Date(sample.sampledAt).getTime() >= cutoff);
}

async function recordSample(appId: string, playerCount: number, sampledAt: string) {
  const db = await ensureTable();

  if (db) {
    const lastSample = await db
      .prepare("SELECT sampled_at FROM player_samples WHERE app_id = ? ORDER BY sampled_at DESC LIMIT 1")
      .bind(appId)
      .first<{ sampled_at: string }>();

    if (
      lastSample?.sampled_at &&
      Date.now() - new Date(lastSample.sampled_at).getTime() < SAMPLE_INTERVAL_MS
    ) {
      return;
    }

    await db
      .prepare("INSERT INTO player_samples (app_id, player_count, sampled_at) VALUES (?, ?, ?)")
      .bind(appId, playerCount, sampledAt)
      .run();

    return;
  }

  const samples = trimMemorySamples(getMemorySamples());
  const lastSample = samples.at(-1);
  if (lastSample && Date.now() - new Date(lastSample.sampledAt).getTime() < SAMPLE_INTERVAL_MS) {
    globalThis.__fareverPlayerSamples__ = samples;
    return;
  }

  globalThis.__fareverPlayerSamples__ = [...samples, { playerCount, sampledAt }];
}

async function readHistory(appId: string, days = HISTORY_DAYS) {
  const db = await ensureTable();
  const cutoffIso = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  if (db) {
    const result = await db
      .prepare(
        "SELECT player_count, sampled_at FROM player_samples WHERE app_id = ? AND sampled_at >= ? ORDER BY sampled_at ASC"
      )
      .bind(appId, cutoffIso)
      .all<{ player_count: number; sampled_at: string }>();

    return result.results.map((row: { player_count: number; sampled_at: string }) => ({
      playerCount: row.player_count,
      sampledAt: row.sampled_at,
    }));
  }

  return trimMemorySamples(getMemorySamples()).filter(
    (sample) => new Date(sample.sampledAt).getTime() >= new Date(cutoffIso).getTime()
  );
}

function summarizeHistory(points: PlayerSample[]): PlayerSummary {
  const storageMode = hasPersistentStorage() ? "d1" : "memory";

  if (points.length === 0) {
    return {
      site24hPeak: null,
      displayAllTimePeak: getConfiguredAllTimePeak(),
      siteTrackedPeak: null,
      samplesToday: 0,
      historyAvailable: false,
      storageMode,
    };
  }

  const now = Date.now();
  const points24h = points.filter(
    (point) => now - new Date(point.sampledAt).getTime() <= 24 * 60 * 60 * 1000
  );
  const today = new Date().toISOString().slice(0, 10);
  const samplesToday = points.filter((point) => point.sampledAt.startsWith(today)).length;
  const siteTrackedPeak = storageMode === "d1" ? Math.max(...points.map((point) => point.playerCount)) : null;
  const configuredAllTimePeak = getConfiguredAllTimePeak();

  return {
    site24hPeak:
      storageMode === "d1" && points24h.length
        ? Math.max(...points24h.map((point) => point.playerCount))
        : null,
    displayAllTimePeak:
      siteTrackedPeak !== null && configuredAllTimePeak !== null
        ? Math.max(siteTrackedPeak, configuredAllTimePeak)
        : siteTrackedPeak ?? configuredAllTimePeak,
    siteTrackedPeak,
    samplesToday,
    historyAvailable: points.length >= 2,
    storageMode,
  };
}

export async function getPlayerCountPayload(appId: string) {
  const sampledAt = new Date().toISOString();
  const current = await fetchCurrentPlayers(appId);

  await recordSample(appId, current, sampledAt);
  const history = await readHistory(appId);
  const summary = summarizeHistory(history);

  return {
    current,
    source: "Steam",
    lastUpdated: sampledAt,
    ...summary,
  };
}

export async function getPlayerHistoryPayload(appId: string, days = HISTORY_DAYS) {
  const history = await readHistory(appId, days);
  const summary = summarizeHistory(history);

  return {
    points: history,
    historyAvailable: summary.historyAvailable,
  };
}
