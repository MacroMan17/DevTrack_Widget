// src/App.jsx — Root component for DevTrack Widget

import React, { useState, useEffect, useCallback, useRef } from 'react';
import TitleBar      from './components/TitleBar';
import GitHubCard    from './components/GitHubCard';
import LeetCodeCard  from './components/LeetCodeCard';
import SettingsPanel from './components/SettingsPanel';
import { fetchAllData } from './utils/api';

// ── Helpers ───────────────────────────────────────────────────────────────────
const isElectron = typeof window !== 'undefined' && !!window.electronAPI;
const api = window.electronAPI;

// Format time since last refresh
function timeSince(date) {
  if (!date) return null;
  const seconds = Math.floor((Date.now() - date) / 1000);
  if (seconds < 60)  return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  return `${Math.floor(seconds / 3600)}h ago`;
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  // State
  const [view, setView]       = useState('widget');   // 'widget' | 'settings'
  const [compact, setCompact] = useState(false);
  const [loading, setLoading] = useState(false);

  const [githubData,   setGithubData]   = useState(null);
  const [leetcodeData, setLeetcodeData] = useState(null);

  const [usernames, setUsernames] = useState({ github: '', leetcode: '' });
  const [settings,  setSettings]  = useState({ refreshInterval: 5, notifications: true });
  const [lastRefresh, setLastRefresh] = useState(null);
  const [refreshTime, setRefreshTime] = useState(null);

  const refreshTimerRef = useRef(null);

  // ── Load saved usernames + settings on mount ────────────────────────────────
  useEffect(() => {
    (async () => {
      if (isElectron) {
        const saved = await api.getUsernames();
        const savedSettings = await api.getSettings();
        setUsernames(saved);
        setSettings(savedSettings);
        setCompact(savedSettings.compactMode || false);
        if (saved.github || saved.leetcode) {
          fetchData(saved);
        }
      } else {
        // Browser preview mode — use demo data
        setGithubData({
          username: 'octocat',
          name: 'The Octocat',
          avatarUrl: 'https://avatars.githubusercontent.com/u/583231',
          publicRepos: 8,
          followers: 14000,
          recentCommits: 23,
          commitedToday: true,
        });
        setLeetcodeData({
          username: 'demo_user',
          total: 347,
          easy: 120,
          medium: 180,
          hard: 47,
          streak: 12,
          ranking: 85432,
          solvedToday: false,
        });
        setLastRefresh(new Date());
      }
    })();
  }, []);

  // ── Auto-refresh timer ──────────────────────────────────────────────────────
  useEffect(() => {
    if (refreshTimerRef.current) clearInterval(refreshTimerRef.current);

    const intervalMs = (settings.refreshInterval || 5) * 60 * 1000;
    refreshTimerRef.current = setInterval(() => {
      if (usernames.github || usernames.leetcode) {
        fetchData(usernames);
      }
    }, intervalMs);

    return () => clearInterval(refreshTimerRef.current);
  }, [settings.refreshInterval, usernames]);

  // Update "time since refresh" display every 30 seconds
  useEffect(() => {
    const t = setInterval(() => {
      setRefreshTime(timeSince(lastRefresh));
    }, 30_000);
    setRefreshTime(timeSince(lastRefresh));
    return () => clearInterval(t);
  }, [lastRefresh]);

  // ── Data fetching ───────────────────────────────────────────────────────────
  const fetchData = useCallback(async (names = usernames) => {
    if (!names.github && !names.leetcode) return;
    setLoading(true);
    try {
      const { github, leetcode } = await fetchAllData(names);
      setGithubData(github);
      setLeetcodeData(leetcode);
      setLastRefresh(new Date());
      setRefreshTime('just now');
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [usernames]);

  // ── Settings save ───────────────────────────────────────────────────────────
  const handleSaveSettings = useCallback(async ({ usernames: newNames, settings: newSettings }) => {
    setUsernames(newNames);
    setSettings(prev => ({ ...prev, ...newSettings }));
    if (isElectron) {
      await api.saveUsernames(newNames);
      await api.saveSettings(newSettings);
    }
    setView('widget');
    // Immediately fetch with new usernames
    fetchData(newNames);
  }, [fetchData]);

  // ── Window controls ─────────────────────────────────────────────────────────
  const handleMinimize = () => isElectron && api.minimizeToTray();
  const handleQuit     = () => isElectron && api.quitApp();

  const handleToggleCompact = () => {
    const next = !compact;
    setCompact(next);
    if (isElectron) api.saveSettings({ compactMode: next });
  };

  // ── No usernames prompt ─────────────────────────────────────────────────────
  const hasUsernames = usernames.github || usernames.leetcode;

  return (
    <div className="app">
      {/* Title bar always visible */}
      <TitleBar
        onSettingsClick={() => setView(view === 'settings' ? 'widget' : 'settings')}
        onMinimize={handleMinimize}
        onQuit={handleQuit}
        isCompact={compact}
        onToggleCompact={handleToggleCompact}
      />

      {/* Settings view */}
      {view === 'settings' && (
        <SettingsPanel
          usernames={usernames}
          settings={settings}
          onSave={handleSaveSettings}
          onClose={() => setView('widget')}
        />
      )}

      {/* Widget view */}
      {view === 'widget' && (
        <div className="widget-body">

          {/* First-run prompt */}
          {!hasUsernames && (
            <div className="onboard">
              <div className="onboard-icon">◈</div>
              <p className="onboard-title">Welcome to DevTrack</p>
              <p className="onboard-subtitle">Click ⚙ to add your GitHub and LeetCode usernames</p>
              <button className="onboard-btn" onClick={() => setView('settings')}>
                Get Started →
              </button>
            </div>
          )}

          {/* Cards */}
          {hasUsernames && (
            <>
              <GitHubCard
                data={githubData}
                loading={loading && !githubData}
                compact={compact}
              />
              <LeetCodeCard
                data={leetcodeData}
                loading={loading && !leetcodeData}
                compact={compact}
              />
            </>
          )}

          {/* Footer: last refresh + refresh button */}
          {hasUsernames && (
            <div className="widget-footer">
              <span className="last-refresh">
                {loading ? (
                  <span className="refresh-loading">
                    <span className="dot-spin">⟳</span> Updating...
                  </span>
                ) : (
                  refreshTime ? `Updated ${refreshTime}` : 'Not yet refreshed'
                )}
              </span>
              <button
                className={`refresh-btn ${loading ? 'refresh-btn--loading' : ''}`}
                onClick={() => fetchData()}
                disabled={loading || !hasUsernames}
                title="Refresh data"
              >
                <span className={loading ? 'spinning' : ''}>⟳</span>
              </button>
            </div>
          )}
        </div>
      )}

      <style>{`
        .app {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100vh;
          background: var(--bg-base);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-subtle);
          overflow: hidden;
          box-shadow:
            0 24px 48px rgba(0, 0, 0, 0.6),
            0 0 0 1px rgba(255,255,255,0.04) inset;
        }

        .widget-body {
          flex: 1;
          overflow-y: auto;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        /* Onboarding */
        .onboard {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          text-align: center;
          padding: 24px 16px;
          animation: fadeIn 0.4s ease;
        }

        .onboard-icon {
          font-size: 32px;
          color: var(--accent-green);
          animation: glowPulse 3s ease infinite;
        }

        .onboard-title {
          font-family: var(--font-display);
          font-size: 16px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .onboard-subtitle {
          font-size: 11px;
          color: var(--text-secondary);
          line-height: 1.5;
          max-width: 200px;
        }

        .onboard-btn {
          margin-top: 8px;
          padding: 8px 20px;
          background: rgba(0, 255, 136, 0.1);
          border: 1px solid rgba(0, 255, 136, 0.3);
          border-radius: var(--radius-sm);
          color: var(--accent-green);
          font-family: var(--font-mono);
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition);
          letter-spacing: 0.05em;
        }

        .onboard-btn:hover {
          background: rgba(0, 255, 136, 0.18);
          box-shadow: 0 0 16px rgba(0, 255, 136, 0.2);
        }

        /* Footer */
        .widget-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 4px 0 2px;
          border-top: 1px solid var(--border-subtle);
          margin-top: auto;
        }

        .last-refresh {
          font-size: 10px;
          color: var(--text-muted);
        }

        .refresh-loading {
          display: flex;
          align-items: center;
          gap: 4px;
          color: var(--accent-green);
        }

        .dot-spin {
          animation: spin 1s linear infinite;
          display: inline-block;
        }

        .refresh-btn {
          width: 28px;
          height: 28px;
          border: 1px solid var(--border-subtle);
          background: var(--bg-card);
          color: var(--text-secondary);
          border-radius: var(--radius-sm);
          cursor: pointer;
          font-size: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition);
        }

        .refresh-btn:hover:not(:disabled) {
          border-color: rgba(0, 255, 136, 0.3);
          color: var(--accent-green);
          background: rgba(0, 255, 136, 0.08);
        }

        .refresh-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
