"use client"

import { useEffect, useState } from "react"

interface SeatCounterProps {
  isPulsing?: boolean
}

export default function SeatCounter({ isPulsing = false }: SeatCounterProps) {
  const [remaining, setRemaining] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchSeats() {
      try {
        setIsLoading(true)
        const res = await fetch("/api/seats")
        const data = await res.json()
        setRemaining(data.remaining)
      } catch (error) {
        console.error("Failed to fetch seats")
      } finally {
        setIsLoading(false)
      }
    }

    fetchSeats()
    
    // Optional: Refresh seat count every 30 seconds
    const interval = setInterval(fetchSeats, 30000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`relative group cursor-pointer transition-all duration-300 ${isPulsing ? 'scale-105' : ''}`}>
      {/* Glow effect */}
      <div className={`absolute inset-0 bg-amber-500 rounded-full blur-xl transition-opacity duration-300 ${isPulsing ? 'opacity-100' : 'opacity-0'}`}></div>
      
      {/* Main badge */}
      <div className="relative inline-flex items-center gap-3 px-6 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-sm shadow-2xl">
        {/* Live indicator */}
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-200"></span>
        </span>
        
        {/* Content */}
        {isLoading ? (
          <span className="tracking-wide">Loading seats...</span>
        ) : (
          <>
            <span className="tracking-wide font-bold">
              {remaining} founding {remaining === 1 ? 'seat' : 'seats'} remaining
            </span>
            <span className="text-xs opacity-90">• Closes permanently</span>
          </>
        )}
      </div>
    </div>
  )
}