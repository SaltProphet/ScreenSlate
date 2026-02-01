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

export interface DesktopCapturerSource {
  id: string
  name: string
  thumbnail: string
}

// IPC channel names
export const IPC_CHANNELS = {
  LOG_MESSAGE: 'log:message',
  SETTINGS_CHANGED: 'settings:changed',
  GET_SETTINGS: 'settings:get',
  SET_SETTINGS: 'settings:set',
  GET_SOURCES: 'sources:get',
  SAVE_RECORDING: 'recording:save'
} as const

// Typed API exposed to renderer
export interface ElectronAPI {
  onLogMessage: (callback: (log: LogEntry) => void) => () => void
  sendLog: (level: LogLevel, message: string) => void
  getSettings: () => Promise<Settings>
  setSettings: (settings: Partial<Settings>) => Promise<Settings>
  getSources: () => Promise<DesktopCapturerSource[]>
  saveRecording: (buffer: ArrayBuffer, timestamp: string) => Promise<string>
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    electron: ElectronAPI
  }
}
