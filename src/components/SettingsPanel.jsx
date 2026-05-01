// src/components/SettingsPanel.jsx — Username input + settings

import React, { useState } from 'react';

export default function SettingsPanel({ usernames, settings, onSave, onClose }) {
  const [github,   setGithub]   = useState(usernames.github   || '');
  const [leetcode, setLeetcode] = useState(usernames.leetcode || '');
  const [interval, setInterval] = useState(settings.refreshInterval || 5);
  const [notifs,   setNotifs]   = useState(settings.notifications !== false);
  const [saved,    setSaved]    = useState(false);

  const handleSave = () => {
    onSave({
      usernames: { github: github.trim(), leetcode: leetcode.trim() },
      settings:  { refreshInterval: interval, notifications: notifs },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="settings fade-in">
      <div className="settings-header">
        <h2 className="settings-title">Settings</h2>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      <div className="settings-body">
        {/* GitHub username */}
        <div className="field-group">
          <label className="field-label">
            <span className="field-icon" style={{ color: 'var(--accent-green)' }}>◈</span>
            GitHub Username
          </label>
          <input
            className="field-input"
            type="text"
            placeholder="e.g. torvalds"
            value={github}
            onChange={(e) => setGithub(e.target.value)}
            spellCheck={false}
          />
        </div>

        {/* LeetCode username */}
        <div className="field-group">
          <label className="field-label">
            <span className="field-icon" style={{ color: 'var(--accent-orange)' }}>🧩</span>
            LeetCode Username
          </label>
          <input
            className="field-input"
            type="text"
            placeholder="e.g. neal_wu"
            value={leetcode}
            onChange={(e) => setLeetcode(e.target.value)}
            spellCheck={false}
          />
        </div>

        <div className="divider" />

        {/* Refresh interval */}
        <div className="field-group">
          <label className="field-label">Auto-refresh every</label>
          <div className="option-row">
            {[2, 5, 10, 30].map((min) => (
              <button
                key={min}
                className={`option-btn ${interval === min ? 'option-btn--active' : ''}`}
                onClick={() => setInterval(min)}
              >
                {min}m
              </button>
            ))}
          </div>
        </div>

        {/* Notifications toggle */}
        <div className="toggle-row">
          <span className="toggle-label">Daily reminders</span>
          <button
            className={`toggle ${notifs ? 'toggle--on' : ''}`}
            onClick={() => setNotifs(!notifs)}
          >
            <span className="toggle-knob" />
          </button>
        </div>
      </div>

      {/* Save button */}
      <div className="settings-footer">
        <button className={`save-btn ${saved ? 'save-btn--saved' : ''}`} onClick={handleSave}>
          {saved ? '✓ Saved!' : 'Save & Refresh'}
        </button>
      </div>

      <style>{`
        .settings {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: var(--bg-base);
        }

        .settings-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px 12px;
          border-bottom: 1px solid var(--border-subtle);
          flex-shrink: 0;
        }

        .settings-title {
          font-family: var(--font-display);
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-secondary);
        }

        .close-btn {
          width: 24px;
          height: 24px;
          border: none;
          background: transparent;
          color: var(--text-muted);
          cursor: pointer;
          font-size: 13px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background var(--transition), color var(--transition);
        }

        .close-btn:hover {
          background: var(--bg-elevated);
          color: var(--text-primary);
        }

        .settings-body {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .field-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .field-label {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 10px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 600;
        }

        .field-icon {
          font-size: 11px;
        }

        .field-input {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 9px 12px;
          color: var(--text-primary);
          font-family: var(--font-mono);
          font-size: 12px;
          outline: none;
          transition: border-color var(--transition), box-shadow var(--transition);
          width: 100%;
        }

        .field-input:focus {
          border-color: rgba(0, 255, 136, 0.4);
          box-shadow: 0 0 0 2px rgba(0, 255, 136, 0.08);
        }

        .field-input::placeholder {
          color: var(--text-muted);
        }

        .divider {
          height: 1px;
          background: var(--border-subtle);
          margin: 2px 0;
        }

        .option-row {
          display: flex;
          gap: 6px;
        }

        .option-btn {
          flex: 1;
          padding: 6px 0;
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          color: var(--text-secondary);
          font-family: var(--font-mono);
          font-size: 11px;
          cursor: pointer;
          transition: all var(--transition);
        }

        .option-btn--active {
          background: rgba(0, 255, 136, 0.1);
          border-color: rgba(0, 255, 136, 0.3);
          color: var(--accent-green);
          font-weight: 600;
        }

        .option-btn:hover:not(.option-btn--active) {
          background: var(--bg-elevated);
          color: var(--text-primary);
        }

        .toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .toggle-label {
          font-size: 11px;
          color: var(--text-secondary);
        }

        .toggle {
          width: 36px;
          height: 20px;
          border-radius: 10px;
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          cursor: pointer;
          position: relative;
          transition: background var(--transition), border-color var(--transition);
        }

        .toggle--on {
          background: rgba(0, 255, 136, 0.15);
          border-color: rgba(0, 255, 136, 0.3);
        }

        .toggle-knob {
          position: absolute;
          top: 3px;
          left: 3px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--text-muted);
          transition: transform var(--transition), background var(--transition);
        }

        .toggle--on .toggle-knob {
          transform: translateX(16px);
          background: var(--accent-green);
        }

        .settings-footer {
          padding: 12px 16px;
          border-top: 1px solid var(--border-subtle);
          flex-shrink: 0;
        }

        .save-btn {
          width: 100%;
          padding: 10px;
          background: rgba(0, 255, 136, 0.1);
          border: 1px solid rgba(0, 255, 136, 0.25);
          border-radius: var(--radius-sm);
          color: var(--accent-green);
          font-family: var(--font-mono);
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition);
          letter-spacing: 0.05em;
        }

        .save-btn:hover {
          background: rgba(0, 255, 136, 0.18);
          border-color: rgba(0, 255, 136, 0.4);
          box-shadow: 0 0 16px rgba(0, 255, 136, 0.15);
        }

        .save-btn--saved {
          background: rgba(0, 255, 136, 0.2);
          color: var(--accent-green);
        }
      `}</style>
    </div>
  );
}
