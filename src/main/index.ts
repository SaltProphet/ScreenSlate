import { app, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { IPC_CHANNELS, Settings, LogLevel, LogEntry } from '../types'
import os from 'os'

let mainWindow: BrowserWindow | null = null

// Default settings
let settings: Settings = {
  fps: 30,
  outputDir: join(os.homedir(), 'Downloads'),
  micEnabled: false
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  // Load the app
  if (process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// Helper function to send logs to renderer
function sendLog(level: LogLevel, message: string) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    const log: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message
    }
    mainWindow.webContents.send(IPC_CHANNELS.LOG_MESSAGE, log)
  }
}

// IPC handlers
ipcMain.handle(IPC_CHANNELS.GET_SETTINGS, () => {
  return settings
})

ipcMain.handle(IPC_CHANNELS.SET_SETTINGS, (_, partialSettings: Partial<Settings>) => {
  settings = { ...settings, ...partialSettings }
  sendLog('info', `Settings updated: ${JSON.stringify(partialSettings)}`)
  return settings
})

// App lifecycle
app.whenReady().then(() => {
  createWindow()
  
  // Send startup logs
  setTimeout(() => {
    sendLog('info', 'ScreenSlate application started')
    sendLog('info', `Electron version: ${process.versions.electron}`)
    sendLog('info', `Node version: ${process.versions.node}`)
    sendLog('info', `Platform: ${process.platform}`)
  }, 500)

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
