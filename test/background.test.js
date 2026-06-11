const assert = require("node:assert/strict");
const test = require("node:test");

const {
  PULSE_INTERVAL_SECONDS,
  getTeamsTabQueryUrls,
  isTeamsUrl,
  selectTeamsTabForPulse,
  shouldPulseForIdleState,
} = require("../src/background.js");

const SUPPORTED_TEAMS_URL_PATTERNS = [
  "https://teams.microsoft.com.mcas.ms/*",
  "https://teams.microsoft.com/*",
  "https://*.teams.microsoft.com/*",
  "https://teams.live.com/*",
  "https://gov.teams.microsoft.us/*",
  "https://dod.teams.microsoft.us.mcas-gov.us/*",
  "https://teams.cloud.microsoft/*",
];

test("isTeamsUrl accepts supported Teams HTTPS URLs", () => {
  for (const url of [
    "https://teams.microsoft.com.mcas.ms/path",
    "https://teams.microsoft.com/v2/",
    "https://tenant.teams.microsoft.com/_#/calendar",
    "https://teams.live.com/v2/",
    "https://gov.teams.microsoft.us/v2/",
    "https://dod.teams.microsoft.us.mcas-gov.us/v2/",
    "https://teams.cloud.microsoft/v2/",
  ]) {
    assert.equal(isTeamsUrl(url), true, url);
  }
});

test("isTeamsUrl rejects non-Teams and lookalike URLs", () => {
  assert.equal(isTeamsUrl("http://teams.microsoft.com/"), false);
  assert.equal(isTeamsUrl("https://example.com/"), false);
  assert.equal(isTeamsUrl("https://teams.microsoft.com.evil.test/"), false);
  assert.equal(isTeamsUrl("https://teams.live.com.evil.test/"), false);
  assert.equal(isTeamsUrl("not a url"), false);
});

test("shouldPulseForIdleState returns true only while active", () => {
  assert.equal(shouldPulseForIdleState("active"), true);
  assert.equal(shouldPulseForIdleState("idle"), false);
  assert.equal(shouldPulseForIdleState("locked"), false);
  assert.equal(shouldPulseForIdleState(undefined), false);
});

test("getTeamsTabQueryUrls returns the manifest Teams URL patterns", () => {
  assert.deepEqual(getTeamsTabQueryUrls(), SUPPORTED_TEAMS_URL_PATTERNS);
});

test("pulse interval is 120 seconds", () => {
  assert.equal(PULSE_INTERVAL_SECONDS, 120);
});

test("selectTeamsTabForPulse returns only the first valid Teams tab", () => {
  const firstTeamsTab = { id: 3, url: "https://teams.microsoft.com/v2/" };

  assert.equal(
    selectTeamsTabForPulse([
      { id: 1, url: "https://example.com/" },
      firstTeamsTab,
      { id: 4, url: "https://tenant.teams.microsoft.com/_#/calendar" },
    ]),
    firstTeamsTab,
  );
});
