"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ContestList } from "./ContestList"
import { UserContest } from "@/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ContestTabsProps {
  upcoming: UserContest[]
  past: UserContest[]
  isLoggedIn: boolean
}

type Platform = 'All' | 'LeetCode' | 'Codeforces' | 'CodeChef'

export function ContestTabs({ upcoming: initialUpcoming, past: initialPast, isLoggedIn }: ContestTabsProps) {
  const [contests, setContests] = useState({
    upcoming: initialUpcoming,
    past: initialPast
  })
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('All')

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

  // Filter contests based on selected platform
  const filterContests = (contestList: UserContest[]) => {
    if (selectedPlatform === 'All') return contestList
    return contestList.filter(contest => contest.platform === selectedPlatform)
  }

  const filteredUpcoming = filterContests(contests.upcoming)
  const filteredPast = filterContests(contests.past)
  const filteredBookmarked = filterContests(bookmarked)

  return (
    <div className="w-full max-w-4xl mx-auto px-1 sm:px-4 md:px-6 md:py-10">
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid grid-cols-3 gap-2 mb-4 w-full">
          <TabsTrigger value="upcoming" className="px-2 sm:px-4">
            Upcoming ({filteredUpcoming.length})
          </TabsTrigger>
          <TabsTrigger value="past" className="px-2 sm:px-4">
            Past ({filteredPast.length})
          </TabsTrigger>
          <TabsTrigger value="bookmarked" className="px-2 sm:px-4">
            Bookmarked ({filteredBookmarked.length})
          </TabsTrigger>
        </TabsList>

        <div className="flex items-center gap-2 mb-4 px-1">
          <span className="text-sm font-medium text-muted-foreground">Filter by platform:</span>
          <Select
            value={selectedPlatform}
            onValueChange={(value: string) => setSelectedPlatform(value as Platform)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Platforms</SelectItem>
              <SelectItem value="LeetCode">LeetCode</SelectItem>
              <SelectItem value="Codeforces">Codeforces</SelectItem>
              <SelectItem value="CodeChef">CodeChef</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="upcoming">
          {!isLoggedIn && (
            <div className="mb-4 p-4 text-sm text-muted-foreground">
              <p>Sign in to bookmark contests and set reminders!</p>
            </div>
          )}
          <ContestList 
            contests={filteredUpcoming}
            isLoggedIn={isLoggedIn}
            onContestUpdate={handleContestUpdate}
          />
        </TabsContent>

        <TabsContent value="past">
          <ContestList 
            contests={filteredPast}
            isLoggedIn={isLoggedIn}
            onContestUpdate={handleContestUpdate}
          />
        </TabsContent>

        <TabsContent value="bookmarked">
          {!isLoggedIn ? (
            <div className="p-4 text-sm text-muted-foreground">
              <p>Sign in to see your bookmarked contests!</p>
            </div>
          ) : filteredBookmarked.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground">
              <p>No bookmarked contests yet. Bookmark some contests to see them here!</p>
            </div>
          ) : (
            <ContestList 
              contests={filteredBookmarked}
              isLoggedIn={isLoggedIn}
              onContestUpdate={handleContestUpdate}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
} 