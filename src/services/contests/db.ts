"use server"

import { prisma } from "@/lib/prisma"
import { UserContest } from "@/types"
import { fetchAllContests } from "./api"

export async function syncContestsToDatabase() {
  // Skip during build
  if (process.env.VERCEL_ENV === 'production' && process.env.VERCEL_BUILD_STEP === '1') {
    return { success: true, count: 0, skipped: true }
  }

  try {
    const { upcoming, past } = await fetchAllContests()
    const allContests = [...upcoming, ...past]

    // Batch upserts into chunks of 10 to avoid timeouts
    const chunkSize = 10
    const chunks = []
    for (let i = 0; i < allContests.length; i += chunkSize) {
      chunks.push(allContests.slice(i, i + chunkSize))
    }

    let processedCount = 0
    for (const chunk of chunks) {
      await Promise.all(
        chunk.map(contest =>
          prisma.contest.upsert({
            where: { url: contest.url },
            update: {
              title: contest.title,
              platform: contest.platform,
              description: contest.description,
              startTime: contest.startTime,
              endTime: contest.endTime,
              updatedAt: new Date(),
            },
            create: {
              title: contest.title,
              platform: contest.platform,
              description: contest.description,
              url: contest.url,
              startTime: contest.startTime,
              endTime: contest.endTime,
            },
          })
        )
      )
      processedCount += chunk.length
    }

    return { success: true, count: processedCount }
  } catch (error) {
    console.error("Failed to sync contests:", error)
    throw error
  }
}

export async function getContestsFromDatabase(userId?: string) {
  const now = new Date()

  const selectBase = {
    id: true,
    title: true,
    platform: true,
    description: true,
    url: true,
    startTime: true,
    endTime: true,
    updatedAt: true,
  }

  const select = userId
    ? {
        ...selectBase,
        userContests: {
          where: { userId },
          select: {
            bookmarked: true,
            reminder: true,
            note: true,
            solutionUrl: true,
          },
        },
      }
    : selectBase

  const [upcomingRaw, pastRaw] = await Promise.all([
    prisma.contest.findMany({
      where: { startTime: { gt: now } },
      orderBy: { startTime: "asc" },
      select,
    }),
    prisma.contest.findMany({
      where: { endTime: { lt: now } },
      orderBy: { endTime: "desc" },
      select,
    }),
  ])

  type ContestWithUserData = {
    id: string
    title: string
    platform: 'LeetCode' | 'Codeforces' | 'CodeChef'
    description: string
    url: string
    startTime: Date
    endTime: Date
    updatedAt: Date
    userContests?: Array<{
      bookmarked: boolean
      reminder: boolean
      note: string | null
      solutionUrl: string | null
    }>
  }

  const normalizeContest = (contest: ContestWithUserData): UserContest => {
    const userData = contest.userContests?.[0]
    return {
      ...contest,
      bookmarked: userData?.bookmarked ?? false,
      reminder: userData?.reminder ?? false,
      note: userData?.note ?? null,
      solutionUrl: userData?.solutionUrl ?? null,
    }
  }

  // Cast the raw results to the correct type since we know the platform values are valid
  const upcoming = upcomingRaw as unknown as ContestWithUserData[]
  const past = pastRaw as unknown as ContestWithUserData[]

  return {
    upcoming: upcoming.map(normalizeContest),
    past: past.map(normalizeContest),
  }
}

export async function toggleContestBookmark(userId: string, contestUrl: string) {
  const contest = await prisma.contest.findUnique({
    where: { url: contestUrl },
  })

  if (!contest) {
    throw new Error("Contest not found")
  }

  const existing = await prisma.userContest.findUnique({
    where: {
      userId_contestId: {
        userId,
        contestId: contest.id,
      },
    },
  })

  if (existing) {
    return prisma.userContest.update({
      where: {
        userId_contestId: {
          userId,
          contestId: contest.id,
        },
      },
      data: {
        bookmarked: !existing.bookmarked,
      },
    })
  }

  return prisma.userContest.create({
    data: {
      userId,
      contestId: contest.id,
      bookmarked: true,
    },
  })
}

export async function toggleContestReminder(userId: string, contestUrl: string) {
  const contest = await prisma.contest.findUnique({
    where: { url: contestUrl },
  })

  if (!contest) {
    throw new Error("Contest not found")
  }

  const existing = await prisma.userContest.findUnique({
    where: {
      userId_contestId: {
        userId,
        contestId: contest.id,
      },
    },
  })

  if (existing) {
    return prisma.userContest.update({
      where: {
        userId_contestId: {
          userId,
          contestId: contest.id,
        },
      },
      data: {
        reminder: !existing.reminder,
      },
    })
  }

  return prisma.userContest.create({
    data: {
      userId,
      contestId: contest.id,
      reminder: true,
    },
  })
} 