// app/api/cron/fetch-contests/route.ts
import { syncContestsToDatabase } from "@/services/contests/db"

export const runtime = "nodejs" // required for non-edge APIs

export async function GET(req: Request) {
  const authHeader = req.headers.get("Authorization")
  const expectedAuth = `Bearer ${process.env.CRON_SECRET}`

  if (authHeader !== expectedAuth) {
    return new Response("Unauthorized", { status: 401 })
  }

  try {
    const result = await syncContestsToDatabase()
    console.log(`⏰ Cron fetched ${result.count} contests`)

    return new Response("Fetched successfully", { status: 200 })
  } catch (err) {
    console.error("❌ Cron fetch failed:", err)
    return new Response("Fetch failed", { status: 500 })
  }
}
