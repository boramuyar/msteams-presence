const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const manifest = JSON.parse(
  fs.readFileSync(path.join(root, "manifest.json"), "utf8"),
);

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
