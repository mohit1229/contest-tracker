import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const contentType = 'image/png'
export const size = {
  width: 32,
  height: 32,
}

export default async function Icon() {
  try {
    const response = await fetch(
      new URL('/s.png', process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
    )
    const arrayBuffer = await response.arrayBuffer()

    return new Response(arrayBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (e) {
    console.error('Error generating icon:', e)
    return new Response('Error generating icon', { status: 500 })
  }
} 