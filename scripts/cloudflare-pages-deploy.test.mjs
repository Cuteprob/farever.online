import test from "node:test";
import assert from "node:assert/strict";

import {
  classifyPagesEnvVarEntries,
  mergeBuildEnvSources,
  mergeDeployEnvSources,
  parseDotEnv,
  parseWranglerOAuthToken,
  parseWranglerProductionVarNames,
  stripWranglerProductionVarsSection,
  needsProductionBranchUpdate,
  resolveDesiredProductionBranch,
} from "./cloudflare-pages-deploy-lib.mjs";

test("parseDotEnv handles quotes, comments, and blank lines", () => {
  const env = parseDotEnv(`
# comment
PROJECT_ID="farever-online"
NEXT_PUBLIC_SITE_DESCRIPTION="Play instantly"
UNQUOTED=value

`);

  assert.deepEqual(env, {
    PROJECT_ID: "farever-online",
    NEXT_PUBLIC_SITE_DESCRIPTION: "Play instantly",
    UNQUOTED: "value",
  });
});

test("parseWranglerOAuthToken extracts oauth token from Wrangler config", () => {
  const token = parseWranglerOAuthToken(`
oauth_token = "abc123"
expiration_time = "2026-03-28T14:31:23.431Z"
`);

  assert.equal(token, "abc123");
});

test("resolveDesiredProductionBranch prefers explicit env override", () => {
  assert.equal(
    resolveDesiredProductionBranch({
      CF_PAGES_PRODUCTION_BRANCH: "release",
      DEPLOY_BRANCH: "main",
    }),
    "release",
  );
});

test("resolveDesiredProductionBranch falls back to main", () => {
  assert.equal(resolveDesiredProductionBranch({}), "main");
});

test("needsProductionBranchUpdate only updates when branch differs", () => {
  assert.equal(
    needsProductionBranchUpdate({ production_branch: "farever-online" }, "main"),
    true,
  );
  assert.equal(needsProductionBranchUpdate({ production_branch: "main" }, "main"), false);
});

test("parseWranglerProductionVarNames reads env.production vars block", () => {
  const names = parseWranglerProductionVarNames(`
name = "site"

[env.production.vars]
PROJECT_ID="farever-online"
# comment
NEXT_PUBLIC_WEB_URL="https://farever.online"

[env.preview.vars]
PROJECT_ID="preview"
`);

  assert.deepEqual(names, new Set(["PROJECT_ID", "NEXT_PUBLIC_WEB_URL"]));
});

test("stripWranglerProductionVarsSection removes only the production vars block", () => {
  const stripped = stripWranglerProductionVarsSection(`
name = "site"

[env.production.vars]
PROJECT_ID="farever-online"
NEXT_PUBLIC_WEB_URL="https://farever.online"

[env.preview.vars]
PROJECT_ID="preview"
`);

  assert.equal(stripped.includes("[env.production.vars]"), false);
  assert.equal(stripped.includes('[env.preview.vars]'), true);
});

test("classifyPagesEnvVarEntries keeps app variables as plain text", () => {
  const classified = classifyPagesEnvVarEntries({
    NEXT_PUBLIC_WEB_URL: "https://farever.online",
    PROJECT_ID: "farever-online",
    TURSO_DATABASE_URL: "libsql://example",
    TURSO_DATABASE_AUTH_TOKEN: "token",
  });

  assert.deepEqual(classified.plainTextEntries, {
    NEXT_PUBLIC_WEB_URL: "https://farever.online",
    PROJECT_ID: "farever-online",
    TURSO_DATABASE_URL: "libsql://example",
    TURSO_DATABASE_AUTH_TOKEN: "token",
  });
  assert.deepEqual(classified.secretEntries, {});
});

test("mergeDeployEnvSources lets .env.production override .env.local", () => {
  const merged = mergeDeployEnvSources(
    { TURSO_DATABASE_URL: "local-url", PROJECT_ID: "local-project" },
    { PROJECT_ID: "prod-project", NEXT_PUBLIC_WEB_URL: "https://example.com" },
  );

  assert.deepEqual(merged, {
    TURSO_DATABASE_URL: "local-url",
    PROJECT_ID: "prod-project",
    NEXT_PUBLIC_WEB_URL: "https://example.com",
  });
});

test("mergeBuildEnvSources prevents local empty values from overriding production build values", () => {
  const merged = mergeBuildEnvSources(
    { NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: "" },
    { NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: "G-RFCC6WPM1X" },
    {},
  );

  assert.equal(merged.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID, "G-RFCC6WPM1X");
});
