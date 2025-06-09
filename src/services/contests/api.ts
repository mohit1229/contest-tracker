import axios from "axios"
import { Contest, LeetCodeContest, CodeforcesContest, CodeChefContest } from "@/types"

export async function fetchLeetCodeContests(): Promise<Contest[]> {
  try {
    const query = {
      query: `{
        allContests {
          title
          startTime
          duration
          titleSlug
        }
      }`,
    }

    const res = await axios.post("https://leetcode.com/graphql", query, {
      headers: { "Content-Type": "application/json" },
    })

    return res.data.data.allContests.map((contest: LeetCodeContest) => ({
      id: contest.titleSlug,
      title: contest.title,
      platform: "LeetCode",
      description: "LeetCode Contest",
      url: `https://leetcode.com/contest/${contest.titleSlug}`,
      startTime: new Date(contest.startTime * 1000),
      endTime: new Date(contest.startTime * 1000 + contest.duration * 1000),
    }))
  } catch (error) {
    console.error("Failed to fetch from LeetCode:", error)
    return []
  }
}

export async function fetchCodeforcesContests(): Promise<Contest[]> {
  try {
    const res = await axios.get("https://codeforces.com/api/contest.list")

    return res.data.result.map((contest: CodeforcesContest) => ({
      id: String(contest.id),
      title: contest.name,
      platform: "Codeforces",
      description: "Codeforces Contest",
      url: `https://codeforces.com/contest/${contest.id}`,
      startTime: new Date(contest.startTimeSeconds * 1000),
      endTime: new Date((contest.startTimeSeconds + contest.durationSeconds) * 1000),
    }))
  } catch (error) {
    console.error("Failed to fetch from Codeforces:", error)
    return []
  }
}

export async function fetchCodeChefContests(): Promise<Contest[]> {
  try {
    const res = await axios.get(
      "https://www.codechef.com/api/list/contests/all",
      {
        params: {
          sort_by: 'START',
          sorting_order: 'asc',
          offset: 0,
          mode: 'all'
        },
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      }
    );

    console.log('CodeChef API Response:', {
      futureCount: res.data.future_contests?.length || 0,
      pastCount: res.data.past_contests?.length || 0,
      sampleFuture: res.data.future_contests?.[0],
      samplePast: res.data.past_contests?.[0]
    });

    const transformContest = (contest: CodeChefContest) => {
      const startTime = new Date(contest.contest_start_date);
      const duration = parseInt(contest.contest_duration?.toString() || '0');
      const endTime = new Date(startTime.getTime() + duration * 60 * 1000);

      return {
        id: contest.contest_code,
        title: contest.contest_name,
        platform: "CodeChef",
        description: "CodeChef Contest",
        url: `https://www.codechef.com/${contest.contest_code}`,
        startTime,
        endTime,
      };
    };

    const now = new Date();
    const allContests = [
      ...(res.data.future_contests || []).map(transformContest),
      ...(res.data.past_contests || []).map(transformContest),
    ];

    // Log transformed contests for debugging
    console.log('Transformed CodeChef Contests:', {
      total: allContests.length,
      upcoming: allContests.filter(c => c.startTime > now).length,
      past: allContests.filter(c => c.endTime < now).length,
      sample: allContests[0]
    });

    return allContests;
  } catch (error) {
    console.error("Failed to fetch from CodeChef:", error)
    if (axios.isAxiosError(error)) {
      console.error("CodeChef API Error Details:", {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });
    }
    return []
  }
}

export async function fetchAllContests(): Promise<{ upcoming: Contest[]; past: Contest[] }> {
  const allContests = await Promise.all([
    fetchLeetCodeContests(),
    fetchCodeforcesContests(),
    fetchCodeChefContests(),
  ])

  const now = new Date()
  const contests = allContests.flat()

  return {
    upcoming: contests.filter(contest => contest.startTime > now),
    past: contests
      .filter(contest => contest.endTime < now)
      .sort((a, b) => b.endTime.getTime() - a.endTime.getTime())
      .slice(0, 10),
  }
} 