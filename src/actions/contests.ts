"use server"

import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"

export async function toggleBookmark(contestUrl: string) {
  const { userId } = await auth()
  if (!userId) {
    throw new Error("Authentication required")
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId }
  })
  if (!dbUser) {
    throw new Error("User not found")
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

  if (existing) {
    await prisma.userContest.update({
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
    await prisma.userContest.create({
      data: {
        userId: dbUser.id,
        contestId: contest.id,
        bookmarked: true
      }
    })
  }

  revalidatePath("/")
}

export async function toggleReminder(contestUrl: string) {
  const { userId } = await auth()
  if (!userId) {
    throw new Error("Authentication required")
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId }
  })
  if (!dbUser) {
    throw new Error("User not found")
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

  if (existing) {
    await prisma.userContest.update({
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
    await prisma.userContest.create({
      data: {
        userId: dbUser.id,
        contestId: contest.id,
        reminder: true
      }
    })
  }

  revalidatePath("/")
} 