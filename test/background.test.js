const assert = require("node:assert/strict");
const test = require("node:test");

const {
  getTeamsTabQueryUrls,
  isTeamsUrl,
  shouldPulseForIdleState,
} = require("../src/background.js");

test("isTeamsUrl accepts Teams HTTPS URLs", () => {
  assert.equal(isTeamsUrl("https://teams.microsoft.com/v2/"), true);
  assert.equal(isTeamsUrl("https://tenant.teams.microsoft.com/_#/calendar"), true);
});

test("isTeamsUrl rejects non-Teams and lookalike URLs", () => {
  assert.equal(isTeamsUrl("http://teams.microsoft.com/"), false);
  assert.equal(isTeamsUrl("https://example.com/"), false);
  assert.equal(isTeamsUrl("https://teams.microsoft.com.evil.test/"), false);
  assert.equal(isTeamsUrl("not a url"), false);
});

test("shouldPulseForIdleState returns true only while active", () => {
  assert.equal(shouldPulseForIdleState("active"), true);
  assert.equal(shouldPulseForIdleState("idle"), false);
  assert.equal(shouldPulseForIdleState("locked"), false);
  assert.equal(shouldPulseForIdleState(undefined), false);
});

test("getTeamsTabQueryUrls returns the manifest Teams URL patterns", () => {
  assert.deepEqual(getTeamsTabQueryUrls(), [
    "https://teams.microsoft.com/*",
    "https://*.teams.microsoft.com/*",
  ]);
});
