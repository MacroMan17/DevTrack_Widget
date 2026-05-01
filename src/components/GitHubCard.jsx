// src/components/GitHubCard.jsx — Displays GitHub stats

import React from 'react';

// Animated number display
function StatNumber({ value, label, color }) {
  return (
    <div className="stat-item">
      <span className="stat-value" style={{ color: color || 'var(--text-primary)' }}>
        {value ?? '—'}
      </span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

export default function GitHubCard({ data, loading, compact }) {
  if (loading) {
    return (
      <div className="card card--github skeleton-card">
        <div className="card-header">
          <div className="skeleton skeleton-avatar" />
          <div>
            <div className="skeleton skeleton-text" style={{ width: 100 }} />
            <div className="skeleton skeleton-text" style={{ width: 70, marginTop: 4 }} />
          </div>
        </div>
        <div className="skeleton-stats">
          {[1,2,3].map(i => <div key={i} className="skeleton skeleton-stat" />)}
        </div>
      </div>
    );
  }

  if (data?.error) {
    return (
      <div className="card card--github card--error">
        <div className="card-icon">⚠</div>
        <p className="error-msg">GitHub: {data.error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="card card--github card--empty">
        <div className="card-icon" style={{ color: 'var(--accent-green)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
          </svg>
        </div>
        <p className="empty-msg">Enter GitHub username</p>
      </div>
    );
  }

  return (
    <div className="card card--github fade-in">
      {/* Header */}
      <div className="card-header">
        <img
          src={data.avatarUrl}
          alt={data.username}
          className="avatar"
          onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${data.username}&background=141720&color=00ff88`; }}
        />
        <div>
          <div className="card-platform">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 4 }}>
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            GitHub
          </div>
          <div className="card-username">@{data.username}</div>
          {data.commitedToday && (
            <div className="today-badge today-badge--green">✓ Committed today</div>
          )}
        </div>
      </div>

      {/* Stats */}
      {!compact && (
        <div className="stats-grid">
          <StatNumber value={data.publicRepos} label="Repos" color="var(--accent-blue)" />
          <StatNumber value={data.followers}   label="Followers" color="var(--accent-purple)" />
          <StatNumber value={data.recentCommits} label="Commits/30d" color="var(--accent-green)" />
        </div>
      )}

      {compact && (
        <div className="compact-stats">
          <span style={{ color: 'var(--accent-blue)' }}>{data.publicRepos} repos</span>
          <span className="dot">·</span>
          <span style={{ color: 'var(--accent-green)' }}>{data.recentCommits} commits</span>
        </div>
      )}

      <style>{`
        .card {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 14px;
          transition: background var(--transition);
        }

        .card:hover {
          background: var(--bg-card-hover);
        }

        .card--github {
          border-top: 2px solid var(--accent-green);
        }

        .card--error, .card--empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 80px;
          text-align: center;
        }

        .card-icon {
          font-size: 20px;
          opacity: 0.6;
        }

        .error-msg, .empty-msg {
          color: var(--text-secondary);
          font-size: 11px;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }

        .avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 2px solid var(--border-subtle);
          object-fit: cover;
          flex-shrink: 0;
        }

        .card-platform {
          display: flex;
          align-items: center;
          font-size: 10px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 2px;
        }

        .card-username {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .today-badge {
          display: inline-block;
          font-size: 9px;
          padding: 1px 6px;
          border-radius: 10px;
          margin-top: 3px;
          font-weight: 600;
          letter-spacing: 0.05em;
        }

        .today-badge--green {
          background: rgba(0, 255, 136, 0.1);
          color: var(--accent-green);
          border: 1px solid rgba(0, 255, 136, 0.2);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          background: var(--bg-base);
          border-radius: var(--radius-sm);
          padding: 8px 4px;
          animation: countUp 0.4s ease forwards;
        }

        .stat-value {
          font-size: 18px;
          font-weight: 700;
          font-family: var(--font-display);
          line-height: 1;
        }

        .stat-label {
          font-size: 9px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          text-align: center;
        }

        .compact-stats {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: var(--text-secondary);
        }

        .dot {
          color: var(--text-muted);
        }

        /* Skeleton loading */
        .skeleton-card {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .skeleton {
          background: linear-gradient(90deg, var(--bg-elevated) 25%, var(--bg-card-hover) 50%, var(--bg-elevated) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: var(--radius-sm);
        }

        .skeleton-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .skeleton-text {
          height: 10px;
        }

        .skeleton-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        .skeleton-stat {
          height: 52px;
          border-radius: var(--radius-sm);
        }
      `}</style>
    </div>
  );
}
