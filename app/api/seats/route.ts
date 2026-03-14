import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

const MAX_SEATS = 100

export async function GET() {
  try {

    // Count total successful purchases
    const purchaseCount = await prisma.purchase.count()

    // Calculate remaining seats
    const remainingSeats = Math.max(MAX_SEATS - purchaseCount, 0)

    console.log("Seats remaining:", remainingSeats)

    return NextResponse.json({
      remaining: remainingSeats,
      maxSeats: MAX_SEATS,
    })

  } catch (error) {
    console.error("Seat counter error:", error)

    return NextResponse.json(
      {
        remaining: MAX_SEATS,
        maxSeats: MAX_SEATS,
        error: "Seat calculation failed",
      },
      { status: 500 }
    )
  }
}