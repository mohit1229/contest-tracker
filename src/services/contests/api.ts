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
      "https://www.codechef.com/api/list/contests/all?sort_by=START&sorting_order=asc&offset=0&mode=all"
    )

    const transformContest = (contest: CodeChefContest) => ({
      id: contest.contest_code,
      title: contest.contest_name,
      platform: "CodeChef",
      description: "CodeChef Contest",
      url: `https://www.codechef.com/${contest.contest_code}`,
      startTime: new Date(contest.contest_start_date),
      endTime: new Date(
        new Date(contest.contest_start_date).getTime() + contest.contest_duration * 60 * 1000
      ),
    })

    return [
      ...res.data.future_contests.map(transformContest),
      ...res.data.past_contests.map(transformContest),
    ]
  } catch (error) {
    console.error("Failed to fetch from CodeChef:", error)
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