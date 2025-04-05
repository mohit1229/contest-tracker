// app/api/cron/fetch-contests/route.ts
import { getContestsFromServer } from "@/actions/fetch-contests"

export const runtime = "nodejs" // required for non-edge APIs

export async function GET() {
  try {
    const contests = await getContestsFromServer()
    console.log(`⏰ Cron fetched ${contests.count} contests`)

    return new Response("Fetched successfully", { status: 200 })
  } catch (err) {
    console.error("❌ Cron fetch failed:", err)
    return new Response("Fetch failed", { status: 500 })
  }
}
