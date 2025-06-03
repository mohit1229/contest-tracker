import { prisma } from "@/lib/prisma"
import { getOrCreateUser } from "@/lib/getOrCreateUser"
import { getContestsFromServer } from "@/actions/fetch-contests"

export async function getContests() {
  // First, check if we have any contests in the database
  const contestCount = await prisma.contest.count()
  
  // If no contests in DB, fetch them first
  if (contestCount === 0) {
    await getContestsFromServer()
  }

  const user = await getOrCreateUser()
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

  const select = user
    ? {
        ...selectBase,
        userContests: {
          where: { userId: user.id },
          select: {
            bookmarked: true,
            reminder: true,
            note: true,
            solutionUrl: true,
          },
        },
      }
    : selectBase

  const [upcomingRaw, previousRaw] = await Promise.all([
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

  const normalize = (contestList: Array<{
    id: string;
    title: string;
    platform: string;
    description: string;
    url: string;
    startTime: Date;
    endTime: Date;
    updatedAt: Date;
    userContests?: Array<{
      bookmarked: boolean;
      reminder: boolean;
      note: string | null;
      solutionUrl: string | null;
    }>;
  }>) =>
    contestList.map((contest) => {
      const userData = contest.userContests?.[0]
      return {
        ...contest,
        bookmarked: userData?.bookmarked ?? false,
        reminder: userData?.reminder ?? false,
        note: userData?.note ?? null,
        solutionUrl: userData?.solutionUrl ?? null,
      }
    })

  return {
    upcoming: normalize(upcomingRaw),
    previous: normalize(previousRaw),
  }
}
