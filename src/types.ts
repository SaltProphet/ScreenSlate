// Shared type definitions for IPC communication

export type LogLevel = 'info' | 'warn' | 'error'

export interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
}

export interface Settings {
  fps: number
  outputDir: string
  micEnabled: boolean
}

// IPC channel names
export const IPC_CHANNELS = {
  LOG_MESSAGE: 'log:message',
  SETTINGS_CHANGED: 'settings:changed',
  GET_SETTINGS: 'settings:get',
  SET_SETTINGS: 'settings:set'
} as const

// Typed API exposed to renderer
export interface ElectronAPI {
  onLogMessage: (callback: (log: LogEntry) => void) => () => void
  sendLog: (level: LogLevel, message: string) => void
  getSettings: () => Promise<Settings>
  setSettings: (settings: Partial<Settings>) => Promise<Settings>
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    electron: ElectronAPI
  }
}
