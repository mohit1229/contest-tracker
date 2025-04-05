"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { createCalendarEvent } from "@/lib/google-calendar"

export async function toggleReminder(contestUrl: string) {
  console.log("contestUrl received in toggleReminder:", contestUrl)

  try {
    const { userId } = await auth()
    if (!userId) {
      console.error("❌ Not authenticated")
      return
    }

    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user) {
      console.error(`❌ No user found in DB for clerkId: ${userId}`)
      return
    }

    const contest = await prisma.contest.findUnique({ where: { url: contestUrl } })
    if (!contest) {
      console.error(`❌ No contest found with URL: ${contestUrl}`)
      return
    }

    // Log essential contest info only
    console.log("ℹ️ Contest details:", {
      id: contest.id,
      title: contest.title,
      startTime: contest.startTime,
      endTime: contest.endTime,
    })

    const existing = await prisma.userContest.findUnique({
      where: {
        userId_contestId: { userId: user.id, contestId: contest.id },
      },
    })

    const newReminderStatus = existing ? !existing.reminder : true

    if (existing) {
      await prisma.userContest.update({
        where: { userId_contestId: { userId: user.id, contestId: contest.id } },
        data: { reminder: newReminderStatus },
      })
    } else {
      await prisma.userContest.create({
        data: {
          userId: user.id,
          contestId: contest.id,
          reminder: true,
        },
      })
    }

    if (newReminderStatus) {
      const account = await prisma.googleAccount.findUnique({ where: { userId } })
      if (!account) {
        console.warn("⚠️ No Google account connected.")
        return
      }

      try {
        await createCalendarEvent({
          accessToken: account.accessToken,
          refreshToken: account.refreshToken,
          title: contest.title,
          url: contest.url,
          startTime: new Date(contest.startTime),
          endTime: new Date(contest.endTime),
        })

        console.log("✅ Event successfully added to Google Calendar")
      } catch (error) {
        console.error("❌ Failed to create Google Calendar event:", error)
      }
    }

    revalidatePath("/")
  } catch (err) {
    console.error("💥 Unexpected error in toggleReminder:", err)
  }
}
