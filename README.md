# ◈ DevTrack Widget

A lightweight, always-on-top floating desktop widget for Windows that tracks your GitHub and LeetCode progress in real time.

---

## Features

- **Always on top** — floats over all other windows
- **Draggable** — click and drag the title bar to move
- **Resizable** — drag edges to resize
- **Minimizes to system tray** — stays out of the way
- **GitHub stats** — repos, followers, recent commits (30 days)
- **LeetCode stats** — total solved, easy/medium/hard, streak, ranking
- **Compact mode** — toggle between full and compact view
- **Auto-refresh** — every 2, 5, 10, or 30 minutes
- **Dark theme** — easy on the eyes

---

## Folder Structure

```
devtrack-widget/
├── main.js              ← Electron main process (window, tray, IPC)
├── preload.js           ← Secure bridge between Electron and React
├── vite.config.js       ← Vite build config
├── index.html           ← HTML entry point
├── package.json         ← Dependencies and scripts
│
└── src/
    ├── main.jsx         ← React entry point
    ├── App.jsx          ← Root component (layout + data fetching)
    ├── styles.css       ← Global CSS variables and animations
    │
    ├── assets/
    │   └── tray-icon.png
    │
    ├── components/
    │   ├── TitleBar.jsx      ← Window chrome (drag, controls)
    │   ├── GitHubCard.jsx    ← GitHub stats card
    │   ├── LeetCodeCard.jsx  ← LeetCode stats card
    │   └── SettingsPanel.jsx ← Username inputs + settings
    │
    └── utils/
        └── api.js        ← GitHub REST API + LeetCode GraphQL
```

---

## Step-by-Step Setup

### Prerequisites
- **Node.js 18+** — Download from https://nodejs.org
- **npm** — comes with Node.js
- **Git** (optional)

### 1. Install Dependencies

Open a terminal (Command Prompt or PowerShell) in the project folder:

```bash
cd devtrack-widget
npm install
```

This installs Electron, React, Vite, and all other dependencies (~300 MB, takes 1–2 minutes).

### 2. Run in Development Mode

```bash
npm run dev
```

This starts:
1. The Vite React dev server on `http://localhost:5173`
2. Electron, which loads the React app

The widget window will appear. Changes to React files hot-reload instantly.

### 3. First-Time Setup

1. Click the **⚙** (settings) button in the widget title bar
2. Enter your **GitHub username** (e.g. `torvalds`)
3. Enter your **LeetCode username** (e.g. `neal_wu`)
4. Click **Save & Refresh**

Usernames are saved locally on your machine (no account needed).

---

## Building the .exe File

### One-time setup: install electron-builder

Already included in `package.json` devDependencies, so `npm install` handles it.

### Build the installer

```bash
npm run build:exe
```

This does two things:
1. `vite build` — compiles React to the `dist/` folder
2. `electron-builder --win` — packages everything into a Windows installer

### Output

The `.exe` installer will be in:
```
dist-electron/
└── DevTrack Widget Setup 1.0.0.exe
```

Double-click it to install. The app installs to `Program Files` and creates a Start Menu shortcut.

---

## Auto-Start with Windows

To make the widget launch on login:

1. Press `Win + R`, type `shell:startup`, press Enter
2. Create a shortcut to `DevTrack Widget.exe` in that folder

Or in the app (future enhancement): Settings → Launch on startup.

---

## API Notes

### GitHub
- Uses the official [GitHub REST API](https://docs.github.com/en/rest)
- **No authentication required** for public profile data
- Rate limit: **60 requests/hour** for unauthenticated requests
- If you hit the rate limit, the widget shows a friendly error and retries on next refresh

### LeetCode
- Uses LeetCode's **GraphQL endpoint** (`https://leetcode.com/graphql`)
- This is an unofficial/undocumented API — it works for public profile data
- No API key needed for public profiles

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `npm install` fails | Make sure Node.js 18+ is installed: `node --version` |
| Widget doesn't appear | Check if there's an error in the terminal |
| GitHub user not found | Double-check the username (case-sensitive) |
| LeetCode data missing | Make sure your LeetCode profile is **public** |
| Build fails | Delete `node_modules` and run `npm install` again |
| Rate limited by GitHub | Wait an hour, or add a GitHub token to the API headers in `src/utils/api.js` |

---

## Customization

### Change refresh interval
In the Settings panel (⚙ button), pick 2m, 5m, 10m, or 30m.

### Change widget size
Drag the window edges to resize. The minimum size is 280 × 400 px.

### Modify the design
Edit CSS variables in `src/styles.css` to change colors, fonts, and spacing.

### Add a GitHub token (for higher rate limits)
In `src/utils/api.js`, add to the fetch headers:
```js
'Authorization': 'token YOUR_GITHUB_TOKEN_HERE'
```
This raises the rate limit from 60 to 5,000 requests/hour.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Desktop shell | [Electron](https://electronjs.org) v28 |
| UI framework | [React](https://react.dev) v18 |
| Build tool | [Vite](https://vitejs.dev) v5 |
| Packaging | [electron-builder](https://www.electron.build) |
| Storage | [electron-store](https://github.com/sindresorhus/electron-store) |
| Fonts | JetBrains Mono + Syne (Google Fonts) |

---

## License

MIT — free to use, modify, and distribute.
