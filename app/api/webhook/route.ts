import Stripe from "stripe"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"
import { sendWelcomeEmail } from "@/lib/sendWelcomeEmail" // ✅ ADDED
export const runtime = "nodejs"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!
export async function POST(req: Request) {
  const body = await req.text()
  const headerList = await headers()
  const sig = headerList.get("stripe-signature")

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (err) {
    console.error("Webhook signature failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    // 🔥 SAFELY GET EMAIL
    let email = session.customer_email

    if (!email && session.customer) {
      const customer = await stripe.customers.retrieve(
        session.customer as string
      )

      if (!("deleted" in customer)) {
        email = customer.email
      }
    }

    if (!email) {
      console.error("Webhook: No email found")
      return NextResponse.json({ received: true })
    }

    console.log("Webhook email:", email)

    const referralUsed = session.metadata?.ref || null

    // 1️⃣ Find or create user
    let user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      const referralCode = crypto
        .randomBytes(4)
        .toString("hex")
        .toUpperCase()

      user = await prisma.user.create({
        data: {
          email,
          referralCode,
        },
      })

      console.log("User created:", email)
    }

    // 2️⃣ Prevent duplicate purchase
    const existingPurchase = await prisma.purchase.findUnique({
      where: { stripeSessionId: session.id },
    })

    if (!existingPurchase) {
      await prisma.purchase.create({
        data: {
          stripeSessionId: session.id,
          userId: user.id,
          referralUsed,
        },
      })

      console.log("Purchase saved:", session.id)

      // ✅ SEND WELCOME EMAIL (ONLY AFTER NEW PURCHASE)
      try {
        await sendWelcomeEmail(email)
        console.log("Welcome email sent:", email)
      } catch (err) {
        console.error("Email send failed:", err)
      }
    }

    // 3️⃣ Credit referral
    if (referralUsed) {
      const referrer = await prisma.user.findUnique({
        where: { referralCode: referralUsed },
      })

      if (referrer) {
        await prisma.user.update({
          where: { id: referrer.id },
          data: {
            referralCredit: {
              increment: 30,
            },
          },
        })

        console.log("Referral credited:", referralUsed)
      }
    }
  }

  return NextResponse.json({ received: true })
}