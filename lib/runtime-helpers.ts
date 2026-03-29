export function normalizeHostname(value: string): string {
  if (!value) {
    return "";
  }

  try {
    const url = value.includes("://") ? new URL(value) : new URL(`https://${value}`);
    return url.hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return value
      .replace(/^https?:\/\//, "")
      .replace(/\/.*$/, "")
      .replace(/:\d+$/, "")
      .replace(/^www\./, "")
      .toLowerCase();
  }
}

export function shouldLoadThirdPartyScripts(currentHost: string, siteUrl: string): boolean {
  const normalizedCurrentHost = normalizeHostname(currentHost);
  const normalizedSiteHost = normalizeHostname(siteUrl);

  return Boolean(normalizedCurrentHost && normalizedSiteHost && normalizedCurrentHost === normalizedSiteHost);
}

export function sanitizeMarkdownDomProps<T extends Record<string, unknown>>(props: T): Record<string, unknown> {
  const {
    node,
    inline,
    ordered,
    index,
    checked,
    depth,
    isHeader,
    ...safeProps
  } = props;

  void node;
  void inline;
  void ordered;
  void index;
  void checked;
  void depth;
  void isHeader;

  return safeProps;
}
