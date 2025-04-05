import { NextResponse } from "next/server"
import { google } from "googleapis"

export async function GET() {
  const oauth2Client = new google.auth.OAuth2({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    redirectUri: "http://localhost:3000/api/google/callback", // must match Google console
  })

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/calendar"],
    prompt: "consent",
  })

  return NextResponse.redirect(authUrl)
}
