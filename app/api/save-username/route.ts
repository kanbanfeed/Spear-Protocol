import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { userId, username } = await req.json()

    if (!userId || !username) {
      return NextResponse.json(
        { error: "Missing data" },
        { status: 400 }
      )
    }

    // basic validation
    if (!/^[a-zA-Z0-9]{4,20}$/.test(username)) {
      return NextResponse.json(
        { error: "Username must be 4-20 alphanumeric characters" },
        { status: 400 }
      )
    }

    // check uniqueness
    const existing = await prisma.user.findUnique({
      where: { username },
    })

    if (existing) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 400 }
      )
    }

    // update user
    await prisma.user.update({
      where: { id: userId },
      data: { username },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("USERNAME SAVE ERROR:", error)

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}