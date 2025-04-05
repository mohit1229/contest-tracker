// /app/api/google/callback/route.ts
import { google } from "googleapis"
import  {auth}  from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  process.env.GOOGLE_REDIRECT_URI! // should match: http://localhost:3000/api/google/callback
)

export async function GET(req: Request) {
  const { userId } = await auth() // Clerk user ID
  const url = new URL(req.url)
  const code = url.searchParams.get("code")

  if (!code || !userId) return new Response("Missing code or user", { status: 400 })

  const { tokens } = await oauth2Client.getToken(code)
  oauth2Client.setCredentials(tokens)

  await prisma.googleAccount.upsert({
    where: { userId },
    update: {
      accessToken: tokens.access_token!,
      refreshToken: tokens.refresh_token!,
      expiryDate: new Date(tokens.expiry_date!),
    },
    create: {
      userId,
      accessToken: tokens.access_token!,
      refreshToken: tokens.refresh_token!,
      expiryDate: new Date(tokens.expiry_date!),
    },
  })

  return Response.redirect("http://localhost:3000/") // or wherever
}
