// app/api/cron/fetch-contests/route.ts
import { syncContestsToDatabase } from "@/services/contests/db"
import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 60 // Maximum allowed duration for hobby plan

export async function GET(req: Request) {
  try {
    // Check if we're in a build environment
    if (process.env.VERCEL_ENV === 'production' && process.env.VERCEL_BUILD_STEP === '1') {
      return NextResponse.json({ message: "Skipping during build" }, { status: 200 })
    }

    const authHeader = req.headers.get("Authorization")
    const expectedAuth = `Bearer ${process.env.CRON_SECRET}`

    if (authHeader !== expectedAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const result = await syncContestsToDatabase()
    console.log(`⏰ Cron fetched ${result.count} contests`)

    return NextResponse.json({ success: true, count: result.count }, { status: 200 })
  } catch (err) {
    console.error("❌ Cron fetch failed:", err)
    return NextResponse.json({ error: "Fetch failed", details: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 })
  }
}
