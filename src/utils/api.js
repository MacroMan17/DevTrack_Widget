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
// LeetCode doesn't have an official public API, but their GraphQL endpoint
// is accessible for public profile data.

const LEETCODE_GRAPHQL = 'https://leetcode.com/graphql';

const LEETCODE_QUERY = `
  query getUserProfile($username: String!) {
    matchedUser(username: $username) {
      username
      profile {
        realName
        ranking
        userAvatar
        starRating
      }
      submitStats: submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
          submissions
        }
      }
      userCalendar {
        streak
        totalActiveDays
        submissionCalendar
      }
    }
  }
`;

export async function fetchLeetCodeData(username) {
  if (!username) throw new Error('No username provided');

  try {
    console.log(`[LeetCode] Attempting to fetch data for: ${username}`);
    const res = await fetch(LEETCODE_GRAPHQL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      body: JSON.stringify({
        query: LEETCODE_QUERY,
        variables: { username },
      }),
    });

    if (!res.ok) {
      throw new Error(`LeetCode API error: ${res.status}`);
    }

    const json = await res.json();
    
    // Check for GraphQL errors
    if (json.errors) {
      throw new Error(`LeetCode API error: ${json.errors[0]?.message || 'Unknown error'}`);
    }

    const user = json?.data?.matchedUser;

    if (!user) {
      throw new Error(`LeetCode user "${username}" not found`);
    }

    // Parse submission stats
    const stats = user.submitStats?.acSubmissionNum || [];
    const getCount = (difficulty) =>
      stats.find((s) => s.difficulty === difficulty)?.count || 0;

    const easy   = getCount('Easy');
    const medium = getCount('Medium');
    const hard   = getCount('Hard');
    const total  = getCount('All');

    // Parse streak from calendar
    const streak = user.userCalendar?.streak || 0;
    const totalActiveDays = user.userCalendar?.totalActiveDays || 0;

    // Check if solved today
    const calendar = JSON.parse(user.userCalendar?.submissionCalendar || '{}');
    const todayTimestamp = Math.floor(new Date().setHours(0, 0, 0, 0) / 1000);
    const solvedToday = !!calendar[todayTimestamp];

    return {
      username: user.username,
      name: user.profile?.realName || user.username,
      avatarUrl: user.profile?.userAvatar,
      ranking: user.profile?.ranking,
      total,
      easy,
      medium,
      hard,
      streak,
      totalActiveDays,
      solvedToday,
      profileUrl: `https://leetcode.com/${username}`,
    };
  } catch (error) {
    console.error(`[LeetCode] GraphQL fetch failed:`, error.message);
    // If CORS or network error, try alternative endpoint
    if (error.message.includes('Failed to fetch') || error.message.includes('CORS')) {
      console.log(`[LeetCode] Trying alternative API...`);
      return fetchLeetCodeDataAlternative(username);
    }
    throw error;
  }
}

// Alternative: Use LeetCode's public REST API endpoint
async function fetchLeetCodeDataAlternative(username) {
  if (!username) throw new Error('No username provided');

  try {
    console.log(`[LeetCode] Fetching from alternative API: ${username}`);
    const res = await fetch(`https://leetcode-api.vercel.app/${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error(`LeetCode user "${username}" not found`);
      }
      throw new Error(`LeetCode API error: ${res.status}`);
    }

    const data = await res.json();
    console.log(`[LeetCode] Alternative API success:`, data);

    return {
      username: data.username,
      name: data.name || data.username,
      avatarUrl: data.avatar,
      ranking: data.ranking,
      total: data.totalSolved,
      easy: data.easySolved,
      medium: data.mediumSolved,
      hard: data.hardSolved,
      streak: data.streak || 0,
      totalActiveDays: data.totalActiveDays || 0,
      solvedToday: false, // This API doesn't provide this info
      profileUrl: `https://leetcode.com/${username}`,
    };
  } catch (error) {
    console.error(`[LeetCode] Alternative API failed:`, error.message);
    throw new Error(`Unable to fetch LeetCode profile: ${error.message}`);
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
