'use server'

import { fetchAllContests } from "@/lib/platform-fetchers"
import { prisma } from "@/lib/prisma"

export async function getContestsFromServer() {
  const { upcoming, previous } = await fetchAllContests()

  const allContests = [...upcoming, ...previous]

  for (const contest of allContests) {
    await prisma.contest.upsert({
        where: { url: contest.url },
        update: {
          title: contest.title,
          platform: contest.platform,
          description: contest.description,
          startTime: contest.startTime,
          endTime: contest.endTime,
          bookmarked: contest.bookmarked ?? false,
          reminder: undefined,
          note: undefined,
          solutionUrl: undefined,
        },
        create: {
          title: contest.title,
          platform: contest.platform,
          description: contest.description,
          url: contest.url,
          startTime: contest.startTime,
          endTime: contest.endTime,
          bookmarked: contest.bookmarked ?? false,
          reminder: undefined,
          note: undefined,
          solutionUrl: undefined,
        },
      })
      
  }

  return { success: true, count: allContests.length }
}
