const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const manifest = JSON.parse(
  fs.readFileSync(path.join(root, "manifest.json"), "utf8"),
);

const SUPPORTED_TEAMS_URL_PATTERNS = [
  "https://teams.microsoft.com.mcas.ms/*",
  "https://teams.microsoft.com/*",
  "https://*.teams.microsoft.com/*",
  "https://teams.live.com/*",
  "https://gov.teams.microsoft.us/*",
  "https://dod.teams.microsoft.us.mcas-gov.us/*",
  "https://teams.cloud.microsoft/*",
];

test("manifest declares Chrome extension icon sizes", () => {
  assert.deepEqual(manifest.icons, {
    16: "icons/icon-16.png",
    48: "icons/icon-48.png",
    128: "icons/icon-128.png",
  });
});

test("manifest icon files exist", () => {
  for (const iconPath of Object.values(manifest.icons)) {
    assert.equal(fs.existsSync(path.join(root, iconPath)), true, iconPath);
  }
});

test("manifest limits host permissions to supported Teams URLs", () => {
  assert.deepEqual(manifest.host_permissions, SUPPORTED_TEAMS_URL_PATTERNS);
});

test("content script runs on supported Teams URLs", () => {
  assert.deepEqual(
    manifest.content_scripts.flatMap((script) => script.matches),
    SUPPORTED_TEAMS_URL_PATTERNS,
  );
});

test("dist build script exists", () => {
  assert.equal(
    fs.existsSync(path.join(root, "scripts", "build-dist.ps1")),
    true,
  );
});
