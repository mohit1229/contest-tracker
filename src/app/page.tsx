import { Card, CardContent } from "@/components/ui/card"
import ContestDetails from "@/components/contest-details"
import { ModeToggle } from "@/components/dark-toggle"
// import { FetchContestsButton } from "@/components/fetch-contest-button"

async function Page() {
  
  return (
    <div>
      <ModeToggle />
      {/* <FetchContestsButton /> */}
    <div className="flex items-center justify-center mt-16 ">

        <Card>
          <CardContent>
        
        <ContestDetails />
            </CardContent>
        </Card>
    </div>
    </div>
  )
}

export default Page