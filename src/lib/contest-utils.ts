import { ContestProps } from "@/types/contest"
import { RawContest } from "@/lib/platform-fetchers" // or move RawContest to types too

export function transformRawContests(raw: RawContest[]): ContestProps[] {
    return raw.map(contest => ({
      id: crypto.randomUUID(),
      title: contest.title,
      platform: contest.platform,
      description: contest.description,
      startTime: contest.startTime,
      endTime: contest.endTime,
      url: contest.url,
      bookmarked: contest.bookmarked ?? false,
      reminder: false,
      note: "",
      solutionUrl: ""
    }))
  }
  
  // Update the RawContest type to allow null for the bookmarked property

