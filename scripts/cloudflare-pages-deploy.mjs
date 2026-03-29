import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

import {
  classifyPagesEnvVarEntries,
  mergeDeployEnvSources,
  parseDotEnv,
  readWranglerOAuthToken,
  resolveDesiredProductionBranch,
  stripWranglerProductionVarsSection,
  needsProductionBranchUpdate,
} from "./cloudflare-pages-deploy-lib.mjs";

const cwd = process.cwd();
const projectRoot = cwd;
const envProductionPath = path.join(projectRoot, ".env.production");
const envLocalPath = path.join(projectRoot, ".env.local");
const buildOutputDir = path.join(projectRoot, ".vercel", "output", "static");
const wranglerTomlPath = path.join(projectRoot, "wrangler.toml");

function run(command, args, options = {}) {
  return execFileSync(command, args, {
    cwd: projectRoot,
    stdio: options.capture ? ["inherit", "pipe", "inherit"] : "inherit",
    encoding: "utf8",
  });
}

function readRequiredFile(filePath, label) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`${label} not found at ${filePath}`);
  }
  return fs.readFileSync(filePath, "utf8");
}

function readOptionalEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  return parseDotEnv(fs.readFileSync(filePath, "utf8"));
}

function getDeployEnvironmentEntries() {
  const localEntries = readOptionalEnvFile(envLocalPath);
  const productionEntries = parseDotEnv(readRequiredFile(envProductionPath, ".env.production"));
  return mergeDeployEnvSources(localEntries, productionEntries);
}

function getProjectName(wranglerToml) {
  const match = wranglerToml.match(/^name\s*=\s*"([^"]+)"$/m);
  if (!match) {
    throw new Error("Could not read Pages project name from wrangler.toml");
  }
  return match[1];
}

function getAccountId() {
  const whoamiOutput = run("npx", ["wrangler", "whoami"], { capture: true });
  const match = whoamiOutput.match(/[a-f0-9]{32}/);
  if (!match) {
    throw new Error("Could not determine Cloudflare account ID from `wrangler whoami`");
  }
  return match[0];
}

function getBearerToken() {
  return process.env.CLOUDFLARE_API_TOKEN || readWranglerOAuthToken();
}

function callCloudflareApi(method, urlPath, body) {
  const token = getBearerToken();
  const accountId = getAccountId();
  const args = [
    "-sS",
    "-X",
    method,
    `https://api.cloudflare.com/client/v4/accounts/${accountId}${urlPath}`,
    "-H",
    `Authorization: Bearer ${token}`,
  ];

  if (body !== undefined) {
    args.push("-H", "Content-Type: application/json", "-d", JSON.stringify(body));
  }

  const responseText = run("curl", args, { capture: true });

  const response = JSON.parse(responseText);
  if (!response.success) {
    throw new Error(`Cloudflare API request failed: ${JSON.stringify(response.errors || response)}`);
  }

  return response.result;
}

function isCloudflareAuthError(error) {
  return error instanceof Error && /Authentication error/i.test(error.message);
}

function fetchPagesProject(projectName) {
  return callCloudflareApi("GET", `/pages/projects/${projectName}`);
}

function updateProductionBranch(projectName, desiredBranch) {
  return callCloudflareApi("PATCH", `/pages/projects/${projectName}`, {
    name: projectName,
    production_branch: desiredBranch,
  });
}

function syncProductionEnv(projectName) {
  const envProduction = getDeployEnvironmentEntries();
  const { plainTextEntries, secretEntries } = classifyPagesEnvVarEntries(envProduction);

  if (Object.keys(plainTextEntries).length > 0) {
    const envVarsPayload = Object.fromEntries(
      Object.entries(plainTextEntries).map(([key, value]) => [
        key,
        { type: "plain_text", value },
      ]),
    );

    callCloudflareApi("PATCH", `/pages/projects/${projectName}`, {
      deployment_configs: {
        production: {
          env_vars: envVarsPayload,
        },
      },
    });
  }

  for (const key of Object.keys(plainTextEntries)) {
    try {
      run(
        "npx",
        ["wrangler", "pages", "secret", "delete", key, "--project-name", projectName],
        { capture: true },
      );
    } catch {
      // Ignore missing-secret deletes so deploy stays idempotent.
    }
  }

  if (Object.keys(secretEntries).length === 0) {
    return;
  }

  const tempSecretsPath = path.join(projectRoot, ".cf-pages-secrets.production.tmp");
  fs.writeFileSync(
    tempSecretsPath,
    Object.entries(secretEntries)
      .map(([key, value]) => `${key}=${value}`)
      .join("\n"),
  );

  try {
    run("npx", [
      "wrangler",
      "pages",
      "secret",
      "bulk",
      tempSecretsPath,
      "--project-name",
      projectName,
    ]);
  } finally {
    fs.rmSync(tempSecretsPath, { force: true });
  }
}

function createDeployConfigContents() {
  const wranglerToml = readRequiredFile(wranglerTomlPath, "wrangler.toml");
  return stripWranglerProductionVarsSection(wranglerToml);
}

function buildPagesOutput() {
  run("pnpm", ["run", "pages:build"]);

  if (!fs.existsSync(buildOutputDir)) {
    throw new Error(`Pages build output not found at ${buildOutputDir}`);
  }
}

function withTemporarilyHiddenFiles(filePaths, callback) {
  const hiddenFiles = [];

  try {
    for (const filePath of filePaths) {
      if (!fs.existsSync(filePath)) continue;

      const hiddenPath = `${filePath}.deploy-hide`;
      fs.renameSync(filePath, hiddenPath);
      hiddenFiles.push({ filePath, hiddenPath });
    }

    return callback();
  } finally {
    for (const { filePath, hiddenPath } of hiddenFiles.reverse()) {
      if (fs.existsSync(hiddenPath)) {
        fs.renameSync(hiddenPath, filePath);
      }
    }
  }
}

function deployProduction(projectName, branch) {
  const commitMessage =
    process.env.CF_PAGES_COMMIT_MESSAGE || `Deploy ${projectName} to production`;

  run("npx", [
    "wrangler",
    "pages",
    "deploy",
    buildOutputDir,
    "--project-name",
    projectName,
    "--branch",
    branch,
    "--commit-dirty",
    "--commit-message",
    commitMessage,
  ]);
}

function main() {
  const wranglerToml = readRequiredFile(wranglerTomlPath, "wrangler.toml");
  const projectName = process.env.CF_PAGES_PROJECT || getProjectName(wranglerToml);
  const desiredBranch = resolveDesiredProductionBranch(process.env);
  let canUseCloudflareApi = true;

  try {
    const project = fetchPagesProject(projectName);
    if (needsProductionBranchUpdate(project, desiredBranch)) {
      console.log(
        `Updating Cloudflare Pages production branch from ${project.production_branch} to ${desiredBranch}...`,
      );
      updateProductionBranch(projectName, desiredBranch);
    }
  } catch (error) {
    if (!isCloudflareAuthError(error)) {
      throw error;
    }

    canUseCloudflareApi = false;
    console.warn(
      "Cloudflare API auth is unavailable for project/env sync. Falling back to direct production deploy with Wrangler only.",
    );
  }

  console.log("Building Cloudflare Pages output...");
  buildPagesOutput();

  if (canUseCloudflareApi) {
    console.log("Syncing production environment from .env.production...");
    syncProductionEnv(projectName);
  } else {
    console.log("Skipping Cloudflare API env sync and using existing Pages production environment.");
  }

  const originalWranglerToml = readRequiredFile(wranglerTomlPath, "wrangler.toml");
  const deployWranglerToml = createDeployConfigContents();
  try {
    fs.writeFileSync(wranglerTomlPath, deployWranglerToml);
    console.log(`Deploying ${projectName} to production branch ${desiredBranch}...`);
    withTemporarilyHiddenFiles(
      [path.join(projectRoot, ".env.production"), path.join(projectRoot, ".env.local")],
      () => deployProduction(projectName, desiredBranch),
    );
  } finally {
    fs.writeFileSync(wranglerTomlPath, originalWranglerToml);
  }
}

main();
