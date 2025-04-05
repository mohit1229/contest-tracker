import { ContestProps } from "@/types/contest"
import { RawContest } from "@/lib/platform-fetchers" // or move RawContest to types too

export function transformRawContests(raw: RawContest[]): ContestProps[] {
    return raw.map(contest => ({
      id: contest.id, // ✅ Use real DB ID
      title: contest.title,
      platform: contest.platform,
      description: contest.description,
      startTime: contest.startTime,
      endTime: contest.endTime,
      url: contest.url,
      bookmarked: contest.bookmarked ?? false,
      reminder: contest.reminder ?? false,
      note: contest.note ?? "",
      solutionUrl: contest.solutionUrl ?? "",
    }))
  }
  
  
  // Update the RawContest type to allow null for the bookmarked property

