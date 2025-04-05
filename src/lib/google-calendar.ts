import { google } from "googleapis"

export async function createCalendarEvent({
  accessToken,
  refreshToken,
  title,
  url,
  startTime,
  endTime,
}: {
  accessToken: string
  refreshToken: string
  title: string
  url: string
  startTime: Date
  endTime: Date
}) {
  const oauth2Client = new google.auth.OAuth2()
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  })

  const calendar = google.calendar({ version: "v3", auth: oauth2Client })

  const event = {
    summary: title,
    description: url,
    start: {
      dateTime: startTime.toISOString(),
      timeZone: "Asia/Kolkata",
    },
    end: {
      dateTime: endTime.toISOString(),
      timeZone: "Asia/Kolkata",
    },
  }

  return await calendar.events.insert({
    calendarId: "primary",
    requestBody: event,
  })
}
