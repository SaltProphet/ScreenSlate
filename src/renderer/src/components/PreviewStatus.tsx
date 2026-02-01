import React, { useState, useRef } from 'react'
import './PreviewStatus.css'
import { Settings } from '../../../types'

interface PreviewStatusProps {
  sourceId: string | null
  settings: Settings
}

const PreviewStatus: React.FC<PreviewStatusProps> = ({ sourceId, settings }) => {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const startRecording = async () => {
    if (!sourceId) {
      alert('Please select a source first')
      return
    }

    try {
      // Get screen stream with the selected source
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          // @ts-ignore - chromeMediaSource and chromeMediaSourceId are Electron-specific
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: sourceId
          }
        }
      } as any)

      // Add microphone audio if enabled
      if (settings.micEnabled) {
        try {
          const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true })
          const audioTrack = audioStream.getAudioTracks()[0]
          stream.addTrack(audioTrack)
        } catch (err) {
          console.error('Failed to get microphone:', err)
          alert('Failed to access microphone. Recording will continue without audio.')
        }
      }

      chunksRef.current = []
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9'
      })

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' })
        const buffer = await blob.arrayBuffer()
        
        // Generate timestamp
        const now = new Date()
        const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}`
        
        // Save the recording
        try {
          const filePath = await window.electron.saveRecording(buffer, timestamp)
          alert(`Recording saved: ${filePath}`)
        } catch (error) {
          console.error('Failed to save recording:', error)
          alert('Failed to save recording')
        }

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start(1000) // Collect data every second
      mediaRecorderRef.current = mediaRecorder
      setIsRecording(true)
      setRecordingTime(0)

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } catch (error) {
      console.error('Failed to start recording:', error)
      alert('Failed to start recording')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current = null
      setIsRecording(false)
      
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  return (
    <div className="preview-status">
      <div className="preview-container">
        <div className="status-display">
          <div className={`status-icon ${isRecording ? 'recording' : ''}`}>
            {isRecording ? (
              <div className="recording-indicator">
                <div className="recording-dot"></div>
              </div>
            ) : (
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
            )}
          </div>
          <h2 className="status-text">
            {isRecording ? 'Recording' : sourceId ? 'Ready' : 'Idle'}
          </h2>
          <p className="status-description">
            {isRecording 
              ? `Recording time: ${formatTime(recordingTime)}`
              : sourceId 
                ? 'Click Start to begin recording' 
                : 'Select a source to begin'}
          </p>
          <button
            className={`record-button ${isRecording ? 'recording' : ''}`}
            onClick={isRecording ? stopRecording : startRecording}
            disabled={!sourceId && !isRecording}
          >
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PreviewStatus
