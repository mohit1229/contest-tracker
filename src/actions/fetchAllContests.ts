import { fetchFromCodechef, fetchFromCodeforces, fetchFromLeetCode, RawContest } from "@/lib/platform-fetchers"

// Function to fetch all contests (both upcoming and past)
export async function fetchAllContests(): Promise<{
    upcoming: RawContest[]
    previous: RawContest[]
  }> {
    const upcomingPromises = [
      fetchFromLeetCode(false),
      fetchFromCodeforces(false), 
      fetchFromCodechef(false)
    ]
    
    const pastPromises = [
      fetchFromLeetCode(true),
      fetchFromCodeforces(true),
      fetchFromCodechef(true)
    ]
    
    // Wait for all promises to resolve
    const upcomingResults = await Promise.all(upcomingPromises)
    const pastResults = await Promise.all(pastPromises)
    
    // Flatten the arrays of contests
    const upcoming = upcomingResults.flat()
    const allPast = pastResults.flat()
  
    // Sort past contests by endTime in descending order and take only the latest 10
    const previous = allPast
      .sort((a, b) => b.endTime.getTime() - a.endTime.getTime())
      .slice(0, 10)
  
    return { upcoming, previous }
  }
  