import Stripe from "stripe"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"
import { sendWelcomeEmail } from "@/lib/sendWelcomeEmail"

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

  // ===============================
  // CHECKOUT COMPLETED (SUBSCRIBE)
  // ===============================
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

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

    const referralUsed = session.metadata?.ref || null

    // Find or create user
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
    }

    // SAVE SUBSCRIPTION INFO (NEW)
    if (session.subscription) {
      await prisma.user.update({
        where: { email },
        data: {
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: session.subscription as string,
          subscriptionStatus: "active",
        },
      })
    }

    // Prevent duplicate purchase
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

      try {
        await sendWelcomeEmail(email)
      } catch (err) {
        console.error("Email send failed:", err)
      }
    }

    // Referral credit (UNCHANGED)
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
      }
    }
  }

  // ==================================
  // SUBSCRIPTION UPDATED / CANCELLED
  // ==================================
  if (
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted"
  ) {
    const subscription = event.data.object as Stripe.Subscription

    const customerId = subscription.customer as string

    const user = await prisma.user.findFirst({
      where: { stripeCustomerId: customerId },
    })

    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          subscriptionStatus: subscription.status,
        },
      })
    }
  }

  // ==================================
  // PAYMENT FAILED
  // ==================================
  if (event.type === "invoice.payment_failed") {
    const invoice = event.data.object as Stripe.Invoice

    const customerId = invoice.customer as string

    const user = await prisma.user.findFirst({
      where: { stripeCustomerId: customerId },
    })

    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          subscriptionStatus: "past_due",
        },
      })
    }
  }

  return NextResponse.json({ received: true })
}