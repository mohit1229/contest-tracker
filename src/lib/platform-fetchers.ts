import axios from "axios"

export type RawContest = {
  id: string
  title: string
  platform: string
  description: string
  url: string
  startTime: Date
  endTime: Date
  bookmarked: boolean
  reminder: boolean
  note?: string | null
  solutionUrl?: string | null
}


export async function fetchFromLeetCode(getPastContests = false): Promise<RawContest[]> {
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

    type LeetCodeContest = {
      title: string
      startTime: number
      duration: number
      titleSlug: string
    }

    const contests = res.data.data.allContests.map((contest: LeetCodeContest) => ({
      title: contest.title,
      platform: "LeetCode",
      description: "LeetCode Contest",
      url: `https://leetcode.com/contest/${contest.titleSlug}`,
      startTime: new Date(contest.startTime * 1000),
      endTime: new Date(contest.startTime * 1000 + contest.duration * 1000),
    }))

    const now = new Date()
    return contests.filter((c: RawContest) =>
      getPastContests ? c.endTime < now : c.startTime > now
    )
  } catch (error) {
    console.error("Failed to fetch from LeetCode:", error)
    return []
  }
}

export async function fetchFromCodeforces(getPastContests = false): Promise<RawContest[]> {
  try {
    const res = await axios.get("https://codeforces.com/api/contest.list")

    type CodeforcesContest = {
      id: number
      name: string
      phase: string
      startTimeSeconds: number
      durationSeconds: number
    }

    const contestsData = getPastContests
      ? res.data.result.filter((c: CodeforcesContest) => c.phase === "FINISHED")
      : res.data.result.filter((c: CodeforcesContest) => c.phase === "BEFORE")

    return contestsData.map((c: CodeforcesContest) => ({
      title: c.name,
      platform: "Codeforces",
      description: "Codeforces Contest",
      url: `https://codeforces.com/contest/${c.id}`,
      startTime: new Date(c.startTimeSeconds * 1000),
      endTime: new Date((c.startTimeSeconds + c.durationSeconds) * 1000),
    }))
  } catch (error) {
    console.error("Failed to fetch from Codeforces:", error)
    return []
  }
}


export async function fetchFromCodechef(getPastContests = false): Promise<RawContest[]> {
  try {
    const res = await axios.get(
      "https://www.codechef.com/api/list/contests/all?sort_by=START&sorting_order=asc&offset=0&mode=all"
    )

    type CodechefContest = {
      contest_name: string
      contest_code: string
      contest_start_date: string // e.g., "2025-06-05 15:00:00"
      contest_duration: number // in minutes
    }

    const contestsData = getPastContests
      ? res.data.past_contests
      : res.data.future_contests

    return contestsData.map((c: CodechefContest) => {
      const istDate = new Date(c.contest_start_date.replace(" ", "T")) // Force ISO format
      const utcDate = new Date(istDate.getTime() - 5.5 * 60 * 60 * 1000) // Adjust to UTC

      return {
        title: c.contest_name,
        platform: "CodeChef",
        description: "CodeChef Contest",
        url: `https://www.codechef.com/${c.contest_code}`,
        startTime: utcDate,
        endTime: new Date(utcDate.getTime() + c.contest_duration * 60 * 1000),
      }
    })
  } catch (error) {
    console.error("Failed to fetch from CodeChef:", error)
    return []
  }
}

export async function fetchAllContests(): Promise<{
  upcoming: RawContest[]
  previous: RawContest[]
}> {
  const upcomingPromises = [
    fetchFromLeetCode(false),
    fetchFromCodeforces(false),
    fetchFromCodechef(false),
  ]

  const pastPromises = [
    fetchFromLeetCode(true),
    fetchFromCodeforces(true),
    fetchFromCodechef(true),
  ]

  const upcomingResults = await Promise.all(upcomingPromises)
  const pastResults = await Promise.all(pastPromises)

  const upcoming = upcomingResults.flat()
  const allPast = pastResults.flat()

  // Sort and limit to 10 most recent past contests
  const previous = allPast
    .sort((a, b) => b.endTime.getTime() - a.endTime.getTime())
    .slice(0, 10)

  return { upcoming, previous }
}
