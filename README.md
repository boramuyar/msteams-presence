# MS Teams Presence

MS Teams Presence is a minimal Chrome Manifest V3 extension for the Microsoft Teams web client. While Chrome reports the system as active, the extension sends small synthetic mouse movement events to one open Teams tab.

The extension stops when Chrome reports the system as idle or locked.

## Behavior

- Wakes every 120 seconds with `chrome.alarms`.
- Calls `chrome.idle.queryState(60)` before sending any activity pulse.
- Sends pulses only when Chrome reports `active`.
- Sends each pulse to one Teams tab only, even when multiple Teams tabs are open.
- Targets only Teams web URLs:
  - `https://teams.microsoft.com/*`
  - `https://*.teams.microsoft.com/*`

## Icon

The extension uses a small custom icon: a purple tile with a movement mark and green availability dot. Source and Chrome icon sizes live in `icons/`.

## Install in Chrome

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select this folder: `E:/lab/chrome/msteams-presence`.
5. Open or reload Microsoft Teams in Chrome.

## Permissions

- `idle`: checks whether Chrome reports the system as active, idle, or locked.
- `alarms`: wakes the Manifest V3 service worker every 120 seconds.
- `tabs`: finds open Teams tabs and sends one tab a pulse message.
- Teams host permissions: limits the extension to Teams web pages.

## Tests

Run all tests:

```bash
node --test
```

Run focused tests:

```bash
node --test test/background.test.js
node --test test/content.test.js
```

## Policy note

Use this extension only where your organization or local policy allows it.
