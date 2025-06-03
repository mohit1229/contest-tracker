"use server"

import { prisma } from "@/lib/prisma"
import { Contest, UserContest } from "@/types"
import { fetchAllContests } from "./api"

export async function syncContestsToDatabase() {
  const { upcoming, past } = await fetchAllContests()
  const allContests = [...upcoming, ...past]

  for (const contest of allContests) {
    await prisma.contest.upsert({
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
  }

  return { success: true, count: allContests.length }
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

  const [upcoming, past] = await Promise.all([
    prisma.contest.findMany({
      where: { startTime: { gt: now } },
      orderBy: { startTime: "asc" },
      select,
    }),
    prisma.contest.findMany({
      where: { endTime: { lt: now } },
      orderBy: { endTime: "desc" },
      take: 10,
      select,
    }),
  ])

  const normalizeContest = (contest: any): UserContest => {
    const userData = contest.userContests?.[0]
    return {
      ...contest,
      bookmarked: userData?.bookmarked ?? false,
      reminder: userData?.reminder ?? false,
      note: userData?.note ?? null,
      solutionUrl: userData?.solutionUrl ?? null,
    }
  }

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