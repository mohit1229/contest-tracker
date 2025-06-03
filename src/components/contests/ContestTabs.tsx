"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ContestList } from "./ContestList"
import { UserContest } from "@/types"

interface ContestTabsProps {
  upcoming: UserContest[]
  past: UserContest[]
  isLoggedIn: boolean
}

export function ContestTabs({ upcoming, past, isLoggedIn }: ContestTabsProps) {
  return (
    <Tabs defaultValue="upcoming" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="upcoming" className="text-sm sm:text-base">
          Upcoming ({upcoming.length})
        </TabsTrigger>
        
        <TabsTrigger value="past" className="text-sm sm:text-base">
          Past ({past.length})
        </TabsTrigger>
        <TabsTrigger value="bookmarked" className="text-sm sm:text-base">
          Bookmarked ({upcoming.filter(c => c.bookmarked).length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="upcoming" className="space-y-4">
        {!isLoggedIn && (
          <div className="mb-4 p-4 rounded-lg">
            <p>Sign in to bookmark contests and set reminders!</p>
          </div>
        )}
        <ContestList contests={upcoming} isLoggedIn={isLoggedIn} />
      </TabsContent>

      <TabsContent value="bookmarked" className="space-y-4">
        {!isLoggedIn ? (
          <div className="p-4 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
            <p>Sign in to see your bookmarked contests!</p>
          </div>
        ) : (
          <ContestList 
            contests={upcoming.filter(c => c.bookmarked)} 
            isLoggedIn={isLoggedIn} 
          />
        )}
      </TabsContent>

      <TabsContent value="past" className="space-y-4">
        <ContestList contests={past} isLoggedIn={isLoggedIn} />
      </TabsContent>
    </Tabs>
  )
} 