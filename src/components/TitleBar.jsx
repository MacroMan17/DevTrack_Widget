// src/components/TitleBar.jsx — Draggable window titlebar

import React from 'react';

export default function TitleBar({ onSettingsClick, onMinimize, onQuit, isCompact, onToggleCompact }) {
  return (
    <div className="titlebar">
      {/* Drag region — this area is used to move the window */}
      <div className="titlebar-drag">
        {/* Logo / App name */}
        <div className="titlebar-brand">
          <span className="titlebar-icon">◈</span>
          <span className="titlebar-title">DevTrack</span>
        </div>
      </div>

      {/* Control buttons (no-drag region) */}
      <div className="titlebar-controls no-drag">
        <button
          className="ctrl-btn"
          title={isCompact ? 'Expand' : 'Compact mode'}
          onClick={onToggleCompact}
        >
          {isCompact ? '⊞' : '⊟'}
        </button>
        <button
          className="ctrl-btn"
          title="Settings"
          onClick={onSettingsClick}
        >
          ⚙
        </button>
        <button
          className="ctrl-btn"
          title="Minimize to tray"
          onClick={onMinimize}
        >
          −
        </button>
        <button
          className="ctrl-btn ctrl-btn--close"
          title="Quit"
          onClick={onQuit}
        >
          ×
        </button>
      </div>

      <style>{`
        .titlebar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 12px 8px;
          -webkit-app-region: drag; /* Makes entire bar draggable */
          cursor: grab;
          border-bottom: 1px solid var(--border-subtle);
          flex-shrink: 0;
        }

        .titlebar-drag {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
        }

        .titlebar-brand {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .titlebar-icon {
          color: var(--accent-green);
          font-size: 14px;
          animation: glowPulse 3s ease infinite;
        }

        .titlebar-title {
          font-family: var(--font-display);
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-primary);
        }

        .titlebar-controls {
          display: flex;
          align-items: center;
          gap: 2px;
          -webkit-app-region: no-drag; /* Buttons must NOT be draggable */
        }

        .no-drag {
          -webkit-app-region: no-drag;
        }

        .ctrl-btn {
          width: 24px;
          height: 24px;
          border: none;
          background: transparent;
          color: var(--text-muted);
          font-size: 14px;
          cursor: pointer;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background var(--transition), color var(--transition);
          line-height: 1;
        }

        .ctrl-btn:hover {
          background: var(--bg-elevated);
          color: var(--text-primary);
        }

        .ctrl-btn--close:hover {
          background: rgba(255, 77, 109, 0.2);
          color: var(--accent-red);
        }
      `}</style>
    </div>
  );
}
