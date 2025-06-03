"use client"

import { useState } from "react"
import { UserContest } from "@/types"
import { ContestCard } from "./ContestCard"
import { toggleBookmark, toggleReminder } from "@/actions/contests"

interface ContestListProps {
  contests: UserContest[]
  isLoggedIn: boolean
  emptyMessage?: string
}

export function ContestList({ contests, isLoggedIn }: ContestListProps) {
  const [isPending, setIsPending] = useState(false)

  async function handleAction(url: string, action: "bookmark" | "reminder") {
    if (!isLoggedIn) return
    
    setIsPending(true)
    try {
      if (action === "bookmark") {
        await toggleBookmark(url)
      } else {
        await toggleReminder(url)
      }
    } catch (error) {
      console.error("Error:", error)
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