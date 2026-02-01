import React, { useState, useEffect } from 'react'
import './App.css'
import { LogEntry, Settings } from '../../types'
import SourcesList from './components/SourcesList'
import PreviewStatus from './components/PreviewStatus'
import SettingsPanel from './components/SettingsPanel'
import LogsPanel from './components/LogsPanel'

function App() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [settings, setSettings] = useState<Settings>({
    fps: 30,
    outputDir: 'Downloads',
    micEnabled: false
  })

  useEffect(() => {
    // Load initial settings
    window.electron.getSettings().then(setSettings)

    // Subscribe to log messages
    const unsubscribe = window.electron.onLogMessage((log) => {
      setLogs((prev) => [...prev, log])
    })

    return unsubscribe
  }, [])

  const handleSettingsChange = async (newSettings: Partial<Settings>) => {
    const updated = await window.electron.setSettings(newSettings)
    setSettings(updated)
  }

  const handleClearLogs = () => {
    setLogs([])
  }

  return (
    <div className="app">
      <div className="app-header">
        <h1>ScreenSlate</h1>
      </div>
      <div className="app-body">
        <div className="left-panel">
          <SourcesList />
        </div>
        <div className="center-panel">
          <PreviewStatus />
        </div>
        <div className="right-panel">
          <SettingsPanel settings={settings} onChange={handleSettingsChange} />
        </div>
      </div>
      <div className="app-footer">
        <LogsPanel logs={logs} onClear={handleClearLogs} />
      </div>
    </div>
  )
}

export default App
