"use client"

import { format } from "date-fns"
import Link from "next/link"
import { useState } from "react"
import { UserContest } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { generateGoogleCalendarUrl } from "@/lib/calendar-utils"
import { AlarmClock, StickyNote, ChevronDown, ChevronUp, Calendar, Trash2 } from "lucide-react"
import { NotesDialog } from "./NotesDialog"
import { motion } from "framer-motion"
import { cardVariants, buttonVariants } from "@/lib/motion-variants"

interface ContestCardProps {
  contest: UserContest
  isLoggedIn: boolean
  isPending: boolean
  onAction: (url: string, action: "bookmark" | "note", value?: string) => void
}

const MotionCard = motion(Card)
const MotionButton = motion(Button)
const MotionLink = motion(Link)

export function ContestCard({ contest, isLoggedIn, isPending, onAction }: ContestCardProps) {
  const [isNotesOpen, setIsNotesOpen] = useState(false)
  const isPastContest = new Date(contest.endTime) < new Date()
  const calendarUrl = generateGoogleCalendarUrl(contest)

  const handleNoteSave = (note: string) => {
    onAction(contest.url, "note", note)
  }

  const handleNoteDelete = () => {
    onAction(contest.url, "note", "")
  }

  return (
    <>
      <MotionCard 
        className="hover:shadow-md transition-shadow duration-200 dark:bg-neutral-900/80"
        variants={cardVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        whileTap="tap"
      >
        <CardContent className="p-2">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex-1">
              <motion.h3 
                className="font-semibold text-lg mb-2 text-foreground"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                {contest.title}
              </motion.h3>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Badge 
                  variant="outline" 
                  className={`
                    ${contest.platform === 'LeetCode' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
                    ${contest.platform === 'Codeforces' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                    ${contest.platform === 'CodeChef' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                  `}
                >
                  {contest.platform}
                </Badge>
              </motion.div>
            </div>

            <motion.div 
              className="text-sm text-muted-foreground md:text-right"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p className="font-medium">{format(new Date(contest.startTime), "MMM d, yyyy")}</p>
              <p>{format(new Date(contest.startTime), "h:mm a")}</p>
              <p className="text-xs mt-1">
                Duration: {Math.round((new Date(contest.endTime).getTime() - new Date(contest.startTime).getTime()) / (1000 * 60))} mins
              </p>
            </motion.div>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <MotionLink
                href={contest.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Contest ↗
              </MotionLink>

              <div className="flex flex-wrap gap-2">
                <MotionButton
                  variant={contest.bookmarked ? "default" : "outline"}
                  size="sm"
                  disabled={isPending || !isLoggedIn}
                  onClick={() => onAction(contest.url, "bookmark")}
                  className={`
                    transition-all duration-200
                    ${contest.bookmarked ? 'bg-green-600 hover:bg-green-700' : ''}
                  `}
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                >
                  {contest.bookmarked ? "Bookmarked ✓" : "Bookmark"}
                </MotionButton>

                <MotionButton
                  variant="outline"
                  size="sm"
                  disabled={!isLoggedIn}
                  onClick={() => setIsNotesOpen(true)}
                  className="transition-all duration-200"
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                >
                  <StickyNote className="w-4 h-4 mr-1" />
                  Notes
                </MotionButton>

                {!isPastContest && (
                  <MotionLink
                    href={calendarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <MotionButton
                      variant="outline"
                      size="sm"
                      className="transition-all duration-200"
                      whileHover="hover"
                      whileTap="tap"
                      variants={buttonVariants}
                    >
                      <Calendar className="w-4 h-4 mr-1" />
                      <span className="hidden sm:inline">Add to Calendar</span>
                    </MotionButton>
                  </MotionLink>
                )}
              </div>
            </div>
          </div>

          {contest.note && (
            <motion.div 
              className="mt-3 p-2 bg-muted/50 rounded-md"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex flex-col gap-1">
                <p 
                  className="text-sm text-muted-foreground italic line-clamp-2 cursor-pointer"
                  onClick={() => setIsNotesOpen(true)}
                >
                  Note: {contest.note}
                </p>
                <div className="flex gap-2">
                  <MotionButton
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsNotesOpen(true)}
                    className="self-start h-6 px-2"
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
                  >
                    <ChevronDown className="h-4 w-4 mr-1" />
                    View & Edit
                  </MotionButton>
                  <MotionButton
                    variant="ghost"
                    size="sm"
                    onClick={handleNoteDelete}
                    className="self-start h-6 px-2 text-destructive hover:text-destructive"
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </MotionButton>
                </div>
              </div>
            </motion.div>
          )}

          {contest.solutionUrl && (
            <motion.div 
              className="mt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <MotionLink
                href={contest.solutionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-800 hover:underline text-sm font-medium transition-colors inline-flex items-center gap-1"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Solution ↗
              </MotionLink>
            </motion.div>
          )}
        </CardContent>
      </MotionCard>

      <NotesDialog
        isOpen={isNotesOpen}
        onOpenChange={setIsNotesOpen}
        initialNote={contest.note}
        onSave={handleNoteSave}
        onDelete={handleNoteDelete}
        contestTitle={contest.title}
      />
    </>
  )
} 