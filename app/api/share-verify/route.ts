import { prisma } from "@/lib/prisma"
import { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { userId, url } = await req.json()

    if (!userId) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }

    if (!url) {
      return Response.json(
        { success: false, message: "URL required" },
        { status: 400 }
      )
    }

    const isValid =
      url.includes("spearprotocol.com") ||
      url.toLowerCase().includes("@spearprotocol")

    if (!isValid) {
      return Response.json({
        success: false,
        message:
          "Please make sure your post includes @spearprotocol or spearprotocol.com",
      })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      )
    }

    // ❌ Prevent same URL reuse
    if (user.sharedUrls.includes(url)) {
      return Response.json({
        success: false,
        message: "This post has already been used.",
      })
    }

    // 🔒 Limit shares
    const MAX_SHARES = 3

    if (
      user.sharedUrls.length >= MAX_SHARES &&
      user.subscriptionStatus !== "active"
    ) {
      return Response.json({
        success: false,
        message: "Share limit reached. Please upgrade.",
      })
    }

    //  Update user
    await prisma.user.update({
      where: { id: userId },
      data: {
        freeSessions: {
          increment: 1,
        },
        sharedUrls: {
          push: url,
        },
      },
    })

    return Response.json({
      success: true,
      message: "Free session unlocked",
    })
  } catch (error) {
    console.error(error)
    return new Response("Verification failed", { status: 500 })
  }
}