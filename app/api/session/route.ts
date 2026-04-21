import OpenAI from "openai"
import { prisma } from "@/lib/prisma"
import { MASTER_PROMPT } from "@/lib/masterPrompt"
import { NextResponse } from "next/server"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function POST(req: Request) {
  try {
    const { input, userId } = await req.json()

    if (!input || input.trim() === "") {
      return NextResponse.json(
        { error: "Input is required" },
        { status: 400 }
      )
    }

    let user: any = null

    // ===============================
    // 🔒 SESSION CONTROL (UNCHANGED + EXTENDED)
    // ===============================
    if (userId) {
      user = await prisma.user.findUnique({
        where: { id: userId },
      })

      if (!user) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        )
      }

      const hasActiveSubscription =
        user.subscriptionStatus === "active"

      const hasFreeSessions = user.freeSessions > 0

      // ❌ BLOCK if no access
      if (!hasFreeSessions && !hasActiveSubscription) {
        return NextResponse.json(
          { error: "LIMIT_REACHED" },
          { status: 403 }
        )
      }

      // FREE USER FLOW (UNCHANGED)
      if (!hasActiveSubscription && hasFreeSessions) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            freeSessions: {
              decrement: 1,
            },
            totalSessions: {
              increment: 1,
            },
          },
        })
      }

      // SUBSCRIPTION FLOW (EXTENDED)
      if (hasActiveSubscription) {

        // 🔒 VERIFIED PLAN LIMIT (3 per month)
        if (user.plan === "verified") {
          const startOfMonth = new Date()
          startOfMonth.setDate(1)
          startOfMonth.setHours(0, 0, 0, 0)

          const sessionsThisMonth = await prisma.session.count({
            where: {
              userId,
              createdAt: {
                gte: startOfMonth,
              },
            },
          })

          if (sessionsThisMonth >= 3) {
            return NextResponse.json(
              { error: "LIMIT_REACHED" },
              { status: 403 }
            )
          }
        }

        // TRACK USAGE
        await prisma.user.update({
          where: { id: userId },
          data: {
            totalSessions: {
              increment: 1,
            },
          },
        })
      }
    }

    // ===============================
    // 🧠 AI CONFIG (OPERATOR MODE)
    // ===============================
    let extraPrompt = ""

    if (user?.plan === "operator") {
      extraPrompt = `

You are now operating in OPERATOR MODE.

Go significantly deeper than normal analysis.

Instructions:
- Identify second-order and third-order consequences
- Expose hidden risks and blind spots
- Challenge assumptions aggressively
- Provide strategic alternatives
- Think like a high-stakes decision advisor
- Be brutally clear, not polite
- Focus on leverage, not surface-level advice

Your output must feel sharper, more strategic, and more decisive than standard responses.
`
    }

    // ===============================
    // 🤖 AI CALL (ENHANCED)
    // ===============================
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            MASTER_PROMPT +
            extraPrompt +
            `

IMPORTANT:
Always include exact headings:
PHASE I
PHASE II
PHASE III
`,
        },
        { role: "user", content: input },
      ],
      max_tokens: 1200,
    })

    const output =
      completion.choices?.[0]?.message?.content ||
      "Decision engine returned no output."

    // ===============================
    // 💾 STORE SESSION (UNCHANGED)
    // ===============================
    await prisma.session.create({
  data: {
    input,
    output,
    ...(userId
      ? {
          user: {
            connect: { id: userId },
          },
        }
      : {}),
  },
})

    return NextResponse.json({ output })
  } catch (error) {
    console.error("SESSION ERROR:", error)

    return NextResponse.json(
      { error: "Session processing failed" },
      { status: 500 }
    )
  }
}