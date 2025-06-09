"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { UserContest } from "@/types"
import { ContestCard } from "./ContestCard"
import { toggleBookmark, updateNote } from "@/actions/contests"
import { motion } from "framer-motion"
import { staggerContainer, fadeInUp } from "@/lib/motion-variants"

interface ContestListProps {
  contests: UserContest[]
  isLoggedIn: boolean
  onContestUpdate: (contest: UserContest) => void
}

export function ContestList({ contests, isLoggedIn, onContestUpdate }: ContestListProps) {
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()

  async function handleAction(url: string, action: "bookmark" | "note", value?: string) {
    if (!isLoggedIn) return
    
    setIsPending(true)
    
    // Find the contest to update
    const contestToUpdate = contests.find(c => c.url === url)
    if (!contestToUpdate) return

    // Create updated contest for optimistic update
    const updatedContest = {
      ...contestToUpdate,
      ...(action === "bookmark" ? { bookmarked: !contestToUpdate.bookmarked } : {}),
      ...(action === "note" ? { note: value || null } : {})
    }

    // Optimistically update UI
    onContestUpdate(updatedContest)

    try {
      if (action === "bookmark") {
        await toggleBookmark(url)
      } else if (action === "note" && value !== undefined) {
        await updateNote(url, value)
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
      <motion.div 
        className="text-center p-8 bg-muted/30 rounded-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-muted-foreground">No contests found.</p>
      </motion.div>
    )
  }

  return (
    <motion.div 
      className="space-y-4"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {contests.map((contest, index) => (
        <motion.div
          key={contest.url}
          variants={fadeInUp}
          custom={index}
          transition={{ delay: index * 0.1 }}
        >
          <ContestCard
            contest={contest}
            isLoggedIn={isLoggedIn}
            isPending={isPending}
            onAction={handleAction}
          />
        </motion.div>
      ))}
    </motion.div>
  )
} 