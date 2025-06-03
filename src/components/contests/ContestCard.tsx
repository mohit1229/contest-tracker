import { format } from "date-fns"
import Link from "next/link"
import { UserContest } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { generateGoogleCalendarUrl } from "@/lib/calendar-utils"
import { AlarmClock } from "lucide-react"
interface ContestCardProps {
  contest: UserContest
  isLoggedIn: boolean
  isPending: boolean
  onAction: (url: string, action: "bookmark") => void
}

export function ContestCard({ contest, isLoggedIn, isPending, onAction }: ContestCardProps) {
  const isPastContest = new Date(contest.endTime) < new Date()
  const calendarUrl = generateGoogleCalendarUrl(contest)

  return (
    <Card className="hover:shadow-md transition-shadow duration-200 dark:bg-neutral-900/80">
      <CardContent className="p-2">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2 text-foreground">{contest.title}</h3>
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
          </div>

          <div className="text-sm text-muted-foreground md:text-right">
            <p className="font-medium">{format(new Date(contest.startTime), "MMM d, yyyy")}</p>
            <p>{format(new Date(contest.startTime), "h:mm a")}</p>
            <p className="text-xs mt-1">
              Duration: {Math.round((new Date(contest.endTime).getTime() - new Date(contest.startTime).getTime()) / (1000 * 60))} mins
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 items-center justify-between">
          <Link
            href={contest.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium transition-colors"
          >
            View Contest ↗
          </Link>

          <div className="flex gap-2">
            <Button
              variant={contest.bookmarked ? "default" : "outline"}
              size="sm"
              disabled={isPending || !isLoggedIn}
              onClick={() => onAction(contest.url, "bookmark")}
              className={`
                transition-all duration-200
                ${contest.bookmarked ? 'bg-green-600 hover:bg-green-700' : ''}
              `}
            >
              {contest.bookmarked ? "Bookmarked ✓" : "Bookmark"}
            </Button>

            {!isPastContest && (
              <Link
                href={calendarUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="transition-all duration-200"
                >
                  Add to Calendar <AlarmClock className="" />
                </Button>
              </Link>
            )}
          </div>
        </div>

        {contest.note && (
          <div className="mt-3 p-2 bg-muted/50 rounded-md">
            <p className="text-sm text-muted-foreground italic">
              Note: {contest.note}
            </p>
          </div>
        )}

        {contest.solutionUrl && (
          <div className="mt-2">
            <Link
              href={contest.solutionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-800 hover:underline text-sm font-medium transition-colors inline-flex items-center gap-1"
            >
              View Solution ↗
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 