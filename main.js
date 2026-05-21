// main.js — Electron Main Process (Production Ready)
// Desktop widget for GitHub and LeetCode tracking

const { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage, screen } = require('electron');
const path = require('path');
const Store = require('electron-store');
const isDev = !app.isPackaged;

// Persistent storage
const store = new Store();

let mainWindow = null;
let tray = null;
let isQuitting = false;

// ─── Create Main Widget Window ────────────────────────────────────────────────
function createWindow() {
  const { width: screenW, height: screenH } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width: 400,
    height: screenH,
    x: screenW - 420,
    y: 0,
    
    // Production widget settings
    frame: false,
    transparent: true,
    resizable: true,
    alwaysOnTop: true,
    skipTaskbar: false,
    hasShadow: true,
    minWidth: 280,
    minHeight: 400,
    
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  // Load built files in production, dev server in development
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }

  // Minimize to tray on close
  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
      if (tray && process.platform === 'win32') {
        tray.displayBalloon({
          title: 'DevTrack Widget',
          content: 'Running in background. Right-click tray icon to quit.',
          iconType: 'info',
        });
      }
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// ─── System Tray ──────────────────────────────────────────────────────────────
function createTray() {
  const iconPath = path.join(__dirname, 'src', 'assets', 'tray-icon.png');

  try {
    tray = new Tray(iconPath);
  } catch {
    const img = nativeImage.createEmpty();
    tray = new Tray(img);
  }

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show Widget',
      click: () => {
        mainWindow.show();
        mainWindow.focus();
      },
    },
    { type: 'separator' },
    {
      label: 'Always on Top',
      type: 'checkbox',
      checked: store.get('alwaysOnTop', true),
      click: (item) => {
        store.set('alwaysOnTop', item.checked);
        mainWindow.setAlwaysOnTop(item.checked);
      },
    },
    { type: 'separator' },
    {
      label: 'Refresh Data',
      click: () => {
        mainWindow.webContents.send('refresh-data');
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

  tray.on('double-click', () => {
    mainWindow.show();
    mainWindow.focus();
  });
}

// ─── IPC Handlers ─────────────────────────────────────────────────────────────
ipcMain.handle('get-usernames', () => ({
  github: store.get('githubUsername', ''),
  leetcode: store.get('leetcodeUsername', ''),
}));

ipcMain.handle('save-usernames', (event, { github, leetcode }) => {
  store.set('githubUsername', github);
  store.set('leetcodeUsername', leetcode);
  return true;
});

ipcMain.handle('get-settings', () => ({
  alwaysOnTop: store.get('alwaysOnTop', true),
  refreshInterval: store.get('refreshInterval', 5),
  compactMode: store.get('compactMode', false),
  notifications: store.get('notifications', true),
  launchOnStartup: app.getLoginItemSettings().openAtLogin,
}));

ipcMain.handle('save-settings', (event, settings) => {
  Object.entries(settings).forEach(([key, val]) => store.set(key, val));
  if (mainWindow && settings.alwaysOnTop !== undefined) {
    mainWindow.setAlwaysOnTop(settings.alwaysOnTop);
  }
  if (settings.launchOnStartup !== undefined) {
    app.setLoginItemSettings({
      openAtLogin: settings.launchOnStartup,
      path: process.execPath,
    });
  }
  return true;
});

ipcMain.handle('minimize-to-tray', () => {
  mainWindow.minimize();
});

ipcMain.handle('quit-app', () => {
  isQuitting = true;
  app.quit();
});

// ─── App Lifecycle ────────────────────────────────────────────────────────────
app.on('ready', () => {
  createWindow();
  createTray();
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on('window-all-closed', () => {
  // Stay in tray on Windows/Linux — do not quit
});

app.on('before-quit', () => {
  isQuitting = true;
});

// Disable logging in production
if (!isDev) {
  console.log = () => {};
  console.error = () => {};
  console.warn = () => {};
}
