import { auth } from "@clerk/nextjs/server"
import { clerkClient } from "@clerk/clerk-sdk-node" //  correct SDK for full user access
import { prisma } from "./prisma"

export async function getOrCreateUser() {
  const { userId } = await auth()

  if (!userId) return null

  let user = await prisma.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) {
    const clerkUser = await clerkClient.users.getUser(userId) // ✅ Fixes the error

    user = await prisma.user.create({
      data: {
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses[0].emailAddress,
      },
    })
  }

  return user
}
