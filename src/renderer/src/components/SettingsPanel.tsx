import React from 'react'
import './SettingsPanel.css'
import { Settings } from '../../../types'

interface SettingsPanelProps {
  settings: Settings
  onChange: (settings: Partial<Settings>) => void
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onChange }) => {
  const handleFpsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fps = parseInt(e.target.value, 10)
    if (!isNaN(fps) && fps > 0 && fps <= 60) {
      onChange({ fps })
    }
  }

  const handleOutputDirChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ outputDir: e.target.value })
  }

  const handleMicToggle = () => {
    onChange({ micEnabled: !settings.micEnabled })
  }

  return (
    <div className="settings-panel">
      <div className="panel-header">
        <h2>Settings</h2>
      </div>
      <div className="settings-content">
        <div className="setting-item">
          <label htmlFor="fps-input">Frame Rate (FPS)</label>
          <input
            id="fps-input"
            type="number"
            min="1"
            max="60"
            value={settings.fps}
            onChange={handleFpsChange}
            className="setting-input"
          />
        </div>
        
        <div className="setting-item">
          <label htmlFor="output-dir-input">Output Directory</label>
          <input
            id="output-dir-input"
            type="text"
            value={settings.outputDir}
            onChange={handleOutputDirChange}
            className="setting-input"
          />
        </div>
        
        <div className="setting-item">
          <label className="toggle-label">
            <span>Microphone</span>
            <button
              className={`toggle-button ${settings.micEnabled ? 'active' : ''}`}
              onClick={handleMicToggle}
              aria-label="Toggle microphone"
            >
              <span className="toggle-slider"></span>
            </button>
          </label>
        </div>
      </div>
    </div>
  )
}

export default SettingsPanel
