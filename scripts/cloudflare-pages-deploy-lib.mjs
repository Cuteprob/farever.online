import fs from "node:fs";
import os from "node:os";
import path from "node:path";

export function parseDotEnv(input) {
  const entries = {};

  for (const rawLine of input.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const separatorIndex = line.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    entries[key] = value;
  }

  return entries;
}

export function parseWranglerOAuthToken(configText) {
  const match = configText.match(/^oauth_token = "([^"]+)"$/m);
  return match ? match[1] : "";
}

export function parseWranglerProductionVarNames(wranglerToml) {
  const sectionMatch = wranglerToml.match(/^\[env\.production\.vars\]\s*([\s\S]*?)(?=^\[|\Z)/m);
  if (!sectionMatch) {
    return new Set();
  }

  const names = new Set();
  for (const rawLine of sectionMatch[1].split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const match = line.match(/^([A-Z0-9_]+)\s*=/);
    if (match) {
      names.add(match[1]);
    }
  }

  return names;
}

export function stripWranglerProductionVarsSection(wranglerToml) {
  return wranglerToml.replace(/^\[env\.production\.vars\]\s*[\s\S]*?(?=^\[|\Z)/m, "").trimEnd() + "\n";
}

export function classifyPagesEnvVarEntries(entries) {
  const plainTextEntries = {};
  const secretEntries = {};

  for (const [key, value] of Object.entries(entries)) {
    const isSecret = !key.startsWith("NEXT_PUBLIC_");

    if (isSecret) {
      secretEntries[key] = value;
    } else {
      plainTextEntries[key] = value;
    }
  }

  return { plainTextEntries, secretEntries };
}

export function mergeDeployEnvSources(localEntries, productionEntries) {
  return {
    ...localEntries,
    ...productionEntries,
  };
}

export function resolveDesiredProductionBranch(env) {
  return env.CF_PAGES_PRODUCTION_BRANCH || env.DEPLOY_BRANCH || "main";
}

export function needsProductionBranchUpdate(project, desiredBranch) {
  return project.production_branch !== desiredBranch;
}

export function readWranglerOAuthToken() {
  const configPath = path.join(os.homedir(), ".wrangler", "config", "default.toml");
  const configText = fs.readFileSync(configPath, "utf8");
  const token = parseWranglerOAuthToken(configText);

  if (!token) {
    throw new Error(`Could not find oauth_token in ${configPath}`);
  }

  return token;
}
