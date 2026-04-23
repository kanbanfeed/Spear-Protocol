import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { username } = await req.json()

  if (!username || username.length < 4) {
    return NextResponse.json({ error: "Invalid username" }, { status: 400 })
  }

  const exists = await prisma.user.findUnique({
    where: { username },
  })

  if (exists) {
    return NextResponse.json({ error: "Username taken" }, { status: 400 })
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { username },
  })

  return NextResponse.json({ success: true })
}