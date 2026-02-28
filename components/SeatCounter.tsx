"use client"

import { useEffect, useState } from "react"

export default function SeatCounter() {
  const [remaining, setRemaining] = useState<number | null>(null)

  useEffect(() => {
    async function fetchSeats() {
      try {
        const res = await fetch("/api/seats")
        const data = await res.json()
        setRemaining(data.remaining)
      } catch (error) {
        console.error("Failed to fetch seats")
      }
    }

    fetchSeats()
  }, [])

  return (
    <div className="text-lg text-gray-800 tracking-wide">
      {remaining !== null ? (
        <span>{remaining} Founding Seats Remaining</span>
      ) : (
        <span>Loading seats...</span>
      )}
    </div>
  )
}