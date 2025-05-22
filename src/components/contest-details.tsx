import { getContests } from "@/lib/getContests"
import { transformRawContests } from "@/lib/contest-utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ContestBox from "./contest-box"

export default async function ContestDetails() {
  const { upcoming, previous } = await getContests()

  const bookmarks = [...upcoming, ...previous].filter(c => c.bookmarked)

  return (
    <div className="w-full max-w-4xl mx-auto px-1 sm:px-4 md:px-6 py-6 md:py-10">
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="flex flex-wrap md:flex-nowrap gap-2 md:gap-4 justify-center mb-4 w-full">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          <ContestBox
            tabDescription="Upcoming contests across platforms."
            contests={transformRawContests(upcoming)}
          />
        </TabsContent>

        <TabsContent value="completed">
          <ContestBox
            tabDescription="Completed contests with notes and solutions."
            contests={transformRawContests(previous)}
          />
        </TabsContent>

        <TabsContent value="bookmarks">
          <ContestBox
            tabDescription="Your bookmarked contests."
            contests={transformRawContests(bookmarks)}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
