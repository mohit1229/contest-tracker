"use server"

import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function toggleBookmark(contestUrl: string) {
  const { userId } = await auth()
  if (!userId) return

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId }
  })
  if (!dbUser) return

  // ✅ Lookup contest ID based on URL
  const contest = await prisma.contest.findUnique({
    where: { url: contestUrl }
  })

  if (!contest) {
    console.error("Contest not found in DB:", contestUrl)
    return
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
