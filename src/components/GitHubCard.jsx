// src/components/GitHubCard.jsx — Displays GitHub stats with sparkline, heatmap, and streaks

import React, { useState, useMemo } from 'react';

// Animated number display
function StatNumber({ value, label, color, delta }) {
  return (
    <div className="stat-item">
      <span className="stat-value" style={{ color: color || 'var(--text-primary)' }}>
        {value ?? '—'}
      </span>
      {delta !== undefined && (
        <span className="stat-delta" style={{ color: delta > 0 ? '#39d353' : delta < 0 ? '#ff4d6d' : 'var(--text-muted)' }}>
          {delta > 0 ? '+' : ''}{delta}
        </span>
      )}
      <span className="stat-label">{label}</span>
    </div>
  );
}

// Sparkline component
function Sparkline({ dailyData, window, setWindow }) {
  const [tooltip, setTooltip] = useState(null);

  // Calculate average for color determination
  const avg = dailyData.reduce((sum, d) => sum + d.count, 0) / dailyData.length;
  
  // Get current week (last 7 days) average
  const currentWeekAvg = dailyData.slice(-7).reduce((sum, d) => sum + d.count, 0) / 7;
  
  // Determine line color
  const lineColor = currentWeekAvg >= avg ? '#39d353' : '#ff4d6d';

  // Find max for scaling
  const max = Math.max(...dailyData.map(d => d.count), 1);
  
  const WIDTH = 280;
  const HEIGHT = 40;
  const PADDING = 4;
  const graphWidth = WIDTH - PADDING * 2;
  const graphHeight = HEIGHT - PADDING * 2;
  
  const points = dailyData.map((d, i) => {
    const x = PADDING + (i / (dailyData.length - 1)) * graphWidth;
    const y = PADDING + graphHeight - (d.count / max) * graphHeight;
    return { x, y, ...d };
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${points[points.length - 1].x} ${HEIGHT} L ${PADDING} ${HEIGHT} Z`;

  const handleMouseMove = (e) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    
    // Find closest point
    const closest = points.reduce((prev, curr) => 
      Math.abs(curr.x - x) < Math.abs(prev.x - x) ? curr : prev
    );
    
    setTooltip({
      x: closest.x,
      y: closest.y - 8,
      text: `${closest.date} — ${closest.count} commit${closest.count !== 1 ? 's' : ''}`,
    });
  };

  return (
    <div className="sparkline-container">
      <div className="sparkline-header">
        <span className="sparkline-title">Contribution Trend</span>
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
      
      <div className="sparkline-wrap" onMouseLeave={() => setTooltip(null)}>
        {tooltip && (
          <div className="sg-tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
            {tooltip.text}
          </div>
        )}
        <svg width={WIDTH} height={HEIGHT} onMouseMove={handleMouseMove} style={{ display: 'block' }}>
          {/* Area fill */}
          <path d={areaD} fill={lineColor} opacity="0.1" />
          {/* Line */}
          <path d={pathD} stroke={lineColor} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          {/* Points */}
          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="2" fill={lineColor} opacity="0.6" />
          ))}
        </svg>
      </div>
    </div>
  );
}

// Contribution heatmap (same as LeetCode)
function ContributionHeatmap({ dailyData }) {
  const [tooltip, setTooltip] = useState(null);

  const getColor = (count) => {
    if (count === 0) return '#161b22';
    if (count === 1) return '#0e4429';
    if (count <= 3) return '#006d32';
    if (count <= 5) return '#26a641';
    return '#39d353';
  };

  const CELL = 18;
  const GAP = 4;
  const COLS = 10;
  const rows = Math.ceil(dailyData.length / COLS);
  const gridWidth = COLS * (CELL + GAP) - GAP;
  const gridHeight = rows * (CELL + GAP) - GAP;

  const handleMouseEnter = (e, date, count) => {
    const wrap = e.target.closest('.contrib-grid-wrap');
    const cellRect = e.target.getBoundingClientRect();
    const wrapRect = wrap.getBoundingClientRect();
    setTooltip({
      x: cellRect.left - wrapRect.left + CELL / 2,
      y: cellRect.top - wrapRect.top - 8,
      text: `${date} — ${count} commit${count !== 1 ? 's' : ''}`,
    });
  };

  return (
    <div className="contrib-heatmap">
      <div className="heatmap-title">Contribution Activity</div>
      <div className="contrib-grid-wrap" onMouseLeave={() => setTooltip(null)}>
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
    </div>
  );
}

export default function GitHubCard({ data, loading, compact }) {
  const [window, setWindow] = useState(30);

  const dailyData = useMemo(() => {
    if (!data?.dailyData30) return [];
    return window === 30 ? data.dailyData30 : data.dailyData90;
  }, [data, window]);

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

  // Calculate commits delta (this week vs last week)
  const thisWeekCommits = data.dailyData30?.slice(-7).reduce((sum, d) => sum + d.count, 0) || 0;
  const lastWeekCommits = data.dailyData30?.slice(-14, -7).reduce((sum, d) => sum + d.count, 0) || 0;
  const commitsDelta = thisWeekCommits - lastWeekCommits;

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

      {!compact && (
        <>
          {/* Sparkline */}
          {dailyData.length > 0 && (
            <Sparkline dailyData={dailyData} window={window} setWindow={setWindow} />
          )}

          {/* Stats */}
          <div className="stats-grid">
            <StatNumber value={data.publicRepos} label="Repos" color="var(--accent-blue)" />
            <StatNumber value={data.followers} label="Followers" color="var(--accent-purple)" />
            <StatNumber value={data.recentCommits} label="Commits/30d" color="var(--accent-green)" delta={commitsDelta} />
          </div>

          {/* Contribution Heatmap */}
          {dailyData.length > 0 && (
            <ContributionHeatmap dailyData={dailyData} />
          )}

          {/* Streak Stats */}
          <div className="streak-stats">
            <div className="streak-stat">
              <span className="streak-stat-value" style={{ color: '#39d353' }}>
                {data.currentStreak > 0 ? '🔥' : '❄️'} {data.currentStreak}
              </span>
              <span className="streak-stat-label">Current streak</span>
            </div>
            <div className="streak-stat">
              <span className="streak-stat-value" style={{ color: 'var(--accent-purple)' }}>
                ⚡ {data.longestStreak}
              </span>
              <span className="streak-stat-label">Longest streak</span>
            </div>
          </div>

          {/* Top Language Badge */}
          {data.topLanguage && (
            <div className="top-language-badge">
              <span className="lang-dot" />
              {data.topLanguage}
            </div>
          )}
        </>
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

        .card--github {
          border: none;
          background:
            linear-gradient(var(--bg-card), var(--bg-card)) padding-box,
            linear-gradient(135deg, var(--accent-green), rgba(0,255,136,0.1), transparent 60%) border-box;
          border: 1.5px solid transparent;
        }

        .card--github:hover {
          background:
            linear-gradient(var(--bg-card-hover), var(--bg-card-hover)) padding-box,
            linear-gradient(135deg, var(--accent-green), rgba(0,255,136,0.15), transparent 60%) border-box;
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

        /* Sparkline */
        .sparkline-container {
          background: var(--bg-base);
          border-radius: var(--radius-sm);
          padding: 10px;
          border: 1px solid var(--border-subtle);
          margin-bottom: 10px;
        }

        .sparkline-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .sparkline-title {
          font-size: 9px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .sparkline-wrap {
          position: relative;
          width: 100%;
          overflow-x: auto;
          overflow-y: hidden;
          scrollbar-width: thin;
          scrollbar-color: var(--border-subtle) transparent;
        }

        .sparkline-wrap::-webkit-scrollbar {
          height: 3px;
        }

        .sparkline-wrap::-webkit-scrollbar-track {
          background: transparent;
        }

        .sparkline-wrap::-webkit-scrollbar-thumb {
          background: var(--border-subtle);
          border-radius: 2px;
        }

        /* Stats */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin-bottom: 10px;
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

        .stat-delta {
          font-size: 8px;
          font-weight: 600;
          font-family: var(--font-mono);
        }

        .stat-label {
          font-size: 9px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          text-align: center;
        }

        /* Contribution Heatmap */
        .contrib-heatmap {
          background: var(--bg-base);
          border-radius: var(--radius-sm);
          padding: 10px;
          border: 1px solid var(--border-subtle);
          margin-bottom: 10px;
        }

        .heatmap-title {
          font-size: 9px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 8px;
        }

        .contrib-grid-wrap {
          width: 100%;
          max-height: 90px;
          overflow-y: auto;
          overflow-x: hidden;
          position: relative;
          scrollbar-width: thin;
          scrollbar-color: var(--border-subtle) transparent;
          padding: 4px 0;
        }

        .contrib-grid-wrap::-webkit-scrollbar {
          width: 3px;
        }

        .contrib-grid-wrap::-webkit-scrollbar-track {
          background: transparent;
        }

        .contrib-grid-wrap::-webkit-scrollbar-thumb {
          background: var(--border-subtle);
          border-radius: 2px;
        }

        /* Streak Stats */
        .streak-stats {
          display: flex;
          justify-content: space-around;
          padding: 10px;
          background: var(--bg-base);
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-subtle);
          margin-bottom: 10px;
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

        /* Top Language Badge */
        .top-language-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          background: var(--bg-base);
          border: 1px solid var(--border-subtle);
          border-radius: 20px;
          font-size: 10px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 10px;
        }

        .lang-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent-green);
          flex-shrink: 0;
        }

        /* Tooltip */
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

        /* Toggle button */
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
          background: rgba(0, 255, 136, 0.15);
          border-color: rgba(0, 255, 136, 0.4);
          color: var(--accent-green);
        }

        .toggle-btn:hover:not(.toggle-btn--active) {
          background: var(--bg-elevated);
          color: var(--text-secondary);
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
