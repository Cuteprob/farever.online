"use client";

type SourceBadgeType =
  | "official"
  | "official-news"
  | "community"
  | "site-tracked"
  | "needs-testing";

const badgeStyles: Record<SourceBadgeType, string> = {
  official: "source-badge-verified",
  "official-news": "source-badge-verified",
  community: "source-badge-community",
  "site-tracked": "source-badge-unverified",
  "needs-testing": "source-badge-needstest",
};

const badgeLabels: Record<SourceBadgeType, string> = {
  official: "Official Steam",
  "official-news": "Official News",
  community: "Community Reported",
  "site-tracked": "Site-Tracked",
  "needs-testing": "Needs Testing",
};

interface SourceBadgeProps {
  type: SourceBadgeType;
  label?: string;
}

export function SourceBadge({ type, label }: SourceBadgeProps) {
  return <span className={badgeStyles[type]}>{label || badgeLabels[type]}</span>;
}

