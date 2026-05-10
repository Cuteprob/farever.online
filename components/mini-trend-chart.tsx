"use client";

import { useCallback, useRef, useState } from "react";

interface TrendPoint {
  sampledAt: string;
  playerCount: number;
}

interface MiniTrendChartProps {
  points: TrendPoint[];
}

function buildPath(points: TrendPoint[], width: number, height: number, padding: number) {
  if (points.length < 2) {
    return "";
  }

  const counts = points.map((point) => point.playerCount);
  const min = Math.min(...counts);
  const max = Math.max(...counts);
  const range = Math.max(max - min, 1);

  return points
    .map((point, index) => {
      const x = padding + (index / (points.length - 1)) * (width - padding * 2);
      const y = height - padding - ((point.playerCount - min) / range) * (height - padding * 2);
      return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

function pointAt(points: TrendPoint[], index: number, width: number, height: number, padding: number) {
  const counts = points.map((p) => p.playerCount);
  const min = Math.min(...counts);
  const max = Math.max(...counts);
  const range = Math.max(max - min, 1);

  const x = padding + (index / (points.length - 1)) * (width - padding * 2);
  const y = height - padding - ((points[index].playerCount - min) / range) * (height - padding * 2);
  return { x, y };
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(d);
}

export function MiniTrendChart({ points }: MiniTrendChartProps) {
  const width = 320;
  const height = 104;
  const padding = 10;
  const path = buildPath(points, width, height, padding);
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const scaleX = width / rect.width;
      const mouseX = (e.clientX - rect.left) * scaleX;

      let nearest = 0;
      let nearestDist = Infinity;
      for (let i = 0; i < points.length; i++) {
        const px = padding + (i / (points.length - 1)) * (width - padding * 2);
        const dist = Math.abs(mouseX - px);
        if (dist < nearestDist) {
          nearestDist = dist;
          nearest = i;
        }
      }
      setHoverIndex(nearest);
    },
    [points, width, padding],
  );

  const handleMouseLeave = useCallback(() => {
    setHoverIndex(null);
  }, []);

  if (points.length < 2 || !path) {
    return (
      <div className="flex h-[104px] items-center justify-center rounded-xl border border-theme-dark-600 bg-theme-dark-900/60 text-center text-xs text-muted-foreground">
        Site-tracked samples will appear after enough history is collected.
      </div>
    );
  }

  const tooltipData = hoverIndex !== null ? pointAt(points, hoverIndex, width, height, padding) : null;
  const hoverPoint = hoverIndex !== null ? points[hoverIndex] : null;

  const tooltipLeftPct = tooltipData ? (tooltipData.x / width) * 100 : 0;
  const tooltipClampedPct = Math.max(12, Math.min(88, tooltipLeftPct));
  const tooltipAtEdge = tooltipClampedPct !== tooltipLeftPct;
  const tooltipTop = tooltipData ? Math.max(4, tooltipData.y - 50) : 0;
  const tooltipBottom = tooltipData ? Math.min(height - 38, tooltipData.y + 12) : 0;
  const tooltipBelowPoint = tooltipData ? tooltipData.y < 38 : false;

  return (
    <div className="rounded-xl border border-theme-dark-600 bg-theme-dark-900/60 p-2">
      <div className="relative">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="h-[104px] w-full"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            <linearGradient id="trendLine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsla(195, 90%, 65%, 0.9)" />
              <stop offset="100%" stopColor="hsla(270, 60%, 65%, 0.95)" />
            </linearGradient>
          </defs>

          {/* baseline */}
          <path
            d={`M ${padding} ${height / 2} H ${width - padding}`}
            stroke="hsla(230, 15%, 30%, 0.65)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />

          {/* trend curve */}
          <path
            d={path}
            fill="none"
            stroke="url(#trendLine)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* wider invisible hit area for easier hover */}
          <path
            d={path}
            fill="none"
            stroke="transparent"
            strokeWidth="24"
          />

          {/* vertical guide line */}
          {tooltipData && (
            <line
              x1={tooltipData.x}
              y1={padding}
              x2={tooltipData.x}
              y2={height - padding}
              stroke="hsla(230, 15%, 60%, 0.5)"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
          )}

          {/* hover dot */}
          {tooltipData && (
            <circle
              cx={tooltipData.x}
              cy={tooltipData.y}
              r="4"
              fill="white"
              stroke="hsla(270, 60%, 65%, 1)"
              strokeWidth="2"
            />
          )}
        </svg>

        {/* tooltip */}
        {hoverPoint && tooltipData && (
          <div
            className="pointer-events-none absolute z-10 whitespace-nowrap rounded-lg border border-theme-dark-500 bg-theme-dark-800/95 px-3 py-1.5 text-xs shadow-lg backdrop-blur-sm"
            style={{
              left: `${tooltipClampedPct}%`,
              transform: tooltipAtEdge ? "translateX(0)" : "translateX(-50%)",
              top: tooltipBelowPoint ? `${tooltipBottom}px` : `${tooltipTop}px`,
            }}
          >
            <div className="font-semibold text-white tabular-nums">
              {hoverPoint.playerCount.toLocaleString()} players
            </div>
            <div className="text-muted-foreground">
              {formatDate(hoverPoint.sampledAt)}
            </div>
          </div>
        )}
      </div>

      <div className="mt-1 flex items-center justify-between px-1 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
        <span>7D Start</span>
        <span>7D Trend</span>
        <span>Now</span>
      </div>
    </div>
  );
}
