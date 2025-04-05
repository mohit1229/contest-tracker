import { clerkClient } from "@clerk/clerk-sdk-node";
import { clerkMiddleware } from "@clerk/nextjs/server";
import { prisma } from "./lib/prisma";

export default clerkMiddleware();

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};

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
