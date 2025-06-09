"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const platforms = ["LeetCode", "Codeforces", "CodeChef"]
const INTERVAL = 3000 // 3 seconds per platform

export function AnimatedPlatforms() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % platforms.length)
    }, INTERVAL)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative h-[1.2em] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.span
          key={platforms[currentIndex]}
          initial={{ 
            y: 20, 
            opacity: 0,
            filter: "blur(10px)" 
          }}
          animate={{ 
            y: 0, 
            opacity: 1,
            filter: "blur(0px)" 
          }}
          exit={{ 
            y: -20, 
            opacity: 0,
            filter: "blur(10px)" 
          }}
          transition={{
            y: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
            filter: { duration: 0.5 }
          }}
          className="absolute inset-0 flex items-center justify-start dark:bg-gradient-to-t dark:from-zinc-50 dark:via-neutral-200 dark:to-zinc-400 bg-gradient-to-t from-zinc-800 to-zinc-700 text-transparent bg-clip-text"
        >
          {platforms[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </div>
  )
} 