import React from 'react'
import './SourcesList.css'

const SourcesList: React.FC = () => {
  return (
    <div className="sources-list">
      <div className="panel-header">
        <h2>Sources</h2>
      </div>
      <div className="sources-content">
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
          <p className="empty-hint">Sources will appear here when detected</p>
        </div>
      </div>
    </div>
  )
}

export default SourcesList
