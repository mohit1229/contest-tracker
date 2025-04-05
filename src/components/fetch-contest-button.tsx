"use client"

import { useTransition } from "react"
import { getContestsFromServer } from "@/actions/fetch-contests" // ✅ Must be marked `'use server'`

export function FetchContestsButton() {
  const [isPending, startTransition] = useTransition()

  const handleClick = () => {
    startTransition(async () => {
      const contests = await getContestsFromServer()
      console.log("Fetched from server action:", contests)
      // You may want to revalidate or refresh here
    })
  }

  return (
    <button onClick={handleClick} disabled={isPending}>
      {isPending ? "Fetching..." : "Fetch Contests"}
    </button>
  )
}
