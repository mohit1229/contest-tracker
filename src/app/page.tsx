import { Card, CardContent } from "@/components/ui/card"
import ContestDetails from "@/components/contest-details"
// import { ModeToggle } from "@/components/dark-toggle"
// import { FetchContestsButton } from "@/components/fetch-contest-button"

async function Page() {
  
  return (
    <div className="bg-zinc-100 dark:bg-zinc-950">
      <div className="mt-16 text-6xl font-bold px-20">
<h1 >Manage and Track Contest both Upcoming and Past Contest easily from various platforms like Leetcode, Codeforces, Codechef and more</h1>
</div>
      {/* <FetchContestsButton /> */}
    <div className="flex items-center justify-center mt-16 ">
        <Card className="border-lg">
          <CardContent>
        
        <ContestDetails />
            </CardContent>
        </Card>
    </div>
    </div>
  )
}

export default Page