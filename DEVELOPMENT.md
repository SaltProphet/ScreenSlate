# ScreenSlate Development Guide

## Overview
ScreenSlate is a screen recording application built with Electron, TypeScript, and React using electron-vite.

## Project Structure

```
ScreenSlate/
├── src/
│   ├── main/
│   │   └── index.ts           # Electron main process
│   ├── preload/
│   │   └── index.ts           # Preload script with contextBridge
│   ├── renderer/
│   │   ├── index.html         # HTML entry point
│   │   └── src/
│   │       ├── main.tsx       # React app entry
│   │       ├── App.tsx        # Main app component
│   │       ├── App.css        # App styles
│   │       ├── index.css      # Global styles
│   │       └── components/    # React components
│   │           ├── SourcesList.tsx
│   │           ├── PreviewStatus.tsx
│   │           ├── SettingsPanel.tsx
│   │           └── LogsPanel.tsx
│   └── types.ts               # Shared TypeScript types
├── electron.vite.config.ts    # electron-vite configuration
├── tsconfig.json              # TypeScript config
├── tsconfig.node.json         # TypeScript config for build tools
└── package.json               # Project dependencies
```

## Prerequisites

- Node.js (v16 or later)
- npm or yarn

## Installation

```bash
npm install
```

## Development

Run the app in development mode with hot reload:

```bash
npm run dev
```

## Building

Build the application for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Application Architecture

### Main Process (`src/main/index.ts`)
- Creates and manages the browser window
- Handles IPC communication
- Emits startup logs with system information
- Manages application settings

### Preload Script (`src/preload/index.ts`)
- Exposes safe APIs to renderer using contextBridge
- Provides typed IPC communication interface
- Prevents direct Node.js/Electron API access in renderer

### Renderer Process (`src/renderer/`)
- React application with TypeScript
- Four main UI regions:
  1. **Sources List**: Displays available recording sources (empty state)
  2. **Preview/Status**: Shows recording preview or status (idle state)
  3. **Settings Panel**: FPS, output directory, microphone toggle
  4. **Logs Panel**: Timestamped logs with level indicators

## IPC Communication

The application uses typed IPC channels defined in `src/types.ts`:

- `log:message` - Log messages from main to renderer
- `settings:get` - Get current settings
- `settings:set` - Update settings
- `settings:changed` - Settings change notification

## Settings

Default settings:
- **FPS**: 30
- **Output Directory**: ~/Downloads
- **Microphone**: Disabled

## Features

### Logs Panel
- Timestamped entries (HH:MM:SS.mmm format)
- Log levels: INFO, WARN, ERROR
- Color-coded by level
- Auto-scroll toggle
- Clear logs button

### Settings Panel
- Frame rate control (1-60 FPS)
- Custom output directory
- Microphone toggle with visual indicator

### Startup Logs
The application automatically logs:
- Application start message
- Electron version
- Node.js version
- Operating system platform

### Settings Change Logs
When settings are changed, the main process logs the updates.

## TypeScript Types

All IPC communication is fully typed using TypeScript interfaces:
- `LogEntry`: Log message structure
- `Settings`: Application settings
- `ElectronAPI`: Renderer-side API interface
- `IPC_CHANNELS`: Channel name constants

## UI Theme

The application uses a dark theme optimized for recording workflows:
- Dark gray background (#1e1e1e)
- Lighter panels (#252525)
- Blue accent color (#4a90e2)
- Clear visual hierarchy
