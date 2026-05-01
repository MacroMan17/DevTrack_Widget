// src/components/LeetCodeCard.jsx — Displays LeetCode stats

import React from 'react';

// Difficulty bar — shows Easy/Medium/Hard breakdown visually
function DifficultyBar({ easy, medium, hard }) {
  const total = easy + medium + hard || 1;
  const easyPct   = (easy   / total) * 100;
  const mediumPct = (medium / total) * 100;
  const hardPct   = (hard   / total) * 100;

  return (
    <div className="diff-container">
      {/* Labels */}
      <div className="diff-labels">
        <span className="diff-label diff-label--easy">E: {easy}</span>
        <span className="diff-label diff-label--medium">M: {medium}</span>
        <span className="diff-label diff-label--hard">H: {hard}</span>
      </div>
      {/* Progress bar */}
      <div className="diff-bar">
        <div className="diff-bar-fill diff-bar-fill--easy"   style={{ width: `${easyPct}%` }} />
        <div className="diff-bar-fill diff-bar-fill--medium" style={{ width: `${mediumPct}%` }} />
        <div className="diff-bar-fill diff-bar-fill--hard"   style={{ width: `${hardPct}%` }} />
      </div>
    </div>
  );
}

// Streak flame display
function StreakBadge({ streak, solvedToday }) {
  return (
    <div className={`streak-badge ${solvedToday ? 'streak-badge--active' : ''}`}>
      <span className="streak-fire">{streak > 0 ? '🔥' : '❄️'}</span>
      <div>
        <span className="streak-count">{streak}</span>
        <span className="streak-label">day streak</span>
      </div>
    </div>
  );
}

export default function LeetCodeCard({ data, loading, compact }) {
  if (loading) {
    return (
      <div className="card card--leetcode skeleton-card">
        <div className="card-header">
          <div className="skeleton skeleton-avatar" />
          <div>
            <div className="skeleton skeleton-text" style={{ width: 90 }} />
            <div className="skeleton skeleton-text" style={{ width: 60, marginTop: 4 }} />
          </div>
        </div>
        <div className="skeleton skeleton-bar" />
        <div className="skeleton-stats-2">
          {[1,2].map(i => <div key={i} className="skeleton skeleton-stat2" />)}
        </div>
      </div>
    );
  }

  if (data?.error) {
    return (
      <div className="card card--leetcode card--error">
        <div className="card-icon" style={{ color: 'var(--accent-orange)' }}>⚠</div>
        <p className="error-msg">LeetCode: {data.error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="card card--leetcode card--empty">
        <div className="card-icon" style={{ color: 'var(--accent-orange)', fontSize: 22 }}>🧩</div>
        <p className="empty-msg">Enter LeetCode username</p>
      </div>
    );
  }

  return (
    <div className="card card--leetcode fade-in">
      {/* Header */}
      <div className="card-header">
        <img
          src={data.avatarUrl || `https://ui-avatars.com/api/?name=${data.username}&background=141720&color=ff8c42`}
          alt={data.username}
          className="avatar"
          onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${data.username}&background=141720&color=ff8c42`; }}
        />
        <div>
          <div className="card-platform">🧩 LeetCode</div>
          <div className="card-username">@{data.username}</div>
          {data.solvedToday && (
            <div className="today-badge today-badge--orange">✓ Solved today</div>
          )}
          {!data.solvedToday && (
            <div className="today-badge today-badge--warning">⚡ No solve today!</div>
          )}
        </div>
      </div>

      {!compact && (
        <>
          {/* Total solved — big number */}
          <div className="lc-total">
            <span className="lc-total-number">{data.total}</span>
            <span className="lc-total-label">problems solved</span>
          </div>

          {/* Difficulty breakdown */}
          <DifficultyBar easy={data.easy} medium={data.medium} hard={data.hard} />

          {/* Streak + ranking */}
          <div className="lc-bottom">
            <StreakBadge streak={data.streak} solvedToday={data.solvedToday} />
            {data.ranking && (
              <div className="lc-rank">
                <span className="lc-rank-label">Rank</span>
                <span className="lc-rank-value">#{data.ranking.toLocaleString()}</span>
              </div>
            )}
          </div>
        </>
      )}

      {compact && (
        <div className="compact-stats">
          <span style={{ color: 'var(--accent-orange)' }}>{data.total} solved</span>
          <span className="dot">·</span>
          <span>{data.streak}🔥</span>
        </div>
      )}

      <style>{`
        .card--leetcode {
          border-top: 2px solid var(--accent-orange);
        }

        .card-platform {
          font-size: 10px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 2px;
        }

        .today-badge--orange {
          background: rgba(255, 140, 66, 0.1);
          color: var(--accent-orange);
          border: 1px solid rgba(255, 140, 66, 0.2);
        }

        .today-badge--warning {
          background: rgba(255, 77, 109, 0.08);
          color: var(--accent-red);
          border: 1px solid rgba(255, 77, 109, 0.15);
        }

        .lc-total {
          display: flex;
          align-items: baseline;
          gap: 6px;
          margin-bottom: 10px;
        }

        .lc-total-number {
          font-family: var(--font-display);
          font-size: 32px;
          font-weight: 800;
          color: var(--accent-orange);
          line-height: 1;
          animation: countUp 0.5s ease forwards;
        }

        .lc-total-label {
          font-size: 10px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        /* Difficulty bar */
        .diff-container {
          margin-bottom: 12px;
        }

        .diff-labels {
          display: flex;
          gap: 8px;
          margin-bottom: 4px;
        }

        .diff-label {
          font-size: 10px;
          font-weight: 600;
        }

        .diff-label--easy   { color: #00b8a3; }
        .diff-label--medium { color: var(--accent-orange); }
        .diff-label--hard   { color: var(--accent-red); }

        .diff-bar {
          display: flex;
          height: 4px;
          border-radius: 2px;
          overflow: hidden;
          background: var(--bg-base);
          gap: 2px;
        }

        .diff-bar-fill {
          height: 100%;
          border-radius: 2px;
          transition: width 0.6s ease;
        }

        .diff-bar-fill--easy   { background: #00b8a3; }
        .diff-bar-fill--medium { background: var(--accent-orange); }
        .diff-bar-fill--hard   { background: var(--accent-red); }

        /* Bottom row */
        .lc-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .streak-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          background: var(--bg-base);
          border-radius: var(--radius-sm);
          padding: 6px 10px;
          border: 1px solid var(--border-subtle);
          transition: border-color var(--transition);
        }

        .streak-badge--active {
          border-color: rgba(255, 140, 66, 0.3);
          box-shadow: 0 0 12px rgba(255, 140, 66, 0.1);
        }

        .streak-fire {
          font-size: 16px;
        }

        .streak-count {
          display: block;
          font-size: 16px;
          font-weight: 700;
          font-family: var(--font-display);
          color: var(--accent-orange);
          line-height: 1;
        }

        .streak-label {
          display: block;
          font-size: 9px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .lc-rank {
          text-align: right;
        }

        .lc-rank-label {
          display: block;
          font-size: 9px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .lc-rank-value {
          font-size: 14px;
          font-weight: 700;
          font-family: var(--font-display);
          color: var(--accent-purple);
        }

        /* Skeleton */
        .skeleton-bar {
          height: 4px;
          margin-bottom: 10px;
        }

        .skeleton-stats-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .skeleton-stat2 {
          height: 44px;
          border-radius: var(--radius-sm);
        }
      `}</style>
    </div>
  );
}
