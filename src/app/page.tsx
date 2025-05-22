import { Card, CardContent } from "@/components/ui/card"
import ContestDetails from "@/components/contest-details"

// import { ModeToggle } from "@/components/dark-toggle"
// import { FetchContestsButton } from "@/components/fetch-contest-button"

async function Page() {
  
  return (
    <div className="">
      <div className="mt-16   md:px-20  sm:px-4">
<h1 className="dark:bg-gradient-to-t dark:from-zinc-50 dark:via-neutral-200 dark:to-zinc-400 text-transparent bg-clip-text text-3xl sm:text-4xl md:text-6xl font-[550] md:px-8 px-2 bg-gradient-to-t from-zinc-800 to-zinc-700">Track Coding Contests from LeetCode,Codeforces, CodeChef & More</h1>
<h3 className="text-md sm:text-lg md:text-2xl font-[450] mt-6 md:px-8 dark:text-zinc-200 text-zinc-800 px-2">Manage and explore upcoming and past programming contests — all in one place, beautifully organized for competitive programmers.</h3>
</div>
      {/* <FetchContestsButton /> */}
    <div className="flex items-center justify-center mt-16 md:px-6 w-full px-2">
        <Card className="border-lg xl:w-3/5 lg:w-4/5 w-full">
          <CardContent>
        
        <ContestDetails />
            </CardContent>
        </Card>
    </div>
    </div>
  )
}

export default Page