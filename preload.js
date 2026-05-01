// preload.js — Bridge between Electron (Node.js) and React (browser)
// Only expose what React actually needs — security best practice

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Username persistence
  getUsernames: () => ipcRenderer.invoke('get-usernames'),
  saveUsernames: (data) => ipcRenderer.invoke('save-usernames', data),

  // Settings
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),

  // Window controls
  minimizeToTray: () => ipcRenderer.invoke('minimize-to-tray'),
  quitApp: () => ipcRenderer.invoke('quit-app'),
});
