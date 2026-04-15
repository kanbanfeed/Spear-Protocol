import { prisma } from "@/lib/prisma"
import { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { userId, type, email, output } = await req.json()

    if (type === "social") {
      return Response.json({
        success: true,
        unlock: true,
      })
    }

    if (type === "email") {
      // send email with full output
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          output,
        }),
      })

      return Response.json({
        success: true,
        unlock: false,
      })
    }

    return new Response("Invalid type", { status: 400 })
  } catch (error) {
    console.error(error)
    return new Response("Unlock failed", { status: 500 })
  }
}