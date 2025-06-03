"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { UserContest } from "@/types"
import { ContestCard } from "./ContestCard"
import { toggleBookmark, toggleReminder } from "@/actions/contests"

interface ContestListProps {
  contests: UserContest[]
  isLoggedIn: boolean
  onContestUpdate: (contest: UserContest) => void
}

export function ContestList({ contests, isLoggedIn, onContestUpdate }: ContestListProps) {
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()

  async function handleAction(url: string, action: "bookmark" | "reminder") {
    if (!isLoggedIn) return
    
    setIsPending(true)
    
    // Find the contest to update
    const contestToUpdate = contests.find(c => c.url === url)
    if (!contestToUpdate) return

    // Create updated contest for optimistic update
    const updatedContest = {
      ...contestToUpdate,
      [action === "bookmark" ? "bookmarked" : "reminder"]: 
        !contestToUpdate[action === "bookmark" ? "bookmarked" : "reminder"]
    }

    // Optimistically update UI
    onContestUpdate(updatedContest)

    try {
      if (action === "bookmark") {
        await toggleBookmark(url)
      } else {
        await toggleReminder(url)
      }
      router.refresh()
    } catch (error) {
      console.error("Error:", error)
      // Revert the optimistic update on error
      onContestUpdate(contestToUpdate)
    } finally {
      setIsPending(false)
    }
  }

  if (contests.length === 0) {
    return (
      <div className="text-center p-8 bg-muted/30 rounded-lg">
        <p className="text-muted-foreground">No contests found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {contests.map((contest) => (
        <ContestCard
          key={contest.url}
          contest={contest}
          isLoggedIn={isLoggedIn}
          isPending={isPending}
          onAction={handleAction}
        />
      ))}
    </div>
  )
} 