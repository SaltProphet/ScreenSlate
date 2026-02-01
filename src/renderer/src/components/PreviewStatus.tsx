import React from 'react'
import './PreviewStatus.css'

const PreviewStatus: React.FC = () => {
  return (
    <div className="preview-status">
      <div className="preview-container">
        <div className="status-display">
          <div className="status-icon">
            <svg
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <h2 className="status-text">Idle</h2>
          <p className="status-description">Ready to record</p>
        </div>
      </div>
    </div>
  )
}

export default PreviewStatus
