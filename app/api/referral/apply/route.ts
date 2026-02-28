import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"

export async function POST(req: Request) {
  const { referralCode } = await req.json()

  const cookieStore = await cookies()
  const email = cookieStore.get("user_email")?.value

  if (!email) {
    return NextResponse.json({ error: "Not authenticated" })
  }

  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    return NextResponse.json({ error: "User not found" })
  }

  if (user.referralCode === referralCode) {
    return NextResponse.json({ error: "You cannot use your own code" })
  }

  const referrer = await prisma.user.findUnique({
    where: { referralCode },
  })

  if (!referrer) {
    return NextResponse.json({ error: "Invalid referral code" })
  }

  await prisma.user.update({
    where: { id: referrer.id },
    data: {
      referralCredit: {
        increment: 30,
      },
    },
  })

  return NextResponse.json({ success: true })
}