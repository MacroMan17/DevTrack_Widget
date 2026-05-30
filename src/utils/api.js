// src/utils/api.js — Data fetching for GitHub and LeetCode

// ── Timeout Configuration ──────────────────────────────────────────────────────
const FETCH_TIMEOUT = 10000; // 10 seconds

// Helper: Fetch with timeout protection
async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return response;
  } catch (error) {
    clearTimeout(timeout);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - API took too long to respond');
    }
    throw error;
  }
}

// ── GitHub API ────────────────────────────────────────────────────────────────
// Uses GitHub GraphQL API for rich contribution data

// Helper: Convert date to YYYY-MM-DD format
function toDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Helper: Build daily data from contribution collection
function buildDailyCommitData(contributionCollection, days) {
  const result = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = toDateString(d);
    
    // Find contribution for this date
    const contribution = contributionCollection.find(c => c.date === dateStr);
    result.push({
      date: dateStr,
      count: contribution?.contributionCount || 0,
    });
  }
  
  return result;
}

// Helper: Calculate streak from daily data
function calcCommitStreak(dailyData) {
  let streak = 0, current = 0;
  for (const { count } of dailyData) {
    if (count > 0) { current++; streak = Math.max(streak, current); }
    else current = 0;
  }
  return streak;
}

// Helper: Calculate current streak (backwards from today)
function calcCurrentCommitStreak(dailyData) {
  let current = 0;
  for (let i = dailyData.length - 1; i >= 0; i--) {
    if (dailyData[i].count > 0) {
      current++;
    } else if (i < dailyData.length - 1) {
      break;
    }
  }
  return current;
}

export async function fetchGitHubData(username) {
  if (!username) throw new Error('No username provided');

  try {
    // Fetch user profile via REST API
    const userRes = await fetchWithTimeout(`https://api.github.com/users/${username}`);
    if (!userRes.ok) {
      if (userRes.status === 404) throw new Error(`GitHub user "${username}" not found`);
      if (userRes.status === 403) throw new Error('GitHub API rate limit reached. Try again later.');
      throw new Error(`GitHub API error: ${userRes.status}`);
    }
    const user = await userRes.json();

    // Fetch recent events (to count commits in the last 30 days and check today)
    let events = [];
    
    // Try public events first
    const publicEventsRes = await fetchWithTimeout(
      `https://api.github.com/users/${username}/events/public?per_page=300`
    );
    if (publicEventsRes.ok) {
      events = await publicEventsRes.json();
    }

    console.log(`[GitHub] Fetched ${events.length} public events for ${username}`);

    // Count push events (commits) in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    let recentCommits = events
      .filter((e) => e.type === 'PushEvent' && new Date(e.created_at) > thirtyDaysAgo)
      .reduce((sum, e) => sum + (e.payload?.commits?.length || 0), 0);

    // Check if there was a commit today
    const today = new Date().toDateString();
    let commitedToday = events.some(
      (e) => e.type === 'PushEvent' && new Date(e.created_at).toDateString() === today
    );

    console.log(`[GitHub] Recent commits (30d): ${recentCommits}, Committed today: ${commitedToday}`);

    // Always try to fetch from repositories to build daily data
    let dailyMapFromRepos = {};
    try {
      const reposRes = await fetchWithTimeout(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated&type=all`);
      if (reposRes.ok) {
        const repos = await reposRes.json();
        console.log(`[GitHub] Found ${repos.length} repositories`);
        
        // Try to get commit data from each repo
        for (const repo of repos.slice(0, 15)) {
          try {
            const commitsRes = await fetchWithTimeout(
              `https://api.github.com/repos/${username}/${repo.name}/commits?since=${thirtyDaysAgo.toISOString()}&per_page=100`
            );
            if (commitsRes.ok) {
              const commits = await commitsRes.json();
              console.log(`[GitHub] ${repo.name}: ${commits.length} commits`);
              
              // Add to recent commits count if we didn't get it from events
              if (recentCommits === 0) {
                recentCommits += commits.length;
              }
              
              // Build daily map from commits
              commits.forEach(c => {
                const commitDate = new Date(c.commit.author.date);
                const dateStr = toDateString(commitDate);
                dailyMapFromRepos[dateStr] = (dailyMapFromRepos[dateStr] || 0) + 1;
              });
              
              // Check if any commit is from today
              if (!commitedToday) {
                commitedToday = commits.some(c => 
                  new Date(c.commit.author.date).toDateString() === today
                );
              }
            }
          } catch (e) {
            console.warn(`[GitHub] Could not fetch commits from ${repo.name}:`, e.message);
          }
        }
        console.log(`[GitHub] Total commits after repo check: ${recentCommits}`);
        console.log(`[GitHub] Daily map from repos:`, dailyMapFromRepos);
      }
    } catch (e) {
      console.warn('[GitHub] Could not fetch from repositories:', e.message);
    }

    // Try to fetch contribution data from GitHub GraphQL (public data, no auth needed)
    let dailyData30 = [];
    let dailyData90 = [];
    let topLanguage = null;
    let currentStreak = 0;
    let longestStreak = 0;

    try {
      // Fetch contribution calendar data using a public endpoint
      const contribRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated&type=all`);
      if (contribRes.ok) {
        const repos = await contribRes.json();
        
        // Merge daily data from events and repos
        const dailyMap = { ...dailyMapFromRepos };
        
        // Also add from events if available
        events.forEach(e => {
          if (e.type === 'PushEvent') {
            const dateStr = toDateString(new Date(e.created_at));
            const commitCount = e.payload?.commits?.length || 0;
            dailyMap[dateStr] = (dailyMap[dateStr] || 0) + commitCount;
          }
        });

        console.log(`[GitHub] Final daily map:`, dailyMap);

        // Build 30d and 90d arrays
        const today = new Date();
        for (let i = 29; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(today.getDate() - i);
          const dateStr = toDateString(d);
          dailyData30.push({ date: dateStr, count: dailyMap[dateStr] || 0 });
        }

        for (let i = 89; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(today.getDate() - i);
          const dateStr = toDateString(d);
          dailyData90.push({ date: dateStr, count: dailyMap[dateStr] || 0 });
        }

        currentStreak = calcCurrentCommitStreak(dailyData30);
        longestStreak = calcCommitStreak(dailyData90);

        console.log(`[GitHub] Current streak: ${currentStreak}, Longest streak: ${longestStreak}`);
        console.log(`[GitHub] Daily data 30d (last 7):`, dailyData30.slice(-7));

        // Extract top language from repos
        const langMap = {};
        repos.forEach(repo => {
          if (repo.language) {
            langMap[repo.language] = (langMap[repo.language] || 0) + 1;
          }
        });
        topLanguage = Object.entries(langMap).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
      }
    } catch (e) {
      console.warn('[GitHub] Could not fetch contribution data:', e.message);
    }

    return {
      username: user.login,
      avatarUrl: user.avatar_url,
      publicRepos: user.public_repos,
      followers: user.followers,
      recentCommits,
      commitedToday,
      dailyData30,
      dailyData90,
      currentStreak,
      longestStreak,
      topLanguage,
    };
  } catch (error) {
    console.error('[GitHub] Fetch failed:', error.message);
    throw error;
  }
}

// ── LeetCode API ──────────────────────────────────────────────────────────────
// Using a public LeetCode API wrapper that handles CORS and authentication

// Calculate streak from submissionCalendar JSON string
// submissionCalendar = '{ "unix_timestamp": count, ... }'
function toLocalDateKey(ts) {
  const d = new Date(parseInt(ts) * 1000);
  const year  = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day   = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function calcStreak(submissionCalendar) {
  if (!submissionCalendar) return 0;
  try {
    const calendar = typeof submissionCalendar === 'string'
      ? JSON.parse(submissionCalendar)
      : submissionCalendar;

    // Build a Set of local date strings that have at least 1 submission
    const activeDates = new Set(
      Object.entries(calendar)
        .filter(([, count]) => count > 0)
        .map(([ts]) => toLocalDateKey(ts))
    );

    // Walk backwards from today counting consecutive active days
    let streak = 0;
    const today = new Date();

    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = toLocalDateKey(d.getTime() / 1000);

      if (activeDates.has(key)) {
        streak++;
      } else {
        if (i === 0) continue; // allow missing today
        break;
      }
    }
    return streak;
  } catch {
    return 0;
  }
}

// Check if user solved a problem today from submissionCalendar
function calcSolvedToday(submissionCalendar) {
  if (!submissionCalendar) return false;
  try {
    const calendar = typeof submissionCalendar === 'string'
      ? JSON.parse(submissionCalendar)
      : submissionCalendar;

    const todayKey = toLocalDateKey(Date.now() / 1000);

    return Object.entries(calendar).some(([ts, count]) =>
      toLocalDateKey(ts) === todayKey && count > 0
    );
  } catch {
    return false;
  }
}

export async function fetchLeetCodeData(username) {
  if (!username) throw new Error('No username provided');

  try {
    console.log(`[LeetCode] Fetching data for: ${username}`);
    
    // Try the most reliable public API first
    const res = await fetchWithTimeout(`https://leetcode-api.vercel.app/${username}`, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error(`LeetCode user "${username}" not found`);
      }
      throw new Error(`API error: ${res.status}`);
    }

    const data = await res.json();
    console.log(`[LeetCode] Success:`, data);

    // Handle case where user exists but has no stats
    if (!data || data.status === 'error') {
      throw new Error(data.message || 'User not found');
    }

    return {
      username: data.username || username,
      avatarUrl: data.avatar,
      ranking: data.ranking,
      total: data.totalSolved || 0,
      easy: data.easySolved || 0,
      medium: data.mediumSolved || 0,
      hard: data.hardSolved || 0,
      streak: data.streak || calcStreak(data.submissionCalendar),
      solvedToday: calcSolvedToday(data.submissionCalendar),
      submissionCalendar: data.submissionCalendar || null,
      profileUrl: `https://leetcode.com/${username}`,
    };
  } catch (error) {
    console.error(`[LeetCode] Fetch failed:`, error.message);
    
    // Try alternative API
    try {
      console.log(`[LeetCode] Trying alternative API...`);
      return await fetchLeetCodeDataAlternative(username);
    } catch (altError) {
      console.error(`[LeetCode] Alternative API also failed:`, altError.message);
      throw new Error(`Unable to fetch LeetCode profile: ${error.message}`);
    }
  }
}

// Alternative API using different endpoint
async function fetchLeetCodeDataAlternative(username) {
  if (!username) throw new Error('No username provided');

  try {
    console.log(`[LeetCode] Trying alternative endpoint for: ${username}`);
    
    const res = await fetchWithTimeout(`https://alfa-leetcode-api.onrender.com/userProfile/${username}`, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!res.ok) {
      throw new Error(`Alternative API error: ${res.status}`);
    }

    const data = await res.json();
    console.log(`[LeetCode] Alternative API success:`, data);

    return {
      username: data.username || username,
      avatarUrl: data.avatar,
      ranking: data.ranking,
      total: data.totalSolved || 0,
      easy: data.easySolved || 0,
      medium: data.mediumSolved || 0,
      hard: data.hardSolved || 0,
      streak: data.streak || calcStreak(data.submissionCalendar),
      solvedToday: calcSolvedToday(data.submissionCalendar),
      submissionCalendar: data.submissionCalendar || null,
      profileUrl: `https://leetcode.com/${username}`,
    };
  } catch (error) {
    console.error(`[LeetCode] Alternative API failed:`, error.message);
    throw error;
  }
}

// ── Parallel fetch both ───────────────────────────────────────────────────────
export async function fetchAllData({ github, leetcode }) {
  const results = await Promise.allSettled([
    github ? fetchGitHubData(github) : Promise.resolve(null),
    leetcode ? fetchLeetCodeData(leetcode) : Promise.resolve(null),
  ]);

  return {
    github:   results[0].status === 'fulfilled' ? results[0].value : { error: results[0].reason?.message },
    leetcode: results[1].status === 'fulfilled' ? results[1].value : { error: results[1].reason?.message },
  };
}
