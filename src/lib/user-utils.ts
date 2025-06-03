import { clerkClient } from "@clerk/clerk-sdk-node";
import { prisma } from "./prisma";

export async function createDbUserIfNotExists(clerkUserId: string) {
  const existing = await prisma.user.findUnique({
    where: { clerkId: clerkUserId }
  })

  if (!existing) {
    const clerkUser = await clerkClient.users.getUser(clerkUserId)

    await prisma.user.create({
      data: {
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses[0].emailAddress,
      },
    })
  }
} 