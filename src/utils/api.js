// src/utils/api.js — Data fetching for GitHub and LeetCode

// ── GitHub API ────────────────────────────────────────────────────────────────
// Uses the official GitHub REST API (no auth needed for public data, 60 req/hr)

export async function fetchGitHubData(username) {
  if (!username) throw new Error('No username provided');

  // Fetch user profile
  const userRes = await fetch(`https://api.github.com/users/${username}`);
  if (!userRes.ok) {
    if (userRes.status === 404) throw new Error(`GitHub user "${username}" not found`);
    if (userRes.status === 403) throw new Error('GitHub API rate limit reached. Try again later.');
    throw new Error(`GitHub API error: ${userRes.status}`);
  }
  const user = await userRes.json();

  // Fetch recent events (to count commits in the last 30 days)
  const eventsRes = await fetch(
    `https://api.github.com/users/${username}/events/public?per_page=100`
  );
  const events = eventsRes.ok ? await eventsRes.json() : [];

  // Count push events (commits) in the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentCommits = events
    .filter((e) => e.type === 'PushEvent' && new Date(e.created_at) > thirtyDaysAgo)
    .reduce((sum, e) => sum + (e.payload?.commits?.length || 0), 0);

  // Check if there was a commit today
  const today = new Date().toDateString();
  const commitedToday = events.some(
    (e) => e.type === 'PushEvent' && new Date(e.created_at).toDateString() === today
  );

  return {
    username: user.login,
    name: user.name || user.login,
    avatarUrl: user.avatar_url,
    publicRepos: user.public_repos,
    followers: user.followers,
    following: user.following,
    recentCommits,     // commits in last 30 days
    commitedToday,
    profileUrl: user.html_url,
  };
}

// ── LeetCode API ──────────────────────────────────────────────────────────────
// Using a public LeetCode API wrapper that handles CORS and authentication

export async function fetchLeetCodeData(username) {
  if (!username) throw new Error('No username provided');

  try {
    console.log(`[LeetCode] Fetching data for: ${username}`);
    
    // Try the most reliable public API first
    const res = await fetch(`https://leetcode-api.vercel.app/${username}`, {
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
      name: data.name || data.username || username,
      avatarUrl: data.avatar,
      ranking: data.ranking,
      total: data.totalSolved || 0,
      easy: data.easySolved || 0,
      medium: data.mediumSolved || 0,
      hard: data.hardSolved || 0,
      streak: data.streak || 0,
      totalActiveDays: data.totalActiveDays || 0,
      solvedToday: false,
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
    
    const res = await fetch(`https://alfa-leetcode-api.onrender.com/userProfile/${username}`, {
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
      name: data.name || data.username || username,
      avatarUrl: data.avatar,
      ranking: data.ranking,
      total: data.totalSolved || 0,
      easy: data.easySolved || 0,
      medium: data.mediumSolved || 0,
      hard: data.hardSolved || 0,
      streak: data.streak || 0,
      totalActiveDays: data.totalActiveDays || 0,
      solvedToday: false,
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
