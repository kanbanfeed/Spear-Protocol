import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  try {
    const { email, sessionId } = await req.json()

    // 0. Basic validation
    if (!email || !sessionId) {
      return NextResponse.json(
        { error: "Missing email or session information" },
        { status: 400 }
      )
    }

    // 1. Verify Stripe session
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (!session || session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Payment not completed or invalid session" },
        { status: 400 }
      )
    }

    // 2. Get correct email from Stripe (IMPORTANT FIX)
    const stripeEmail =
      session.customer_email ||
      session.customer_details?.email ||
      ""

    const cleanStripeEmail = stripeEmail.trim().toLowerCase()
    const cleanUserEmail = email.trim().toLowerCase()

    // 🚨 STRICT MATCH CHECK
    if (!cleanStripeEmail || cleanStripeEmail !== cleanUserEmail) {
      return NextResponse.json(
        {
          error:
            "The email entered does not match the email used for payment. Please use the same email to activate your access.",
        },
        { status: 400 }
      )
    }

    // 3. Ensure session exists in DB (webhook validation)
    const purchase = await prisma.purchase.findUnique({
      where: { stripeSessionId: sessionId },
    })

    if (!purchase) {
      return NextResponse.json(
        { error: "Payment not recorded. Please try again." },
        { status: 400 }
      )
    }

    // 4. Create or update user
    let user = await prisma.user.findUnique({
      where: { email: cleanUserEmail },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: cleanUserEmail,
          referralCode: Math.random().toString(36).substring(2, 8),
          subscriptionStatus: "active",
        },
      })
    } else {
      await prisma.user.update({
        where: { email: cleanUserEmail },
        data: {
          subscriptionStatus: "active",
        },
      })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error("ACTIVATION ERROR:", error)

    return NextResponse.json(
      { error: "Activation failed. Please try again." },
      { status: 500 }
    )
  }
}