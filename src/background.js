const ACTIVITY_PULSE = "activity-pulse";
const ALARM_NAME = ACTIVITY_PULSE;
const IDLE_THRESHOLD_SECONDS = 60;
const PULSE_INTERVAL_SECONDS = 120;
const PULSE_INTERVAL_MINUTES = PULSE_INTERVAL_SECONDS / 60;
const TEAMS_TAB_QUERY_URLS = [
  "https://teams.microsoft.com.mcas.ms/*",
  "https://teams.microsoft.com/*",
  "https://*.teams.microsoft.com/*",
  "https://teams.live.com/*",
  "https://gov.teams.microsoft.us/*",
  "https://dod.teams.microsoft.us.mcas-gov.us/*",
  "https://teams.cloud.microsoft/*",
];
const EXACT_TEAMS_HOSTS = new Set([
  "teams.microsoft.com.mcas.ms",
  "teams.microsoft.com",
  "teams.live.com",
  "gov.teams.microsoft.us",
  "dod.teams.microsoft.us.mcas-gov.us",
  "teams.cloud.microsoft",
]);

function getTeamsTabQueryUrls() {
  return [...TEAMS_TAB_QUERY_URLS];
}

function isTeamsUrl(rawUrl) {
  try {
    const url = new URL(rawUrl);
    return (
      url.protocol === "https:" &&
      (EXACT_TEAMS_HOSTS.has(url.hostname) ||
        url.hostname.endsWith(".teams.microsoft.com"))
    );
  } catch {
    return false;
  }
}

function shouldPulseForIdleState(state) {
  return state === "active";
}

function selectTeamsTabForPulse(tabs) {
  return tabs.find((tab) => typeof tab.id === "number" && isTeamsUrl(tab.url));
}

function createPulseAlarm() {
  chrome.alarms.create(ALARM_NAME, {
    delayInMinutes: PULSE_INTERVAL_MINUTES,
    periodInMinutes: PULSE_INTERVAL_MINUTES,
  });
}

function sendPulseToTab(tab) {
  if (typeof tab.id !== "number" || !isTeamsUrl(tab.url)) {
    return;
  }

  chrome.tabs.sendMessage(tab.id, { type: ACTIVITY_PULSE }, () => {
    void chrome.runtime.lastError;
  });
}

function pulseTeamsTabs() {
  chrome.idle.queryState(IDLE_THRESHOLD_SECONDS, (state) => {
    if (!shouldPulseForIdleState(state)) {
      return;
    }

    chrome.tabs.query({ url: getTeamsTabQueryUrls() }, (tabs) => {
      const tab = selectTeamsTabForPulse(tabs);

      if (tab) {
        sendPulseToTab(tab);
      }
    });
  });
}

function handleAlarm(alarm) {
  if (alarm.name !== ALARM_NAME) {
    return;
  }

  pulseTeamsTabs();
}

function registerChromeListeners() {
  chrome.runtime.onInstalled.addListener(createPulseAlarm);
  chrome.runtime.onStartup.addListener(createPulseAlarm);
  chrome.alarms.onAlarm.addListener(handleAlarm);
}

if (typeof chrome !== "undefined" && chrome.runtime?.id) {
  registerChromeListeners();
}

if (typeof module !== "undefined") {
  module.exports = {
    ACTIVITY_PULSE,
    ALARM_NAME,
    IDLE_THRESHOLD_SECONDS,
    PULSE_INTERVAL_SECONDS,
    getTeamsTabQueryUrls,
    isTeamsUrl,
    selectTeamsTabForPulse,
    shouldPulseForIdleState,
  };
}
