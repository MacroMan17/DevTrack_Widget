# Installation Guide - DevTrack Widget

How to install and set up DevTrack Widget on your PC.

---

## Quick Start (30 seconds)

### Option 1: Direct Download & Run (Easiest)

1. **Download the app**:
   - Go to: https://github.com/MacroMan17/DevTrack_Widget
   - Click `Code` → `Download ZIP`
   - Extract the ZIP file

2. **Run the app**:
   - Navigate to: `devtrack-widget/dist/win-unpacked/`
   - Double-click `DevTrack Widget.exe`
   - App launches instantly!

3. **First time setup**:
   - Click ⚙️ (settings) in the top-right
   - Enter your GitHub username
   - Enter your LeetCode username
   - Click "Save" — done!

---

## Installation Methods

### Method 1: Direct Executable (Recommended)

**Best for**: Quick testing, portable use

**Steps**:
1. Download repository from GitHub
2. Extract the ZIP file
3. Go to: `devtrack-widget/dist/win-unpacked/`
4. Double-click `DevTrack Widget.exe`

**Pros**:
- ✅ No installation needed
- ✅ Runs instantly
- ✅ Portable (can move anywhere)
- ✅ No admin rights required

**Cons**:
- ❌ No desktop shortcut
- ❌ No Start Menu entry

---

### Method 2: Clone from GitHub

**Best for**: Developers, keeping updated

**Steps**:
```bash
# Clone the repository
git clone https://github.com/MacroMan17/DevTrack_Widget.git

# Navigate to the folder
cd devtrack-widget

# Run the app
./dist/win-unpacked/DevTrack\ Widget.exe
```

**Pros**:
- ✅ Easy to update (git pull)
- ✅ Access to source code
- ✅ Can modify and rebuild

**Cons**:
- ❌ Requires Git installed
- ❌ No desktop shortcut

---

### Method 3: Windows Installer (Professional)

**Best for**: Clean installation, desktop shortcuts

**Steps**:

1. **Build the installer** (on your PC):
   ```bash
   npm install
   npm run build:exe
   ```

2. **Find the installer**:
   - Look for: `dist/DevTrack Widget Setup 1.0.0.exe`

3. **Run the installer**:
   - Double-click the `.exe` file
   - Follow the wizard
   - Choose installation folder
   - Click "Install"

4. **App launches automatically**:
   - Desktop shortcut created
   - Start Menu entry created
   - App ready to use

**Pros**:
- ✅ Professional installation
- ✅ Desktop shortcut
- ✅ Start Menu entry
- ✅ Easy uninstall

**Cons**:
- ❌ Requires Node.js to build
- ❌ Takes longer to set up

---

## System Requirements

- **OS**: Windows 10/11 (64-bit)
- **RAM**: 256 MB minimum
- **Disk Space**: ~170 MB
- **Internet**: Required for data fetching

---

## First Time Setup

After launching the app:

1. **Click ⚙️ (Settings)** in the top-right corner

2. **Enter GitHub username**:
   - Your GitHub username (e.g., `torvalds`)
   - Leave blank if you don't want GitHub stats

3. **Enter LeetCode username**:
   - Your LeetCode username (e.g., `neal_wu`)
   - Leave blank if you don't want LeetCode stats

4. **Click "Save"**:
   - Data loads automatically
   - Widget displays your stats

5. **Done!** 🎉
   - Stats update every 5 minutes
   - Click ⟳ to manually refresh

---

## Troubleshooting

### App won't start

**Solution 1**: Run as Administrator
- Right-click `DevTrack Widget.exe`
- Select "Run as administrator"

**Solution 2**: Check Windows Defender
- Windows Defender might block the app
- Add it to exceptions or disable temporarily

**Solution 3**: Reinstall
- Delete the app folder
- Download fresh from GitHub
- Try again

### Data not loading

**Check internet connection**:
- Make sure you're connected to the internet
- Try opening a website in your browser

**Verify usernames**:
- GitHub username is case-sensitive
- LeetCode username must be exact
- Check for typos

**Manual refresh**:
- Click ⟳ button in the widget
- Wait a few seconds for data to load

### GitHub user not found

- Double-check your GitHub username
- Make sure your profile is public
- Try a different username

### LeetCode data missing

- Make sure your LeetCode profile is **public**
- Go to: https://leetcode.com/[your-username]/
- Check if profile is visible

---

## Features

### GitHub Stats
- Public repositories count
- Followers
- Recent commits (last 30 days)
- Commit status today

### LeetCode Stats
- Total problems solved
- Easy/Medium/Hard breakdown
- Current streak
- Global ranking

### Widget Controls
- **⚙️ Settings**: Change usernames
- **⟳ Refresh**: Manually update data
- **Close button**: Minimize to tray
- **Drag title bar**: Move widget
- **Drag edges**: Resize widget

### Tray Menu (Right-click tray icon)
- Show Widget
- Always on Top (toggle)
- Refresh Data
- Quit

---

## Uninstallation

### If using direct executable
- Simply delete the folder
- No cleanup needed

### If using Windows installer
- Go to: Settings → Apps → Apps & features
- Find "DevTrack Widget"
- Click "Uninstall"
- Follow the wizard

---

## Advanced: Build from Source

**For developers who want to modify the app**:

### Prerequisites
- Node.js 16+ (https://nodejs.org)
- Git (https://git-scm.com)

### Build steps

1. **Clone repository**:
   ```bash
   git clone https://github.com/MacroMan17/DevTrack_Widget.git
   cd devtrack-widget
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Development mode** (with hot reload):
   ```bash
   npm run dev
   ```

4. **Production build**:
   ```bash
   npm run build
   ```

5. **Create installer**:
   ```bash
   npm run build:exe
   ```

---

## Support

### Having issues?

1. **Check this guide** — Most common issues are covered above
2. **GitHub Issues** — Report bugs: https://github.com/MacroMan17/DevTrack_Widget/issues
3. **GitHub Discussions** — Ask questions: https://github.com/MacroMan17/DevTrack_Widget/discussions

### Common issues

| Problem | Solution |
|---------|----------|
| App won't start | Run as Administrator |
| Data not loading | Check internet connection |
| GitHub user not found | Verify username spelling |
| LeetCode profile missing | Make profile public |
| Windows Defender blocks it | Add to exceptions |

---

## Tips & Tricks

### Always on Top
- Right-click tray icon
- Toggle "Always on Top"
- Widget stays visible over other windows

### Compact Mode
- Click ⚙️ Settings
- Toggle "Compact Mode"
- Smaller widget display

### Auto-refresh
- Click ⚙️ Settings
- Change "Refresh Interval"
- Options: 2, 5, 10, 30 minutes

### Move Widget
- Click and drag the title bar
- Widget follows your mouse
- Release to place

### Resize Widget
- Drag the edges
- Minimum size: 280 × 400 pixels
- Resize to your preference

---

## Performance

- **Startup time**: ~1 second
- **Memory usage**: 80-120 MB
- **CPU usage**: <1% idle
- **Network**: ~50 KB per refresh

---

## Privacy & Security

- ✅ No data collection
- ✅ No telemetry
- ✅ No tracking
- ✅ All data stored locally
- ✅ API calls only to GitHub/LeetCode

---

## Version Info

- **Current Version**: 1.0.0
- **Last Updated**: May 2026
- **Repository**: https://github.com/MacroMan17/DevTrack_Widget

---

## Next Steps

1. **Download** the app from GitHub
2. **Run** `DevTrack Widget.exe`
3. **Enter** your usernames
4. **Enjoy** tracking your progress!

---

**Questions?** Open an issue on GitHub or start a discussion!

Happy coding! 🚀
