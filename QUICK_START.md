# Quick Start - DevTrack Widget Production Build

## 🚀 Build & Run in 3 Steps

### Step 1: Build the App
```bash
npm run build
```
Creates optimized files in `dist/` folder.

### Step 2: Create Installer
```bash
npm run build:exe
```
Generates: `dist/DevTrack Widget Setup 1.0.0.exe`

### Step 3: Install & Run
- Double-click the `.exe` file
- Follow the installer wizard
- App launches automatically

---

## 📋 What You Get

✅ **No Development Tools**
- No DevTools window
- No browser console
- No localhost dependency

✅ **Production Ready**
- Instant startup (~1 second)
- Lightweight (~150MB)
- Offline capable

✅ **Desktop Widget**
- Frameless, transparent window
- Always-on-top floating widget
- System tray integration
- Right-click menu

---

## 🎯 First Use

1. **Enter GitHub username** (Settings ⚙️)
2. **Enter LeetCode username** (Settings ⚙️)
3. **Click Save** — data loads automatically
4. **Enjoy!** Widget updates every 5 minutes

---

## 📁 Build Output

```
dist/
├── index.html              # Built React app
├── assets/
│   └── ...
└── DevTrack Widget Setup 1.0.0.exe  # Installer
```

---

## 🔧 Development Commands

```bash
npm run dev          # Dev mode (localhost + devtools)
npm run build        # Build React only
npm run build:exe    # Build complete installer
npm start            # Run production build locally
```

---

## ⚠️ Troubleshooting

**Build fails?**
```bash
rm -r node_modules dist
npm install
npm run build:exe
```

**App won't start?**
- Run as Administrator
- Check Windows Defender isn't blocking it
- Reinstall the app

**Data not updating?**
- Check internet connection
- Verify usernames are correct
- Click ⟳ to manually refresh

---

## 📦 Distribution

The `.exe` installer is ready to share:
- No additional setup needed
- Works on Windows 10/11 (64-bit)
- ~150MB total size
- Installs to Program Files

---

**That's it! Your production widget is ready.** 🎉
