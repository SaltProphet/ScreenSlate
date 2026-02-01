import { app, BrowserWindow, ipcMain, desktopCapturer } from 'electron'
import { join } from 'path'
import { IPC_CHANNELS, Settings, LogLevel, LogEntry, DesktopCapturerSource } from '../types'
import os from 'os'
import { writeFile } from 'fs/promises'

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

// Handle getting desktop capturer sources
ipcMain.handle(IPC_CHANNELS.GET_SOURCES, async () => {
  try {
    const sources = await desktopCapturer.getSources({
      types: ['window', 'screen'],
      thumbnailSize: { width: 150, height: 150 }
    })
    
    const sourceList: DesktopCapturerSource[] = sources.map(source => ({
      id: source.id,
      name: source.name,
      thumbnail: source.thumbnail.toDataURL()
    }))
    
    sendLog('info', `Retrieved ${sourceList.length} sources`)
    return sourceList
  } catch (error) {
    sendLog('error', `Failed to get sources: ${error}`)
    throw error
  }
})

// Handle saving recording
ipcMain.handle(IPC_CHANNELS.SAVE_RECORDING, async (_, buffer: ArrayBuffer, timestamp: string) => {
  try {
    const fileName = `rec-${timestamp}.webm`
    const filePath = join(settings.outputDir, fileName)
    
    await writeFile(filePath, Buffer.from(buffer))
    sendLog('info', `Recording saved: ${filePath}`)
    
    return filePath
  } catch (error) {
    sendLog('error', `Failed to save recording: ${error}`)
    throw error
  }
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
