// main.js — Electron Main Process
// This is the "backend" of our desktop app

const { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage, screen } = require('electron');
const path = require('path');
const Store = require('electron-store');

// Persistent storage for usernames and settings
const store = new Store();

// References to windows and tray (kept in outer scope so they aren't garbage collected)
let mainWindow = null;
let tray = null;
let isQuitting = false;

// ─── Create the main floating widget window ───────────────────────────────────
function createWindow() {
  const { width: screenW, height: screenH } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    // Default size — small floating widget
    width: 320,
    height: 520,

    // Default position: bottom-right corner
    x: screenW - 340,
    y: screenH - 540,

    // Widget appearance
    frame: false,           // No title bar — we draw our own
    transparent: true,      // Allow rounded corners / glassmorphism
    resizable: true,
    alwaysOnTop: true,      // Always visible over other windows
    skipTaskbar: false,     // Show in taskbar
    hasShadow: true,

    // Minimum widget size
    minWidth: 280,
    minHeight: 400,

    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,   // Security best practice
      nodeIntegration: false,   // Security best practice
    },
  });

  // Load the React app
  // In dev mode, load from Vite dev server; in production, load built files
  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    // Open DevTools in development
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }

  // When the user clicks "close", minimize to tray instead of quitting
  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
      // Show a tray balloon notification (Windows only)
      if (tray && process.platform === 'win32') {
        tray.displayBalloon({
          title: 'DevTrack Widget',
          content: 'Still running in the background. Right-click the tray icon to quit.',
          iconType: 'info',
        });
      }
    }
  });
}

// ─── System Tray ─────────────────────────────────────────────────────────────
function createTray() {
  // Use a simple colored icon — replace with a real .ico file for production
  const iconPath = path.join(__dirname, 'src', 'assets', 'tray-icon.png');

  try {
    tray = new Tray(iconPath);
  } catch {
    // Fallback: create a tiny blank image if icon file missing
    const img = nativeImage.createEmpty();
    tray = new Tray(img);
  }

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show DevTrack Widget',
      click: () => {
        mainWindow.show();
        mainWindow.focus();
      },
    },
    { type: 'separator' },
    {
      label: 'Always on Top',
      type: 'checkbox',
      checked: true,
      click: (item) => {
        mainWindow.setAlwaysOnTop(item.checked);
      },
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        isQuitting = true;
        app.quit();
      },
    },
  ]);

  tray.setToolTip('DevTrack Widget');
  tray.setContextMenu(contextMenu);

  // Double-click tray icon to show window
  tray.on('double-click', () => {
    mainWindow.show();
    mainWindow.focus();
  });
}

// ─── IPC Handlers (communication between React and Electron) ──────────────────

// Get saved usernames from disk
ipcMain.handle('get-usernames', () => {
  return {
    github: store.get('githubUsername', ''),
    leetcode: store.get('leetcodeUsername', ''),
  };
});

// Save usernames to disk
ipcMain.handle('save-usernames', (event, { github, leetcode }) => {
  store.set('githubUsername', github);
  store.set('leetcodeUsername', leetcode);
  return true;
});

// Get widget settings
ipcMain.handle('get-settings', () => {
  return {
    alwaysOnTop: store.get('alwaysOnTop', true),
    refreshInterval: store.get('refreshInterval', 5), // minutes
    compactMode: store.get('compactMode', false),
    notifications: store.get('notifications', true),
  };
});

// Save widget settings
ipcMain.handle('save-settings', (event, settings) => {
  Object.entries(settings).forEach(([key, val]) => store.set(key, val));
  // Apply always-on-top immediately
  if (mainWindow && settings.alwaysOnTop !== undefined) {
    mainWindow.setAlwaysOnTop(settings.alwaysOnTop);
  }
  return true;
});

// Minimize window to tray
ipcMain.handle('minimize-to-tray', () => {
  mainWindow.hide();
});

// Close / quit app
ipcMain.handle('quit-app', () => {
  isQuitting = true;
  app.quit();
});

// Drag window (frameless window drag workaround)
ipcMain.on('start-drag', () => {
  // Handled via CSS -webkit-app-region: drag
});

// ─── App lifecycle ────────────────────────────────────────────────────────────
app.whenReady().then(() => {
  createWindow();
  createTray();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// On Windows/Linux: quit when all windows closed (unless minimized to tray)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // Don't quit — we stay in tray
  }
});

app.on('before-quit', () => {
  isQuitting = true;
});
