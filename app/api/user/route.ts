import { prisma } from "@/lib/prisma"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return new Response("Missing userId", { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  return Response.json(user)
}