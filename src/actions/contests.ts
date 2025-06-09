"use server"

import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { getOrCreateUser } from "@/lib/getOrCreateUser"

export async function updateNote(contestUrl: string, note: string) {
  const { userId } = await auth()
  if (!userId) {
    throw new Error("Authentication required")
  }

  const dbUser = await getOrCreateUser()
  if (!dbUser) {
    throw new Error("Failed to get or create user")
  }

  const contest = await prisma.contest.findUnique({
    where: { url: contestUrl }
  })
  if (!contest) {
    throw new Error("Contest not found")
  }

  const existing = await prisma.userContest.findUnique({
    where: {
      userId_contestId: {
        userId: dbUser.id,
        contestId: contest.id
      }
    }
  })

  let result
  if (existing) {
    result = await prisma.userContest.update({
      where: {
        userId_contestId: {
          userId: dbUser.id,
          contestId: contest.id
        }
      },
      data: {
        note
      }
    })
  } else {
    result = await prisma.userContest.create({
      data: {
        userId: dbUser.id,
        contestId: contest.id,
        note
      }
    })
  }

  revalidatePath("/")
  return result
}

export async function toggleBookmark(contestUrl: string) {
  const { userId } = await auth()
  if (!userId) {
    throw new Error("Authentication required")
  }

  const dbUser = await getOrCreateUser()
  if (!dbUser) {
    throw new Error("Failed to get or create user")
  }

  const contest = await prisma.contest.findUnique({
    where: { url: contestUrl }
  })
  if (!contest) {
    throw new Error("Contest not found")
  }

  const existing = await prisma.userContest.findUnique({
    where: {
      userId_contestId: {
        userId: dbUser.id,
        contestId: contest.id
      }
    }
  })

  let result
  if (existing) {
    result = await prisma.userContest.update({
      where: {
        userId_contestId: {
          userId: dbUser.id,
          contestId: contest.id
        }
      },
      data: {
        bookmarked: !existing.bookmarked
      }
    })
  } else {
    result = await prisma.userContest.create({
      data: {
        userId: dbUser.id,
        contestId: contest.id,
        bookmarked: true
      }
    })
  }

  revalidatePath("/")
  return result
}

export async function toggleReminder(contestUrl: string) {
  const { userId } = await auth()
  if (!userId) {
    throw new Error("Authentication required")
  }

  const dbUser = await getOrCreateUser()
  if (!dbUser) {
    throw new Error("Failed to get or create user")
  }

  const contest = await prisma.contest.findUnique({
    where: { url: contestUrl }
  })
  if (!contest) {
    throw new Error("Contest not found")
  }

  const existing = await prisma.userContest.findUnique({
    where: {
      userId_contestId: {
        userId: dbUser.id,
        contestId: contest.id
      }
    }
  })

  let result
  if (existing) {
    result = await prisma.userContest.update({
      where: {
        userId_contestId: {
          userId: dbUser.id,
          contestId: contest.id
        }
      },
      data: {
        reminder: !existing.reminder
      }
    })
  } else {
    result = await prisma.userContest.create({
      data: {
        userId: dbUser.id,
        contestId: contest.id,
        reminder: true
      }
    })
  }

  revalidatePath("/")
  return result
} 