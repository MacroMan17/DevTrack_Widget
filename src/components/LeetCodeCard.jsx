// src/components/LeetCodeCard.jsx — Displays LeetCode stats

import React, { useState, useMemo } from 'react';

// Build an array of { date, count } for the last N days from submissionCalendar
function buildDailyData(submissionCalendar, days) {
  let calendar = {};
  if (submissionCalendar) {
    try {
      calendar = typeof submissionCalendar === 'string'
        ? JSON.parse(submissionCalendar)
        : submissionCalendar;
    } catch { calendar = {}; }
  }

  // Convert timestamp → local date string (YYYY-MM-DD) using local timezone
  const toLocalDate = (ts) => {
    const d = new Date(parseInt(ts) * 1000);
    const year  = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day   = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Map local date → total count
  const dateMap = {};
  Object.entries(calendar).forEach(([ts, count]) => {
    const key = toLocalDate(ts);
    dateMap[key] = (dateMap[key] || 0) + count;
  });

  // Build last N days array (oldest → newest) using local dates
  const result = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = toLocalDate(d.getTime() / 1000);
    result.push({ date: key, count: dateMap[key] || 0 });
  }
  return result;
}

// Calculate longest streak from daily data array
function calcLongestStreak(dailyData) {
  let longest = 0, current = 0;
  for (const { count } of dailyData) {
    if (count > 0) { current++; longest = Math.max(longest, current); }
    else current = 0;
  }
  return longest;
}

// Streak Graph component — VERTICAL GRID LAYOUT
function StreakGraph({ submissionCalendar, currentStreak }) {
  const [window, setWindow] = useState(30);
  const [tooltip, setTooltip] = useState(null);

  const dailyData = useMemo(
    () => buildDailyData(submissionCalendar, window),
    [submissionCalendar, window]
  );

  const longestStreak = useMemo(() => calcLongestStreak(dailyData), [dailyData]);

  const getColor = (count) => {
    if (count === 0) return '#1a1a2e';
    if (count === 1) return '#1a4a2e';
    if (count <= 3) return '#2d8a4e';
    return '#39d353';
  };

  const CELL = 18;
  const GAP = 4;
  const COLS = 10;
  const rows = Math.ceil(dailyData.length / COLS);
  const gridWidth = COLS * (CELL + GAP) - GAP;
  const gridHeight = rows * (CELL + GAP) - GAP;

  const handleMouseEnter = (e, date, count) => {
    const wrap = e.target.closest('.streak-grid-wrap');
    const cellRect = e.target.getBoundingClientRect();
    const wrapRect = wrap.getBoundingClientRect();
    setTooltip({
      x: cellRect.left - wrapRect.left + CELL / 2,
      y: cellRect.top - wrapRect.top - 8,
      text: `${date} — ${count} submission${count !== 1 ? 's' : ''}`,
    });
  };

  return (
    <div className="streak-graph">
      {/* Header */}
      <div className="streak-graph-header">
        <span className="streak-graph-title">Submission Activity</span>
        <div className="streak-window-toggle">
          <button
            className={`toggle-btn ${window === 30 ? 'toggle-btn--active' : ''}`}
            onClick={() => setWindow(30)}
          >30d</button>
          <button
            className={`toggle-btn ${window === 90 ? 'toggle-btn--active' : ''}`}
            onClick={() => setWindow(90)}
          >90d</button>
        </div>
      </div>

      {/* Grid — vertically scrollable */}
      <div className="streak-grid-wrap" onMouseLeave={() => setTooltip(null)}>
        {tooltip && (
          <div className="sg-tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
            {tooltip.text}
          </div>
        )}
        <svg width={gridWidth} height={gridHeight} style={{ display: 'block' }}>
          {dailyData.map(({ date, count }, idx) => {
            const row = Math.floor(idx / COLS);
            const col = idx % COLS;
            const x = col * (CELL + GAP);
            const y = row * (CELL + GAP);
            return (
              <rect
                key={date}
                x={x}
                y={y}
                width={CELL}
                height={CELL}
                rx="3"
                fill={getColor(count)}
                style={{ cursor: 'pointer' }}
                onMouseEnter={(e) => handleMouseEnter(e, date, count)}
              />
            );
          })}
        </svg>
      </div>

      {/* Stats */}
      <div className="streak-stats">
        <div className="streak-stat">
          <span className="streak-stat-value" style={{ color: '#39d353' }}>
            {currentStreak > 0 ? '🔥' : '❄️'} {currentStreak}
          </span>
          <span className="streak-stat-label">Current streak</span>
        </div>
        <div className="streak-stat">
          <span className="streak-stat-value" style={{ color: 'var(--accent-purple)' }}>
            ⚡ {longestStreak}
          </span>
          <span className="streak-stat-label">Longest ({window}d)</span>
        </div>
      </div>
    </div>
  );
}

// Difficulty breakdown with pill badges
function DifficultyBar({ easy, medium, hard }) {
  const total = easy + medium + hard || 1;
  const easyPct   = (easy   / total) * 100;
  const mediumPct = (medium / total) * 100;
  const hardPct   = (hard   / total) * 100;

  return (
    <div className="diff-container">
      {/* Pill badges */}
      <div className="diff-pills">
        <span className="diff-pill diff-pill--easy">
          <span className="diff-pill-dot" />
          Easy <strong>{easy}</strong>
        </span>
        <span className="diff-pill diff-pill--medium">
          <span className="diff-pill-dot" />
          Med <strong>{medium}</strong>
        </span>
        <span className="diff-pill diff-pill--hard">
          <span className="diff-pill-dot" />
          Hard <strong>{hard}</strong>
        </span>
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

// Streak flame display — kept for compact mode only
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

          {/* Streak graph */}
          <StreakGraph
            submissionCalendar={data.submissionCalendar}
            currentStreak={data.streak}
          />

          {/* Ranking */}
          {data.ranking && (
            <div className="lc-rank-row">
              <span className="lc-rank-label">Global Rank</span>
              <span className="lc-rank-value">#{data.ranking.toLocaleString()}</span>
            </div>
          )}
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
          border: none;
          background:
            linear-gradient(var(--bg-card), var(--bg-card)) padding-box,
            linear-gradient(135deg, var(--accent-orange), rgba(255,140,66,0.1), transparent 60%) border-box;
          border: 1.5px solid transparent;
        }

        .card--leetcode:hover {
          background:
            linear-gradient(var(--bg-card-hover), var(--bg-card-hover)) padding-box,
            linear-gradient(135deg, var(--accent-orange), rgba(255,140,66,0.15), transparent 60%) border-box;
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
          font-size: 24px;
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

        .diff-pills {
          display: flex;
          gap: 6px;
          margin-bottom: 8px;
        }

        .diff-pill {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 3px 8px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.02em;
        }

        .diff-pill strong {
          font-weight: 700;
          font-family: var(--font-display);
          font-size: 11px;
        }

        .diff-pill-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .diff-pill--easy {
          background: rgba(0, 184, 163, 0.12);
          color: #00b8a3;
          border: 1px solid rgba(0, 184, 163, 0.25);
        }
        .diff-pill--easy .diff-pill-dot { background: #00b8a3; }

        .diff-pill--medium {
          background: rgba(255, 192, 30, 0.12);
          color: #ffc01e;
          border: 1px solid rgba(255, 192, 30, 0.25);
        }
        .diff-pill--medium .diff-pill-dot { background: #ffc01e; }

        .diff-pill--hard {
          background: rgba(255, 77, 109, 0.12);
          color: var(--accent-red);
          border: 1px solid rgba(255, 77, 109, 0.25);
        }
        .diff-pill--hard .diff-pill-dot { background: var(--accent-red); }

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

        /* Streak graph */
        .streak-graph {
          background: var(--bg-base);
          border-radius: var(--radius-sm);
          padding: 10px;
          border: 1px solid var(--border-subtle);
          margin-bottom: 10px;
        }

        .streak-graph-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .streak-graph-title {
          font-size: 9px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .streak-window-toggle {
          display: flex;
          gap: 3px;
        }

        .toggle-btn {
          padding: 2px 7px;
          font-size: 9px;
          font-family: var(--font-mono);
          border-radius: 4px;
          border: 1px solid var(--border-subtle);
          background: transparent;
          color: var(--text-muted);
          cursor: pointer;
          transition: all var(--transition);
        }

        .toggle-btn--active {
          background: rgba(255, 161, 22, 0.15);
          border-color: rgba(255, 161, 22, 0.4);
          color: #ffa116;
        }

        .toggle-btn:hover:not(.toggle-btn--active) {
          background: var(--bg-elevated);
          color: var(--text-secondary);
        }

        .streak-grid-wrap {
          width: 100%;
          max-height: 90px;
          overflow-y: auto;
          overflow-x: hidden;
          margin-bottom: 8px;
          position: relative;
          scrollbar-width: thin;
          scrollbar-color: var(--border-subtle) transparent;
          padding: 4px 0;
        }

        .streak-grid-wrap::-webkit-scrollbar {
          width: 3px;
        }

        .streak-grid-wrap::-webkit-scrollbar-track {
          background: transparent;
        }

        .streak-grid-wrap::-webkit-scrollbar-thumb {
          background: var(--border-subtle);
          border-radius: 2px;
        }

        .sg-tooltip {
          position: absolute;
          transform: translate(-50%, -100%);
          background: var(--bg-elevated);
          border: 1px solid var(--border-subtle);
          color: var(--text-primary);
          font-size: 10px;
          font-family: var(--font-mono);
          padding: 4px 8px;
          border-radius: 5px;
          white-space: nowrap;
          pointer-events: none;
          z-index: 10;
          box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        }

        .streak-stats {
          display: flex;
          justify-content: space-around;
          padding-top: 6px;
          border-top: 1px solid var(--border-subtle);
        }

        .streak-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }

        .streak-stat-value {
          font-size: 13px;
          font-weight: 700;
          font-family: var(--font-display);
          line-height: 1;
        }

        .streak-stat-label {
          font-size: 9px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        /* Rank row */
        .lc-rank-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 10px;
          background: var(--bg-base);
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-subtle);
        }

        .lc-rank-label {
          font-size: 9px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .lc-rank-value {
          font-size: 13px;
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
