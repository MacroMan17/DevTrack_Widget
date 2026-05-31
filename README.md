# 🚀 DevTrack Widget

> **Track your coding progress at a glance** — A sleek, always-on-top desktop widget for Windows that monitors your GitHub and LeetCode activity in real time.

[![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen?style=flat-square)](https://github.com/MacroMan17/DevTrack_Widget)
[![Version](https://img.shields.io/badge/Version-1.0.1-blue?style=flat-square)](https://github.com/MacroMan17/DevTrack_Widget/releases)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Windows](https://img.shields.io/badge/Platform-Windows%2010%2B-0078D4?style=flat-square)](https://github.com/MacroMan17/DevTrack_Widget)

---

## ✨ Features

### 📊 Real-Time Tracking
- **GitHub Integration** — Commit history, contribution heatmap, streaks, top language
- **LeetCode Integration** — Problem-solving stats, submission calendar, ranking
- **Live Updates** — Auto-refresh every 5 minutes (configurable)

### 🎨 User Experience
- **Always On Top** — Floats over all windows for quick access
- **Draggable & Resizable** — Move and resize to fit your workflow
- **Compact Mode** — Toggle between full and minimal view
- **System Tray** — Minimize to tray, launch from taskbar
- **Dark Theme** — Easy on the eyes, modern design

### ⚡ Performance
- **Lightweight** — ~200 KB bundle size
- **Fast Startup** — Launches in under 2 seconds
- **Low Memory** — Uses <100 MB RAM
- **Request Caching** — Smart caching reduces API calls

---

## 🎯 Quick Start

### Prerequisites
- **Windows 10 or later**
- **Node.js 18+** ([Download](https://nodejs.org))

### Installation

#### Option 1: Download Installer (Recommended)
1. Download `DevTrack Widget Setup 1.0.1.exe` from [Releases](https://github.com/MacroMan17/DevTrack_Widget/releases)
2. Run the installer
3. Launch from Start Menu or Desktop shortcut
4. Enter your GitHub and LeetCode usernames in Settings

#### Option 2: Run from Source
```bash
# Clone the repository
git clone https://github.com/MacroMan17/DevTrack_Widget.git
cd DevTrack_Widget

# Install dependencies
npm install

# Start development server
npm run dev

# Build installer
npm run build:exe
```

### First-Time Setup
1. Click the **⚙️ Settings** button
2. Enter your **GitHub username**
3. Enter your **LeetCode username**
4. Click **Save** — data loads automatically

---

## 📸 Screenshots

### GitHub Card
- 📈 Contribution sparkline (30d/90d toggle)
- 🔥 Current & longest commit streaks
- 🗺️ Contribution heatmap with GitHub's native colors
- 💻 Top programming language badge
- 📊 Commits delta (this week vs last week)

### LeetCode Card
- 📊 Problem-solving breakdown (Easy/Medium/Hard)
- 📅 Submission calendar heatmap
- 🔥 Current & longest solving streaks
- 🏆 Global ranking
- 📈 Difficulty progress bar

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| **Desktop** | Electron 28 |
| **UI** | React 18 + Vite 5 |
| **Styling** | CSS Variables + Animations |
| **Storage** | electron-store |
| **APIs** | GitHub REST + LeetCode GraphQL |
| **Packaging** | electron-builder |

---

## 📁 Project Structure

```
devtrack-widget/
├── 📄 main.js              Electron main process
├── 📄 preload.js           Secure IPC bridge
├── 📄 vite.config.js       Build configuration
├── 📄 index.html           HTML entry point
├── 📄 package.json         Dependencies & scripts
│
└── src/
    ├── 📄 App.jsx          Root component
    ├── 📄 styles.css       Global styles
    ├── 📁 components/      React components
    │   ├── TitleBar.jsx
    │   ├── GitHubCard.jsx
    │   ├── LeetCodeCard.jsx
    │   ├── SettingsPanel.jsx
    │   └── ErrorBoundary.jsx
    ├── 📁 utils/           Utilities
    │   ├── api.js          API functions
    │   └── cache.js        Caching system
    └── 📁 assets/          Icons & images
```

---

## 🚀 Build & Distribution

### Development
```bash
npm run dev          # Start dev server with hot reload
```

### Production Build
```bash
npm run build        # Build React app
npm run build:exe    # Create Windows installer
```

Output: `dist/DevTrack Widget Setup 1.0.1.exe`

---

## ⚙️ Configuration

### API Settings
- **GitHub**: Uses public REST API (60 req/hour unauthenticated)
- **LeetCode**: Uses public GraphQL endpoint
- **Caching**: 5-minute TTL to reduce API calls
- **Timeout**: 10-second timeout on all requests

### Customization
Edit `src/styles.css` to customize:
- Colors and themes
- Font sizes and families
- Spacing and layout
- Animation speeds

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| **App won't start** | Check Windows Defender/Antivirus, try running as Admin |
| **No data showing** | Verify usernames are correct, check internet connection |
| **GitHub rate limited** | Wait 1 hour or add GitHub token to `src/utils/api.js` |
| **LeetCode profile not found** | Ensure profile is public on LeetCode |
| **Build fails** | Delete `node_modules`, run `npm install` again |

---

## 📝 API Notes

### GitHub
- **Endpoint**: GitHub REST API v3
- **Auth**: Optional (60 req/hour without token)
- **Data**: Public profile, repositories, events
- **Rate Limit**: Handled gracefully with caching

### LeetCode
- **Endpoint**: LeetCode GraphQL API
- **Auth**: Not required for public profiles
- **Data**: Problem stats, submission calendar, ranking
- **Note**: Unofficial API, may change without notice

---

## 🔒 Security & Privacy

- ✅ **No data collection** — All data stays on your machine
- ✅ **No authentication** — Uses public APIs only
- ✅ **Secure IPC** — Context isolation enabled
- ✅ **No sensitive data** — Usernames only, no passwords
- ✅ **Open source** — Audit the code anytime

---

## 📊 Performance

- **Bundle Size**: 202 KB (58 KB gzipped)
- **Memory Usage**: <100 MB
- **Startup Time**: <2 seconds
- **API Calls**: Cached to reduce network usage
- **CPU Usage**: Minimal when idle

---

## 🎓 Learning Resources

This project demonstrates:
- Electron desktop app development
- React component architecture
- Vite build optimization
- API integration & caching
- Error handling & recovery
- Windows packaging & distribution

---

## 📄 License

MIT License — Free to use, modify, and distribute.

See [LICENSE](LICENSE) for details.

---

## 🤝 Contributing

Found a bug? Have a feature idea? 

1. [Open an Issue](https://github.com/MacroMan17/DevTrack_Widget/issues)
2. [Create a Pull Request](https://github.com/MacroMan17/DevTrack_Widget/pulls)

---

## 📞 Support

- 📖 **Documentation**: See [INSTALL.md](INSTALL.md)
- 🐛 **Report Issues**: [GitHub Issues](https://github.com/MacroMan17/DevTrack_Widget/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/MacroMan17/DevTrack_Widget/discussions)

---

## 🎉 Status

✅ **Production Ready** — v1.0.1  
✅ **Fully Tested** — Windows 10/11  
✅ **Feature Complete** — GitHub & LeetCode tracking  
✅ **Performance Optimized** — Caching & timeouts  
✅ **Error Handling** — Graceful degradation  

**Ready for distribution and daily use!**

---

<div align="center">

**Made with ❤️ by [Sumit Pathak](https://github.com/MacroMan17)**

[⬆ Back to top](#-devtrack-widget)

</div>
