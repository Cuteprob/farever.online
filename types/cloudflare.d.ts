declare module "@cloudflare/next-on-pages" {
  export function getRequestContext(): {
    env: Record<string, unknown>;
    cf: Record<string, unknown>;
    ctx: { waitUntil: (promise: Promise<unknown>) => void };
  };
}
