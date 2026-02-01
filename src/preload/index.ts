import { contextBridge, ipcRenderer } from 'electron'
import { ElectronAPI, IPC_CHANNELS, LogEntry, LogLevel, Settings } from '../types'

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
const api: ElectronAPI = {
  onLogMessage: (callback: (log: LogEntry) => void) => {
    const subscription = (_event: Electron.IpcRendererEvent, log: LogEntry) => {
      callback(log)
    }
    ipcRenderer.on(IPC_CHANNELS.LOG_MESSAGE, subscription)
    
    // Return unsubscribe function
    return () => {
      ipcRenderer.removeListener(IPC_CHANNELS.LOG_MESSAGE, subscription)
    }
  },
  
  sendLog: (level: LogLevel, message: string) => {
    const log: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message
    }
    ipcRenderer.send(IPC_CHANNELS.LOG_MESSAGE, log)
  },
  
  getSettings: () => {
    return ipcRenderer.invoke(IPC_CHANNELS.GET_SETTINGS)
  },
  
  setSettings: (settings: Partial<Settings>) => {
    return ipcRenderer.invoke(IPC_CHANNELS.SET_SETTINGS, settings)
  }
}

contextBridge.exposeInMainWorld('electron', api)
