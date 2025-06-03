"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ContestList } from "./ContestList"
import { UserContest } from "@/types"

interface ContestTabsProps {
  upcoming: UserContest[]
  past: UserContest[]
  isLoggedIn: boolean
}

export function ContestTabs({ upcoming: initialUpcoming, past: initialPast, isLoggedIn }: ContestTabsProps) {
  const [contests, setContests] = useState({
    upcoming: initialUpcoming,
    past: initialPast
  })

  // Get all bookmarked contests
  const bookmarked = [...contests.upcoming, ...contests.past].filter(c => c.bookmarked)

  const handleContestUpdate = (updatedContest: UserContest) => {
    setContests(current => ({
      upcoming: current.upcoming.map(contest =>
        contest.url === updatedContest.url ? updatedContest : contest
      ),
      past: current.past.map(contest =>
        contest.url === updatedContest.url ? updatedContest : contest
      )
    }))
  }

  return (
    <Tabs defaultValue="upcoming" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="upcoming" className="text-sm sm:text-base">
          Upcoming ({contests.upcoming.length})
        </TabsTrigger>
        <TabsTrigger value="bookmarked" className="text-sm sm:text-base">
          Bookmarked ({bookmarked.length})
        </TabsTrigger>
        <TabsTrigger value="past" className="text-sm sm:text-base">
          Past ({contests.past.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="upcoming" className="space-y-4">
        {!isLoggedIn && (
          <div className="mb-4 p-4 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
            <p>Sign in to bookmark contests and set reminders!</p>
          </div>
        )}
        <ContestList 
          contests={contests.upcoming} 
          isLoggedIn={isLoggedIn}
          onContestUpdate={handleContestUpdate}
        />
      </TabsContent>

      <TabsContent value="bookmarked" className="space-y-4">
        {!isLoggedIn ? (
          <div className="p-4 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
            <p>Sign in to see your bookmarked contests!</p>
          </div>
        ) : bookmarked.length === 0 ? (
          <div className="p-4 bg-yellow-50 text-yellow-700 rounded-lg border border-yellow-200">
            <p>No bookmarked contests yet. Bookmark some contests to see them here!</p>
          </div>
        ) : (
          <ContestList 
            contests={bookmarked}
            isLoggedIn={isLoggedIn}
            onContestUpdate={handleContestUpdate}
          />
        )}
      </TabsContent>

      <TabsContent value="past" className="space-y-4">
        <ContestList 
          contests={contests.past} 
          isLoggedIn={isLoggedIn}
          onContestUpdate={handleContestUpdate}
        />
      </TabsContent>
    </Tabs>
  )
} 