import { prisma } from "@/lib/prisma"
import { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      email,
      platform,
      name,
      jobTitle,
      company,
      profileImage,
      username,
    } = body

    // check existing user
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email || "" },
          { username: username || "" },
        ],
      },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: email || `${Date.now()}@temp.com`,
          referralCode: Math.random().toString(36).substring(2, 8),

          platform,
          name,
          jobTitle,
          company,
          profileImage,
          username,
        },
      })
    } else {
      // update data if exists
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          platform,
          name,
          jobTitle,
          company,
          profileImage,
          username,
        },
      })
    }

    return Response.json(user)
  } catch (error) {
    console.error(error)
    return new Response("User login failed", { status: 500 })
  }
}