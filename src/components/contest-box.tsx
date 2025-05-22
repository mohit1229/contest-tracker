'use client'

import { useTransition, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { format } from "date-fns"
import { toggleBookmark } from "@/actions/bookmark"
import { toggleReminder } from "@/actions/reminder"
import { ContestProps } from "@/types/contest"
import { Badge } from "./ui/badge"
import { useUser} from "@clerk/nextjs"

export default function ContestBox({
  tabDescription,
  contests,
}: {
  tabDescription: string
  contests: ContestProps[]
}) {
  const [isPending, startTransition] = useTransition()
  const { isSignedIn } = useUser()
  const router = useRouter()
  const [hasConnectedCalendar, setHasConnectedCalendar] = useState(false)

  useEffect(() => {
    setHasConnectedCalendar(false) // Replace with real check later
  }, [])

  const handleToggle = async (id: string, action: "bookmark" | "reminder") => {
    if (!isSignedIn) {
      alert("Please sign in to use this feature.")
      return
    }

    startTransition(async () => {
      if (action === "bookmark") {
        await toggleBookmark(id)
      } else {
        await toggleReminder(id)
      }
      router.refresh()
    })
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardDescription>{tabDescription}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* Top Buttons */}
        {/* {!isSignedIn && (
          <div className="text-center">
            
            <SignInButton mode="modal">
              <Button variant="default" size="sm">Sign in to bookmark & set reminders</Button>
            </SignInButton>
          </div>
        )} */}

        {isSignedIn && !hasConnectedCalendar && (
          <div className="text-center">
            <Link href="/api/connect-google" passHref>
              <Button variant="outline" size="sm">
                Connect Google Calendar
              </Button>
            </Link>
          </div>
        )}

        {contests.length === 0 && (
          <p className="text-sm text-muted-foreground">No contests found.</p>
        )}

        {contests.map((contest) => (
          <div key={contest.id} className="border p-3 rounded-md shadow-sm bg-muted/50">
            <div className="flex flex-row justify-between gap-2">
              <div className="flex-1">
                <h3 className="font-semibold text-md break-words mb-4">{contest.title}</h3>
                <p className="text-sm text-muted-foreground"><Badge>{contest.platform}</Badge></p>
              </div>
              <div className="text-sm text-right min-w-[140px]">
                <p>{format(new Date(contest.startTime), "dd MMM yyyy, hh:mm a")}</p>
                <p className="text-xs text-muted-foreground">
                  Ends: {format(new Date(contest.endTime), "hh:mm a")}
                </p>
              </div>
            </div>

            <div className="mt-2 flex justify-between items-center flex-wrap gap-2">
              <Link
                href={contest.url}
                className="text-sm text-blue-600 hover:underline"
                target="_blank"
              >
                Go to Contest ↗
              </Link>

              <div className="flex gap-2">
                <Button
                  variant={contest.bookmarked ? "default" : "outline"}
                  size="sm"
                  disabled={isPending}
                  onClick={() => handleToggle(contest.url, "bookmark")}
                >
                  {contest.bookmarked ? "Bookmarked" : "Bookmark"}
                </Button>

                <Button
                  variant={contest.reminder ? "default" : "outline"}
                  size="sm"
                  disabled={isPending}
                  onClick={() => handleToggle(contest.url, "reminder")}
                >
                  {contest.reminder ? "Reminder On" : "Remind Me"}
                </Button>
              </div>
            </div>

            {contest.note && (
              <p className="mt-2 text-sm italic text-muted-foreground">
                Note: {contest.note}
              </p>
            )}

            {contest.solutionUrl && (
              <Link
                href={contest.solutionUrl}
                className="text-sm text-green-600 hover:underline"
                target="_blank"
              >
                Solution Video ↗
              </Link>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
