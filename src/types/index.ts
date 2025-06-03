// Contest Types
export interface Contest {
  id: string
  title: string
  platform: 'LeetCode' | 'Codeforces' | 'CodeChef'
  description: string
  startTime: Date
  endTime: Date
  url: string
}

export interface UserContest extends Contest {
  bookmarked: boolean
  reminder: boolean
  note: string | null
  solutionUrl: string | null
}

// API Response Types
export interface LeetCodeContest {
  title: string
  startTime: number
  duration: number
  titleSlug: string
}

export interface CodeforcesContest {
  id: number
  name: string
  phase: string
  startTimeSeconds: number
  durationSeconds: number
}

export interface CodeChefContest {
  contest_name: string
  contest_code: string
  contest_start_date: string
  contest_duration: number
} 