# DevTrack Widget - Production Build Guide

## Prerequisites
- Node.js 16+ installed
- Windows 10/11 (for .exe build)
- Git (optional, for version control)

## Build Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Build React App (Vite)
```bash
npm run build
```
This creates optimized files in `dist/` folder.

### 3. Build Windows Installer (.exe)
```bash
npm run build:exe
```

This will:
- Build React app (if not already built)
- Create Windows installer using electron-builder
- Output: `dist/DevTrack Widget Setup 1.0.0.exe`

### 4. Install the App
- Run the generated `.exe` file
- Follow the installer wizard
- App will be installed to `C:\Users\[YourUsername]\AppData\Local\Programs\DevTrack Widget\`
- Desktop shortcut will be created automatically

## What Happens in Production

✅ **No Development Tools**
- No DevTools window
- No browser console
- No localhost server

✅ **Lightweight & Fast**
- Loads from local files (dist/index.html)
- Starts instantly
- ~150MB total size

✅ **Desktop Widget Behavior**
- Frameless, transparent window
- Always-on-top floating widget
- Minimizes to system tray
- Right-click tray menu for controls

✅ **Offline Ready**
- Works without internet (for cached data)
- API calls only when needed

## Folder Structure After Build

```
devtrack-widget/
├── dist/                          # Built React app
│   ├── index.html
│   ├── assets/
│   └── ...
├── main.js                        # Electron main process
├── preload.js                     # IPC bridge
├── package.json
└── DevTrack Widget Setup 1.0.0.exe  # Installer
```

## Troubleshooting

### Build fails with "icon.ico not found"
- Create `src/assets/icon.ico` (256x256 pixels)
- Or use PNG: rename `tray-icon.png` to `icon.ico`

### App won't start after installation
- Check Windows Defender/Antivirus isn't blocking it
- Try running as Administrator
- Check Event Viewer for error logs

### Installer won't run
- Ensure you have admin rights
- Try disabling antivirus temporarily
- Check disk space (needs ~500MB)

## Development vs Production

| Feature | Dev | Production |
|---------|-----|------------|
| DevTools | ✅ Open | ❌ Closed |
| Localhost | ✅ :5173 | ❌ Local files |
| Console logs | ✅ Visible | ❌ Disabled |
| Startup time | ~3s | ~1s |
| File size | N/A | ~150MB |

## Next Steps

1. **Test the installer** on a clean Windows machine
2. **Create app icon** (256x256 PNG → ICO)
3. **Update version** in package.json for releases
4. **Sign the installer** (optional, for trusted distribution)

## Commands Reference

```bash
npm run dev          # Development mode (localhost + devtools)
npm run build        # Build React app only
npm run build:exe    # Build complete installer
npm start            # Run production build locally
```
