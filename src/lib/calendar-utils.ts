export function generateGoogleCalendarUrl(contest: {
  title: string;
  description?: string;
  url: string;
  startTime: Date;
  endTime: Date;
}) {
  const formatDate = (date: Date) => {
    return date.toISOString().replace(/-|:|\.\d\d\d/g, '')
  }

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${contest.title} - ${contest.platform}`,
    details: `Contest Link: ${contest.url}\n\n${contest.description || ''}`,
    dates: `${formatDate(new Date(contest.startTime))}/${formatDate(new Date(contest.endTime))}`,
  })

  return `https://calendar.google.com/calendar/render?${params.toString()}`
} 