import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

const MAX_SEATS = 100

export async function GET() {
  try {
    const purchaseCount = await prisma.purchase.count()

    const remaining = Math.max(MAX_SEATS - purchaseCount, 0)

    return NextResponse.json({ remaining })
  } catch (error) {
    console.error("Seat counter error:", error)
    return NextResponse.json({ remaining: MAX_SEATS })
  }
}