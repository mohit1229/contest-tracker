import { ImageResponse } from 'next/server'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <img src="/s.png" alt="Icon" width={32} height={32} />
    ),
    // ImageResponse options
    {
      ...size,
    }
  )
} 