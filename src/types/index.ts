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
  contest_code: string
  contest_name: string
  contest_start_date_iso: string
  // contest_duration: string | number
  contest_end_date_iso: string

} 