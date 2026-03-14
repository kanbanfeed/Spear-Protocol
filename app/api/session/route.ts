import OpenAI from "openai"
import { prisma } from "@/lib/prisma"
import { MASTER_PROMPT } from "@/lib/masterPrompt"
import { NextResponse } from "next/server"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

const MAX_SESSIONS_PER_HOUR = 20
const ONE_HOUR = 60 * 60 * 1000

export async function POST(req: Request) {
  try {
    const { input, email } = await req.json()

    if (!input || !email) {
      return NextResponse.json(
        { error: "Missing input or email" },
        { status: 400 }
      )
    }

    // 1️⃣ Validate user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // 2️⃣ Check subscription
    if (user.subscriptionStatus !== "active") {
      return NextResponse.json(
        { error: "Active subscription required" },
        { status: 403 }
      )
    }

    // 3️⃣ RATE LIMIT (20 sessions per hour)
    const oneHourAgo = new Date(Date.now() - ONE_HOUR)

    const sessionCount = await prisma.session.count({
      where: {
        userId: user.id,
        createdAt: {
          gte: oneHourAgo,
        },
      },
    })

    if (sessionCount >= MAX_SESSIONS_PER_HOUR) {
      console.warn("Rate limit reached for user:", user.email)

      return NextResponse.json(
        {
          error:
            "Too many decision sessions. Please wait before creating another.",
        },
        { status: 429 }
      )
    }

    // 4️⃣ Call OpenAI decision engine
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: MASTER_PROMPT },
        { role: "user", content: input },
      ],
      max_tokens: 1200,
    })

    const output =
      completion.choices?.[0]?.message?.content ||
      "Decision engine returned no output."

    // 5️⃣ Save decision session
    const savedSession = await prisma.session.create({
      data: {
        userId: user.id,
        input,
        output,
      },
    })

    console.log("Decision session stored:", savedSession.id)

    return NextResponse.json({
      output,
      sessionId: savedSession.id,
    })
  } catch (error) {
    console.error("SESSION ERROR:", error)

    return NextResponse.json(
      { error: "Session processing failed" },
      { status: 500 }
    )
  }
}