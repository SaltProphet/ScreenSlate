import React, { useEffect, useRef } from 'react'
import './LogsPanel.css'
import { LogEntry } from '../../../types'

interface LogsPanelProps {
  logs: LogEntry[]
  onClear: () => void
}

const LogsPanel: React.FC<LogsPanelProps> = ({ logs, onClear }) => {
  const logsEndRef = useRef<HTMLDivElement>(null)
  const [autoScroll, setAutoScroll] = React.useState(true)

  useEffect(() => {
    if (autoScroll && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [logs, autoScroll])

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      fractionalSecondDigits: 3
    })
  }

  const getLevelClass = (level: string) => {
    return `log-level log-level-${level}`
  }

  return (
    <div className="logs-panel">
      <div className="logs-header">
        <h2>Logs</h2>
        <div className="logs-controls">
          <label className="auto-scroll-toggle">
            <input
              type="checkbox"
              checked={autoScroll}
              onChange={(e) => setAutoScroll(e.target.checked)}
            />
            <span>Auto-scroll</span>
          </label>
          <button onClick={onClear} className="clear-button">
            Clear
          </button>
        </div>
      </div>
      <div className="logs-content">
        {logs.length === 0 ? (
          <div className="logs-empty">No logs yet</div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="log-entry">
              <span className="log-timestamp">{formatTimestamp(log.timestamp)}</span>
              <span className={getLevelClass(log.level)}>{log.level.toUpperCase()}</span>
              <span className="log-message">{log.message}</span>
            </div>
          ))
        )}
        <div ref={logsEndRef} />
      </div>
    </div>
  )
}

export default LogsPanel
