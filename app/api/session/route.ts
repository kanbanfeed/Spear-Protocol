import OpenAI from "openai"
import { prisma } from "@/lib/prisma"
import { MASTER_PROMPT } from "@/lib/masterPrompt"
import { NextResponse } from "next/server"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function POST(req: Request) {
  try {
    const { input, email } = await req.json()

    if (!input || !email) {
      return NextResponse.json(
        { error: "Missing input or email" },
        { status: 400 }
      )
    }

    // 1️⃣ Validate user exists
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // 2️⃣ Call OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: MASTER_PROMPT },
        { role: "user", content: input },
      ],
      max_tokens: 1200,
    })

    const output =
      completion.choices[0]?.message?.content || "No response generated."

    // 3️⃣ Save session in DB
    await prisma.session.create({
      data: {
        userId: user.id,
        input,
        output,
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