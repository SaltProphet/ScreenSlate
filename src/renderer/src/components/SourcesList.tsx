import React, { useState, useEffect } from 'react'
import './SourcesList.css'
import { DesktopCapturerSource } from '../../../types'

interface SourcesListProps {
  onSourceSelect: (sourceId: string) => void
  selectedSourceId: string | null
}

const SourcesList: React.FC<SourcesListProps> = ({ onSourceSelect, selectedSourceId }) => {
  const [sources, setSources] = useState<DesktopCapturerSource[]>([])
  const [loading, setLoading] = useState(false)

  const loadSources = async () => {
    setLoading(true)
    try {
      const sources = await window.electron.getSources()
      setSources(sources)
    } catch (error) {
      console.error('Failed to load sources:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSources()
  }, [])

  return (
    <div className="sources-list">
      <div className="panel-header">
        <h2>Sources</h2>
        <button onClick={loadSources} className="refresh-button" disabled={loading}>
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>
      <div className="sources-content">
        {sources.length === 0 ? (
          <div className="empty-state">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
            <p className="empty-message">No sources available</p>
            <p className="empty-hint">Click Refresh to load sources</p>
          </div>
        ) : (
          <div className="sources-grid">
            {sources.map((source) => (
              <div
                key={source.id}
                className={`source-item ${selectedSourceId === source.id ? 'selected' : ''}`}
                onClick={() => onSourceSelect(source.id)}
              >
                <img src={source.thumbnail} alt={source.name} className="source-thumbnail" />
                <div className="source-name">{source.name}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SourcesList
