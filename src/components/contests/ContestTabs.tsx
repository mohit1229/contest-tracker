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
    <div className="w-full max-w-4xl mx-auto px-1 sm:px-4 md:px-6 md:py-10 ">
    <Tabs defaultValue="upcoming" className="w-full">
      <TabsList className="flex flex-wrap md:flex-nowrap gap-2 md:gap-4 justify-center mb-4 w-full">
        <TabsTrigger value="upcoming">
          Upcoming ({contests.upcoming.length})
        </TabsTrigger>
        
        <TabsTrigger value="past">
          Past ({contests.past.length})
        </TabsTrigger>
        <TabsTrigger value="bookmarked">
          Bookmarked ({bookmarked.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="upcoming">
        {!isLoggedIn && (
          <div className="mb-4 p-4 text-sm text-muted-foreground">
            <p>Sign in to bookmark contests and set reminders!</p>
          </div>
        )}
        <ContestList 
          contests={contests.upcoming} 
          isLoggedIn={isLoggedIn}
          onContestUpdate={handleContestUpdate}
        />
      </TabsContent>

      <TabsContent value="past">
        <ContestList 
          contests={contests.past} 
          isLoggedIn={isLoggedIn}
          onContestUpdate={handleContestUpdate}
        />
      </TabsContent>
      <TabsContent value="bookmarked">
        {!isLoggedIn ? (
          <div className="p-4 text-sm text-muted-foreground">
            <p>Sign in to see your bookmarked contests!</p>
          </div>
        ) : bookmarked.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground">
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

    </Tabs>
    </div>
  )
} 